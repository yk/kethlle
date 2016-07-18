import 'reflect-metadata';
import { Component } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { InjectUser } from 'angular2-meteor-accounts-ui';
import { Meteor } from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';
import template from './login.html';
 
@Component({
    template,
})
@InjectUser("user")
export class Login extends MeteorComponent{
    username: string = 'dev';
    user: Meteor.User;

    loginDev(username){
        Accounts.callLoginMethod({methodArguments: [{apacheUser: username}]});
    }

    logout(){
        Accounts.logout();
    }

    loginLDAP(username, password){
        Meteor.loginWithLDAP(username, password, {
            dn: 'cn=' + username + ',ou=users,ou=nethz,ou=id,ou=auth,o=ethz,c=ch',
        }, (a,b,c) => {
            console.log(a);
            console.log(b);
            console.log(c);
        });
    }
}
