import 'reflect-metadata';
import { Component, NgZone } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { InjectUser } from 'angular2-meteor-accounts-ui';
import { Meteor } from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';
import {Router} from '@angular/router';

import {MdInput} from '@angular2-material/input';
import {MdButton} from '@angular2-material/button';

import template from './login.html';
 
@Component({
    template,
    directives: [MdInput, MdButton],
})
@InjectUser("user")
export class Login extends MeteorComponent{
    username: string = '';
    password: string = '';
    user: Meteor.User;

    constructor(private router: Router, private ngZone: NgZone){
        super();
    }

    login(){
        if(this.username.indexOf('dev') == 0){
            this.loginDev(this.username);
        }else{
            this.loginLDAP(this.username, this.password);
        }
        this.username = '';
        this.password = '';
    }


    loginDev(username){
        Accounts.callLoginMethod({methodArguments: [{apacheUser: username}]});
    }

    loginLDAP(username, password){
        Meteor.loginWithLDAP(username, password, {
            dn: 'cn=' + username + ',ou=users,ou=nethz,ou=id,ou=auth,o=ethz,c=ch',
        }, (err) => {
            if(err){
                console.log(err);
            }else{
                this.ngZone.run(() => {
                    this.router.navigate(['/']);
                });
            }
        });
    }

    logout(){
        Accounts.logout();
    }
}
