import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {Teams, IncompleteTeams, Submissions, GridFileSystem} from './collections/collections';
import {check} from 'meteor/check';
import * as _u from 'lodash';

let loginCheck = () => {
    if(!Meteor.user()){
        throw new Meteor.Error('403', 'Not logged in!');
    }
};

let userTeam = (taskId, userId) => Teams.findOne({taskId: taskId, 'members': userId});

let userIncompleteTeam = (taskId, userId) => IncompleteTeams.findOne({taskId: taskId, 'members.userId': userId});

let notInTeamOrITeamCheck = (taskId, userId) => {
    let t = userTeam(taskId, userId);
    let it = userIncompleteTeam(taskId, userId);
    if(t || it){
        throw new Meteor.Error('403', 'Already in a team');
    }
};

Meteor.methods({
    acceptToc: function(){
        loginCheck();
        let atoc = Meteor.user().acceptToc || new Date().getTime();
        Meteor.users.update(Meteor.userId(), {$set: {acceptToc: atoc}});
    },
    createTeam: function(taskId: string, name: string, members: string){
        check(taskId, String);
        check(name, String);
        check(members, String);
        loginCheck();
        let mlist = members.split(',').map(s => s.trim()).filter(s => s.length > 0);
        let uid = Meteor.userId();
        if(mlist.indexOf(uid) < 0){
            mlist.unshift(uid);
        }
        mlist = _u.uniq(mlist);
        mlist.forEach(m => notInTeamOrITeamCheck(taskId, m));
        let mObjList = mlist.map(m => {
            return { userId: m, confirmed: false };
        });
        IncompleteTeams.insert({
            taskId: taskId,
            name: name,
            members: mObjList,
        });
    },
    confirmTeam: function(taskId: string){
        check(taskId, String);
        loginCheck();
        let team = userIncompleteTeam(taskId, Meteor.userId());
        if(!team){
            throw new Meteor.Error('403', 'Not in team');
        }
        IncompleteTeams.update({_id: team._id, 'members.userId': Meteor.userId()}, {$set: {'members.$.confirmed': true}});
    },
    declineTeam: function(taskId: string){
        check(taskId, String);
        loginCheck();
        let team = userIncompleteTeam(taskId, Meteor.userId());
        if(!team){
            throw new Meteor.Error('403', 'Not in team');
        }
        IncompleteTeams.remove(team._id);
    },
    finalizeTeam: function(taskId: string){
        check(taskId, String);
        loginCheck();
        let team = userIncompleteTeam(taskId, Meteor.userId());
        if(!team){
            throw new Meteor.Error('403', 'Not in team');
        }
        if(!_.every(team.members, m => m.confirmed)){
            throw new Meteor.Error('403', 'Not all members confirmed');
        }
        Teams.insert({
            taskId: team.taskId,
            name: team.name,
            members: team.members.map(m => m.userId),
        });
        IncompleteTeams.remove(team._id);
    },
    createSubmission: function(userSub: Submission){
        loginCheck();
        let taskId = userSub.taskId;
        check(taskId, String);
        let comment = userSub.comment || '';
        check(comment, String);
        let team = userTeam(taskId, Meteor.userId());
        if(!team){
            throw new Meteor.Error('403', 'Not in team');
        }
        let file;
        try{
            if(Meteor.isServer){
                file = Meteor.wrapAsync(GridFileSystem.writeFile, GridFileSystem)({}, userSub.data)
            }else{
                file = {_id: '...'};
            }
        }catch(err){
            console.log(err);
            throw new Meteor.Error('400', 'Could not write file');
        }
        let sub = <Submission>{
            taskId: taskId,
            teamId: team._id,
            teamName: team.name,
            userId: Meteor.userId(),
            comment: comment,
            createdAt: new Date(),
            fileId: file._id,
            score: Math.random(),
            scoredAt: new Date(),
        };
        Submissions.insert(sub);
    },
});
