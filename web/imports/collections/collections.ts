import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import * as _u from 'lodash';

export let Teams = new Mongo.Collection<Team>('teams');
export let IncompleteTeams = new Mongo.Collection<IncompleteTeam>('incompleteteams');
export let Submissions = new Mongo.Collection<Submission>('submissions');
