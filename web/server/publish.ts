import {Meteor} from 'meteor/meteor';
import {Teams, IncompleteTeams, Submissions} from '../imports/collections/collections';
import * as _u from 'lodash';

Meteor.publish('userData', function(){
    return Meteor.users.find(this.userId, {fields: {acceptToc: true}});
});

Meteor.publish('teams', function(taskId){
    return Teams.find({taskId: taskId, members: this.userId});
});

Meteor.publish('incompleteteams', function(taskId){
    return IncompleteTeams.find({taskId: taskId, 'members.userId': this.userId});
});

Meteor.publish('submissions', function(taskId){
    return Submissions.find({taskId: taskId, $or: [{teamId: {$in: Teams.find({taskId: taskId, members: this.userId}).map(t => t._id)}}, {score: {$exists: true}}]});
});

Meteor.publish('leaderboard', function(taskId){
    return Submissions.find({taskId: taskId, score: {$exists: true}}, {fields: {taskId: true, teamName: true, score: true, createdAt: true}});
});

//publish files maybe
//https://github.com/VeliovGroup/Meteor-Files
