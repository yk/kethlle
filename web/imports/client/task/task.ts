import 'reflect-metadata';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import { ROUTER_DIRECTIVES} from '@angular/router';
import { MeteorComponent } from 'angular2-meteor';
import {Mongo} from 'meteor/mongo';
import { InjectUser } from 'angular2-meteor-accounts-ui';

import {MdCard} from '@angular2-material/card';
import {MdButton} from '@angular2-material/button';
import {MdInput} from '@angular2-material/input';

import {TasksService} from '../services/tasks';
import {Teams, Submissions} from '../../collections/collections';

import template from './task.html';
 
@Component({
    template,
    directives: [ ROUTER_DIRECTIVES, MdCard, MdButton, MdInput ],
})
@InjectUser("user")
export class TaskComponent extends MeteorComponent{
    public task: Task;
    public user: Meteor.User;
    public team: Team;
    public submissions: Mongo.Cursor<Submission>;

    constructor(private tasksService: TasksService, private route: ActivatedRoute){
        super();
        this.task = tasksService.tasks.find(t => t._id == route.snapshot.params['id']);
        this.subscribe('teams', this.task._id, () => {
            this.team = Teams.findOne({taskId: this.task._id});
        }, true);
        this.subscribe('submissions', this.task._id, () => {
            this.submissions = Submissions.find({taskId: this.task._id});
        }, true);
    }

    createSubmission(comment){
        Meteor.call('createSubmission', {taskId: this.task._id, comment: comment});
    }

}
