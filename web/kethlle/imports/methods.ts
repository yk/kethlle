import {Meteor} from 'meteor/meteor';
import {Competitions, Teams, Submissions} from './collections/collections';
import {check} from 'meteor/check';

let loginCheck = () => {
    if(!Meteor.user()){
        throw new Meteor.Error('403', 'Not logged in!');
    }
};

let participatingCheck = (competitionId) => {
    if(Competitions.find({_id: competitionId, participants: Meteor.user().username}).count() == 0){
        throw new Meteor.Error('403', 'Not participating in competition!');
    }
};

let userTeam = (competitionId) => {
    return Teams.findOne({competitionId: competitionId, members: Meteor.user().username});
};


Meteor.methods({
    createCompetition: function(name: string){
        check(name, String);
        loginCheck();
        Competitions.insert({
            name: name,
            description: '',
            admins: [Meteor.user().username],
            participants: [],
            solution: '',
            scoring: 'l2'
        });
    },
    participateInCompetition: function(competitionId: string){
        check(competitionId, String);
        loginCheck();
        Competitions.update(competitionId, {$addToSet: {participants: Meteor.user().username}});
    },
    unparticipateInCompetition: function(competitionId: string){
        check(competitionId, String);
        loginCheck();
        Competitions.update(competitionId, {$pull: {participants: Meteor.user().username}});
    },
    createTeam: function(competitionId: string, name: string){
        check(competitionId, String);
        check(name, String);
        loginCheck();
        participatingCheck(competitionId);
        if(!userTeam(competitionId)){
            Teams.insert({
                name: name,
                competitionId: competitionId,
                members: [Meteor.user().username],
            });
        }
    },
    joinTeam: function(competitionId: string, teamId: string){
        check(competitionId, String);
        check(teamId, String);
        loginCheck();
        participatingCheck(competitionId);
        if(!userTeam(competitionId)){
            Teams.update(teamId, {$addToSet: {members: Meteor.user().username}});
        }
    },
    leaveTeam: function(competitionId: string){
        check(competitionId, String);
        loginCheck();
        participatingCheck(competitionId);
        let team = userTeam(competitionId);
        if(team){
            Teams.update(team._id, {$pull: {members: Meteor.user().username}});
            Teams.remove({members: {$size: 0}});
        }
    },
    makeSubmission: function(competitionId: string, data: string, comment: string){
        check(competitionId, String);
        check(data, String);
        check(comment, String);
        loginCheck();
        participatingCheck(competitionId);
        let team = userTeam(competitionId);
        let teamId = '';
        if(team){
            teamId = team._id;
        }
        Submissions.insert({
            competitionId: competitionId,
            username: Meteor.user().username,
            teamId: teamId,
            data: data,
            comment: comment,
            created: new Date(),
        });
    },
    scoreSubmission: function(subId: string){
        check(subId, String);
        loginCheck();
        let sub = Submissions.findOne(subId);
        if(!sub)
            return;
        let competition = Competitions.findOne({_id: sub.competitionId, admins: Meteor.user().username});
        if(!competition)
            return;
        //score
        if(!sub.data || !competition.solution)
            return;
        let score = null;
        if(competition.scoring == 'l2'){
            score = parseFloat(sub.data) - parseFloat(competition.solution)
            score = score * score
        }
        if(score == null)
            return;
        Submissions.update(sub._id, {$set: {score: score, scored: new Date()}});
    },
});
