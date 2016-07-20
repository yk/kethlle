import 'reflect-metadata';
import 'zone.js/dist/zone';
import { Component, NgZone, provide, PlatformRef } from '@angular/core';
import {Constants} from '../constants';
import { APP_BASE_HREF } from '@angular/common';
import { ROUTER_DIRECTIVES, provideRouter, Router } from '@angular/router';
//import { bootstrap } from 'angular2-meteor-auto-bootstrap';
import { bootstrap } from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';
import {disableDeprecatedForms, provideForms} from '@angular/forms';

import {Meteor} from 'meteor/meteor';
import { MeteorComponent } from 'angular2-meteor';
import { InjectUser } from 'angular2-meteor-accounts-ui';

import { Home } from './home/home';
import { Login } from './login/login';
import {TaskComponent} from './task/task';
import {TeamsComponent} from './teams/teams';
import {AuthGuard} from './guards/auth.guard';
import {TeamGuard} from './guards/team.guard';

import {TasksService} from './services/tasks';

import '../methods.ts';

import {HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {OVERLAY_CONTAINER_TOKEN} from '@angular2-material/core/overlay/overlay';
import {MdLiveAnnouncer} from '@angular2-material/core/a11y/live-announcer';
import {createOverlayContainer} from '@angular2-material/core/overlay/overlay-container';
import {MdGestureConfig} from '@angular2-material/core/gestures/MdGestureConfig';
import {MdIconRegistry} from '@angular2-material/icon/icon-registry';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MD_LIST_DIRECTIVES} from '@angular2-material/list';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdButton} from '@angular2-material/button';
import {MdIcon} from '@angular2-material/icon';

import template from './app.html';
 
@Component({
      selector: 'app',
        //templateUrl: Constants.BASE + 'imports/client/app.html',
        template,
        directives: [ROUTER_DIRECTIVES, MD_SIDENAV_DIRECTIVES, MD_LIST_DIRECTIVES, MdToolbar, MdButton, MdIcon],
})
@InjectUser('user')
class KethlleApp extends MeteorComponent {
    public user: Meteor.User;
    public views: Object[] = [
        {
            name: 'Home',
            path: '/'
        },
        {
            name: 'Login',
            path: '/login'
        },
    ];

    constructor(){
        super();
        this.subscribe('userData');
    }

    acceptToc(){
        Meteor.call('acceptToc');
    }
}
 
bootstrap(KethlleApp, [
    provide(APP_BASE_HREF, {useValue: Constants.BASE}),
    AuthGuard, TeamGuard, TasksService,
    provideRouter([
        { path: '', component: Home, canActivate: [AuthGuard]},
        { path: 'login', component: Login},
        { path: 'tasks/:id', component: TaskComponent, canActivate: [AuthGuard, TeamGuard]},
        { path: 'tasks/:id/teams', component: TeamsComponent, canActivate: [AuthGuard, TeamGuard]},
    ]),
    disableDeprecatedForms(),
    provideForms(),
    MdLiveAnnouncer,
    {provide: OVERLAY_CONTAINER_TOKEN, useValue: createOverlayContainer()},
    MdIconRegistry,
    {provide: HAMMER_GESTURE_CONFIG, useClass: MdGestureConfig},
    HTTP_PROVIDERS,
]);
