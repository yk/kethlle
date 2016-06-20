import 'reflect-metadata';
import 'zone.js/dist/zone';
import { Component, NgZone, provide, PlatformRef } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { ROUTER_DIRECTIVES, provideRouter, Router } from '@angular/router';
//import { bootstrap } from 'angular2-meteor-auto-bootstrap';
import { bootstrap } from '@angular/platform-browser-dynamic';
import {disableDeprecatedForms, provideForms} from '@angular/forms';

import { Home } from './home/home';
import { Account } from './account/account';
import { Nav } from './nav/nav';
import { CompetitionDetail } from './competition-detail/competition-detail';
import { CompetitionInfo } from './competition-detail/competition-info';
import { CompetitionLeaderboard } from './competition-detail/competition-leaderboard';
import { CompetitionSubmit } from './competition-detail/competition-submit';
import { CompetitionAdmin } from './competition-detail/competition-admin';
import { CompetitionTeams } from './competition-detail/competition-teams';

import { CompetitionList } from './competition-list/competition-list';
import '../methods.ts';
 
@Component({
      selector: 'app',
        templateUrl: '/imports/client/app.html',
        directives: [ROUTER_DIRECTIVES, Nav],
})
class KethlleApp { }
 
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
    provideForms()
]);
