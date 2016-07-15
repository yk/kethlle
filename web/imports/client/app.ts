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

import { Home } from './home/home';
import { Account } from './account/account';
import { CompetitionDetail } from './competition-detail/competition-detail';
import { CompetitionInfo } from './competition-detail/competition-info';
import { CompetitionLeaderboard } from './competition-detail/competition-leaderboard';
import { CompetitionSubmit } from './competition-detail/competition-submit';
import { CompetitionAdmin } from './competition-detail/competition-admin';
import { CompetitionTeams } from './competition-detail/competition-teams';

import { CompetitionList } from './competition-list/competition-list';
import '../methods.ts';

import {HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {OVERLAY_CONTAINER_TOKEN} from '@angular2-material/core/overlay/overlay';
import {MdLiveAnnouncer} from '@angular2-material/core/a11y/live-announcer';
import {createOverlayContainer} from '@angular2-material/core/overlay/overlay-container';
import {MdGestureConfig} from '@angular2-material/core/gestures/MdGestureConfig';
import {MdIconRegistry} from '@angular2-material/icon/icon-registry';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdButton} from '@angular2-material/button';
import {MdIcon} from '@angular2-material/icon';
 
@Component({
      selector: 'app',
        templateUrl: Constants.BASE + 'imports/client/app.html',
        directives: [ROUTER_DIRECTIVES, MD_SIDENAV_DIRECTIVES, MdToolbar, MdButton, MdIcon],
})
class KethlleApp {
    public views: Object[] = [
        {
            name: 'Home',
            path: '/'
        },
    ];
}
 
bootstrap(KethlleApp, [
    provide(APP_BASE_HREF, {useValue: '/'}),
    provideRouter([
        { path: '', component: Home},
        { path: 'account', component: Account},
        { path: 'competition-list', component: CompetitionList},
        { path: 'competition-detail/:id', component: CompetitionDetail, children: [
            { path: '', component: CompetitionInfo },
            { path: 'leaderboard', component: CompetitionLeaderboard },
            { path: 'submit', component: CompetitionSubmit },
            { path: 'admin', component: CompetitionAdmin },
            { path: 'teams', component: CompetitionTeams },
        ]},
    ]),
    disableDeprecatedForms(),
    provideForms(),
    MdLiveAnnouncer,
    {provide: OVERLAY_CONTAINER_TOKEN, useValue: createOverlayContainer()},
    MdIconRegistry,
    {provide: HAMMER_GESTURE_CONFIG, useClass: MdGestureConfig},
    HTTP_PROVIDERS,
]);
