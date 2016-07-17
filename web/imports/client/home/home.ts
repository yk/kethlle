import 'reflect-metadata';
import { Component} from '@angular/core';
import { ROUTER_DIRECTIVES} from '@angular/router';
import { MeteorComponent } from 'angular2-meteor';
import {Mongo} from 'meteor/mongo';
import { InjectUser } from 'angular2-meteor-accounts-ui';
import {MdCard} from '@angular2-material/card';
import {MdButton} from '@angular2-material/button';

import {TasksService} from '../services/tasks';

import template from './home.html';
 
@Component({
    template,
    directives: [ ROUTER_DIRECTIVES, MdCard, MdButton ],
})
@InjectUser("user")
export class Home extends MeteorComponent{
    //public tasks: Mongo.Cursor<Task>;
    public user: Meteor.User;

    constructor(private tasksService: TasksService){
        super();
        //this.subscribe('tasks', () => {
            //this.tasks = Tasks.find();
        //}, true);
    }

}
