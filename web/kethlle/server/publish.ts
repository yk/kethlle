import {Meteor} from 'meteor/meteor';
import {Competitions, Teams, Submissions} from '../imports/collections/collections';
import * as _u from 'lodash';

function user(userId){
    return Meteor.users.findOne(userId);
}

Meteor.publish('competitions', function(){
    return Competitions.find({}, {
        transform: (c) => {
            return c;
        }
    });
});

Meteor.publish('teams', function(competitionId: string){
    return Teams.find({competitionId: competitionId});
});

Meteor.publish('submissionsAdmin', function(competitionId: string){
    let competition = Competitions.findOne(competitionId) 
    if(!competition || !this.userId)
        return null;
    if(!_u.includes(competition.admins, user(this.userId).username))
        return null;
    return Submissions.find({competitionId: competitionId});
});

Meteor.publish('submissions', function(competitionId: string){
    if(!this.userId)
        return null;
    let teamId = Teams.findOne({competitionId: competitionId, members: user(this.userId).username});
    return Submissions.find({competitionId: competitionId,
                            $or: [
                                {username: user(this.userId).username},
                                {$and: [
                                    {teamId: {$ne: ''}},
                                    {teamId: {$eq: teamId}},
                                ]},
                            ]});
});

Meteor.publish('userTeam', function(competitionId: string){
    if(!this.userId)
        return null;
    return Teams.find({competitionId: competitionId, members: user(this.userId).username});
});
