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
}
