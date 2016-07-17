import 'reflect-metadata';
import {Component, NgZone} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import { ROUTER_DIRECTIVES} from '@angular/router';
import { MeteorComponent } from 'angular2-meteor';
import {Mongo} from 'meteor/mongo';
import {IncompleteTeams} from '../../collections/collections';
import { InjectUser } from 'angular2-meteor-accounts-ui';

import {MdCard} from '@angular2-material/card';
import {MdButton} from '@angular2-material/button';
import {MdInput} from '@angular2-material/input';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';

import {TasksService} from '../services/tasks';
import * as _u from 'lodash';

import template from './teams.html';
 
@Component({
    template,
    directives: [ ROUTER_DIRECTIVES, MdCard, MdButton, MdInput],
})
@InjectUser("user")
export class TeamsComponent extends MeteorComponent{
    public task: Task;
    public team: IncompleteTeam;
    public user: Meteor.User;

    constructor(private tasksService: TasksService, private route: ActivatedRoute, private router: Router, private ngZone: NgZone){
        super();
        this.task = tasksService.tasks.find(t => t._id == route.snapshot.params['id']);
        this.subTeam();
    }

    subTeam(){
        this.subscribe('incompleteteams', this.task._id, () => {
            this.team = IncompleteTeams.findOne();
            if(this.team && _u.every(this.team.members, m => m.confirmed)){
                Meteor.call('finalizeTeam', this.task._id, () => {
                    this.ngZone.run(() => 
                        this.router.navigate(['/tasks', this.task._id])
                                   );
                });
            }
        }, true);
    }

    userIsConfirmed(){
        return this.team.members.find(m => m.userId == this.user._id).confirmed;
    }

    createTeam(name, members){
        Meteor.call('createTeam', this.task._id, name, members, () => {
            this.subTeam();
        });
    }

    confirmTeam(){
        Meteor.call('confirmTeam', this.task._id, () => {
            this.subTeam();
        });
    }

    declineTeam(){
        Meteor.call('declineTeam', this.task._id, () => {
            this.subTeam();
        });
    }

}
