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
import {MdSpinner} from '@angular2-material/progress-circle';

import {TasksService} from '../services/tasks';
import {Teams, Submissions} from '../../collections/collections';
import {FilePicker} from '../filepicker/filepicker';
import {MarkdownPipe} from '../pipes/markdown.pipe';

import {PaginatePipe, PaginationControlsCmp, PaginationService} from 'ng2-pagination';

import template from './task.html';
 
@Component({
    template,
    directives: [ ROUTER_DIRECTIVES, MdCard, MdButton, MdInput, MdSpinner, FilePicker, PaginationControlsCmp ],
    pipes: [MarkdownPipe, PaginatePipe],
    providers: [PaginationService],
})
@InjectUser("user")
export class TaskComponent extends MeteorComponent{
    public task: Task;
    public user: Meteor.User;
    public team: Team;
    public submissions: Mongo.Cursor<Submission>;
    public ownSubmissions: Mongo.Cursor<Submission>;
    private comment: string = '';
    private submissionInProgress: boolean = false;

    constructor(private tasksService: TasksService, private route: ActivatedRoute){
        super();
        this.task = tasksService.tasks.find(t => t._id == route.snapshot.params['id']);
        this.subscribe('teams', this.task._id, () => {
            this.team = Teams.findOne({taskId: this.task._id});
        }, true);
        this.subscribe('submissions', this.task._id, () => this.readSubmissions(), true);
        this.subscribe('leaderboard', this.task._id, () => this.readSubmissions(), true);
    }

    readSubmissions(){
        // need fetching for pagination...
        this.submissions = Submissions.find({taskId: this.task._id, score: {$exists: true}}, {sort: {score: -1}});
        this.ownSubmissions = Submissions.find({taskId: this.task._id, teamId: {$exists: true}}, {sort: {createdAt: -1}});
    }

    createSubmission(fp){
        let r = new FileReader();
        let file = fp.file;
        let fn = file.name;
        this.submissionInProgress = true;
        r.onabort = evt => {this.submissionInProgress = false;};
        r.onerror = evt => {this.submissionInProgress = false;};
        r.onload = evt => {
            Meteor.call('createSubmission', {taskId: this.task._id, filename: fn, comment: this.comment, data: r.result}, (err) => {
                this.submissionInProgress = false;
            });
            this.comment = '';
            fp.clear();
        };
        r.readAsBinaryString(file);
    }

}
