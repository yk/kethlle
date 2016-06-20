import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import * as _u from 'lodash';

export let Competitions = new Mongo.Collection<Competition>('competitions');
export let Teams = new Mongo.Collection('teams');
export let Submissions = new Mongo.Collection('submissions');

let loggedIn = function(){return !!Meteor.user();}

Competitions.allow({
    update: function(userId, doc, fields, modifiers){
        return !!Meteor.user() && _u.includes(doc.admins, Meteor.user().username);
    },
    remove: function(userId, doc){
        return !!Meteor.user() && _u.includes(doc.admins, Meteor.user().username);
    },
});

Submissions.allow({
    remove: function(userId, doc){
        return !!Meteor.user() && _u.includes(Competitions.findOne(doc.competitionId).admins, Meteor.user().username);
    },
});
