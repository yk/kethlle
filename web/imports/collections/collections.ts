import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import * as fs from 'fs';
import * as Grid from 'gridfs';
import * as _u from 'lodash';


export const Teams = new Mongo.Collection<Team>('teams');
export const IncompleteTeams = new Mongo.Collection<IncompleteTeam>('incompleteteams');
export const Submissions = new Mongo.Collection<Submission>('submissions');

export let GridFileSystem;
if (Meteor.isServer) {
    let mongo = MongoInternals.NpmModules.mongodb.module; // eslint-disable-line no-undef
    GridFileSystem = Grid(Meteor.users.rawDatabase(), mongo);
}else{
    // mocking for client
    GridFileSystem = {
        writeFile: function(options, data, cb){
            cb(null, {_id: '0'});
        },
    }
}

