import {Teams, IncompleteTeams, Submissions} from '../imports/collections/collections';
import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import './publish.ts';
import '../imports/methods.ts';

Meteor.startup(() => {
    Teams.find().count();
    IncompleteTeams.find().count();
    Submissions.find().count();

    Accounts.config({
        forbidClientAccountCreation: true
    });
});


Accounts.registerLoginHandler(function(loginRequest){ 
    //console.log(this.connection);
    //console.log(loginRequest);
    if(!loginRequest.apacheUser){
        return undefined;
    }
    let userId = null;
    let user = Meteor.users.findOne(loginRequest.apacheUser);
    if(!user){
        userId = Meteor.users.insert({_id: loginRequest.apacheUser, 
                                     username: loginRequest.apacheUser,
                                     acceptToc: false});
    }else{
        userId = user._id;
    }
    return {userId: userId};
});