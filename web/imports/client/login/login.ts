import 'reflect-metadata';
import { Component, NgZone } from '@angular/core';
import { Router} from '@angular/router';
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
    username: string = '';
    password: string = '';
    user: Meteor.User;

    constructor(private router: Router, private ngZone: NgZone){
        super();
    }

    loginDev(username){
        Accounts.callLoginMethod({methodArguments: [{apacheUser: username}]});
    }

    logout(){
        Accounts.logout();
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
}
