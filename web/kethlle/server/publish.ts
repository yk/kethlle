import {Meteor} from 'meteor/meteor';
import {Competitions, Submissions} from '../imports/collections/collections';
import * as _u from 'lodash';

function user(userId){
    return Meteor.users.findOne(userId);
}

Meteor.publish('competitions', function(){
    return Competitions.find();
});

Meteor.publish('submissionsAdmin', function(competitionId: string){
    let competition = Competitions.findOne(competitionId) 
    if(!competition || !this.userId)
        return null;
    if(!_u.includes(competition.admins, this.userId))
        return null;
    return Submissions.find({competitionId: competitionId});
});

Meteor.publish('submissions', function(competitionId: string){
    if(!this.userId)
        return null;
    let tcomp = Competitions.findOne({_id: competitionId, 'teams.members': this.userId}, {fields: {'teams.$': 1}});
    let teamId = tcomp && tcomp.teams[0]._id || '';
    return Submissions.find({competitionId: competitionId,
                            $or: [
                                {userId: this.userId},
                                {$and: [
                                    {teamId: {$ne: ''}},
                                    {teamId: {$eq: teamId}},
                                ]},
                            ]});
});

