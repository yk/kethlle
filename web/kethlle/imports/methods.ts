import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {Competitions, Submissions} from './collections/collections';
import {check} from 'meteor/check';

let loginCheck = () => {
    if(!Meteor.user()){
        throw new Meteor.Error('403', 'Not logged in!');
    }
};

let participatingCheck = (competitionId) => {
    if(Competitions.find({_id: competitionId, participants: Meteor.userId()}).count() == 0){
        throw new Meteor.Error('403', 'Not participating in competition!');
    }
};

let userTeam = (competitionId) => {
    let comp =  Competitions.findOne({_id: competitionId, 'teams.members': Meteor.userId()}, {'teams.$': 1});
    return comp && comp.teams[0] || null;
};


Meteor.methods({
    createCompetition: function(name: string){
        check(name, String);
        loginCheck();
        Competitions.insert({
            name: name,
            description: '',
            admins: [Meteor.userId()],
            participants: [],
            solution: '',
            scoring: 'l2',
            teams: []
        });
    },
    participateInCompetition: function(competitionId: string){
        check(competitionId, String);
        loginCheck();
        Competitions.update(competitionId, {$addToSet: {participants: Meteor.userId()}});
    },
    unparticipateInCompetition: function(competitionId: string){
        check(competitionId, String);
        loginCheck();
        Competitions.update(competitionId, {$pull: {participants: Meteor.userId()}});
    },
    createTeam: function(competitionId: string, name: string){
        check(competitionId, String);
        check(name, String);
        loginCheck();
        participatingCheck(competitionId);
        if(!userTeam(competitionId)){
            Competitions.update(competitionId, {
                $addToSet: {
                    teams: {
                        _id: new Mongo.ObjectID()._str,
                        name: name,
                        members: [Meteor.userId()],
                    }
                }});
        }
    },
    joinTeam: function(competitionId: string, teamId: string){
        check(competitionId, String);
        check(teamId, String);
        loginCheck();
        participatingCheck(competitionId);
        if(!userTeam(competitionId)){
            Competitions.update({_id: competitionId, 'teams._id': teamId}, {$addToSet: {'teams.$.members': Meteor.userId()}});
        }
    },
    leaveTeam: function(competitionId: string){
        check(competitionId, String);
        loginCheck();
        participatingCheck(competitionId);
        let team = userTeam(competitionId);
        if(team && team._id){
            let deleteTeam = team.members.length < 2;
            console.log(team.members);
            if(!deleteTeam){
                Competitions.update({_id: competitionId, 'teams._id': team._id, 'teams.members': Meteor.userId()}, {$pull: {'teams.$.members': Meteor.userId()}});
            }else{
                Competitions.update({_id: competitionId}, {$pull: {teams: {_id: team._id}}});
                Submissions.remove({teamId: team._id}); // maybe this is not needed
            }
        }
    },
    makeSubmission: function(competitionId: string, data: string, comment: string){
        check(competitionId, String);
        check(data, String);
        check(comment, String);
        loginCheck();
        participatingCheck(competitionId);
        let team = userTeam(competitionId);
        let teamId = team && team._id || '';
        Submissions.insert({
            competitionId: competitionId,
            userId: Meteor.userId(),
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
        let competition = Competitions.findOne({_id: sub.competitionId, admins: Meteor.userId()});
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
