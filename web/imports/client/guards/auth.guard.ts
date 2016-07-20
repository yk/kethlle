import {Injectable, NgZone} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Tracker} from 'meteor/tracker';
import {Meteor} from 'meteor/meteor';
import {Router} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private ngZone: NgZone){}

    canActivate(route) {
        return Observable.create(obs => {
            Tracker.autorun(() => {
                let user = Meteor.user();
                if(!user){
                    this.router.navigate(['/login'])
                }else{
                    obs.next(true);
                    obs.complete();
                }
            });
        });
    }
}
