import 'reflect-metadata';
import { Component, NgZone, EventEmitter} from '@angular/core';
import { ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';
import { MeteorComponent } from 'angular2-meteor';
import {Competitions} from '../../collections/collections';
import {Tracker} from 'meteor/tracker';
import { InjectUser } from 'angular2-meteor-accounts-ui';
import * as _u from 'lodash';
 
@Component({
    templateUrl: '/imports/client/competition-detail/competition-detail.html',
    directives: [ ROUTER_DIRECTIVES ],
})
@InjectUser("user")
export class CompetitionDetail extends MeteorComponent{
    public competitionId: string;
    public competition: Competition;
    public competitionUpdated: EventEmitter<Competition>;
    public user: Meteor.User;

    constructor(route: ActivatedRoute, ngZone: NgZone){
        super();
        this.competitionId = route.snapshot.params.id;
        this.competitionUpdated = new EventEmitter<Competition>();
        this.subscribe('competitions', () => {
            this.autorun(() => {
                ngZone.run(()=>{
                    this.competition = Competitions.findOne(this.competitionId);
                    this.competitionUpdated.emit(this.competition);
                });
            });
        }, true);
    }

    participating(){
        return this.competition && Meteor.user() && _u.includes(this.competition.participants, Meteor.user().username);
    }

    isAdmin(){
        return this.competition && Meteor.user() && _u.includes(this.competition.admins, Meteor.user().username);
    }

}
