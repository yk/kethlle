import 'reflect-metadata';
import { CompetitionDetail } from './competition-detail';
import { Component, Input } from '@angular/core';
import { MeteorComponent } from 'angular2-meteor';
 
@Component({
    templateUrl: '/imports/client/competition-detail/competition-leaderboard.html',
})
export class CompetitionLeaderboard extends MeteorComponent{
    constructor(detail: CompetitionDetail){
        super();
    }

}
