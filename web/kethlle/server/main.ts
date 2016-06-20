import {Competitions, Teams} from '../imports/collections/collections';
import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import './publish.ts';
import '../imports/methods.ts';

Meteor.startup(() => {
    Competitions.find().count();
    Teams.find().count();

    console.log(Competitions.find().count());
    if(Competitions.find().count() == 0){
        Competitions.insert({
            name: 'da competition',
            description: 'this is da competition y0y0',
            admins: ['yk'],
            participants: [],
            solution: '',
            scoring: ''
        });
    }
    console.log(Meteor.users.find().count());
    if(Meteor.users.find().count() == 0){
        Meteor.users.insert({
            username: 'yk',
        });
    }

});


Accounts.registerLoginHandler(function(loginRequest){ 
    //console.log(this.connection);
    //console.log(loginRequest);
    if(!loginRequest.apacheUser){
        return undefined;
    }
    let userId = null;
    let user = Meteor.users.findOne({username: loginRequest.apacheUser});
    if(!user){
        userId = Meteor.users.insert({username: loginRequest.apacheUser});
    }else{
        userId = user._id;
    }
    return {userId: userId};
});
