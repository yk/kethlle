import 'reflect-metadata';
import { Component } from '@angular/core';
import { CompetitionDetail } from './competition-detail';
import { MeteorComponent } from 'angular2-meteor';
import {Meteor} from 'meteor/meteor';
 
@Component({
    templateUrl: '/imports/client/competition-detail/competition-info.html',
})
export class CompetitionInfo extends MeteorComponent{
    constructor(private detail: CompetitionDetail){
        super();
    }

    participate(){
        if(!this.detail.competition)
            return;
        Meteor.call("participateInCompetition", this.detail.competition._id);
    }

    unparticipate(){
        if(!this.detail.competition)
            return;
        Meteor.call("unparticipateInCompetition", this.detail.competition._id);
    }

}
