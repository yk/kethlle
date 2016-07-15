import 'reflect-metadata';
import { CompetitionDetail } from './competition-detail';
import { Mongo } from 'meteor/mongo';
import { Component } from '@angular/core';
import { Teams } from '../../collections/collections';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, Validators } from '@angular/forms';
import { MeteorComponent } from 'angular2-meteor';
import * as _u from 'lodash';
 
@Component({
    templateUrl: '/imports/client/competition-detail/competition-teams.html',
    directives: [REACTIVE_FORM_DIRECTIVES],
})
export class CompetitionTeams extends MeteorComponent{
    newTeamForm = new FormGroup({
        name: new FormControl('', Validators.required),
    });

    constructor(private detail: CompetitionDetail){
        super();
    }

    userTeam(){
        if(!Meteor.user() || !this.detail.competition)
            return null;
        return _u.find(this.detail.competition.teams, (team) => _u.includes(team.members, Meteor.userId()));
    }

    addTeam(){
        if(this.newTeamForm.valid){
            Meteor.call("createTeam", this.detail.competitionId, this.newTeamForm.controls['name'].value);
            this.newTeamForm.controls['name'].updateValue('');
        }
    }

    joinTeam(teamId){
        Meteor.call("joinTeam", this.detail.competitionId, teamId);
    }

    leaveTeam(){
        Meteor.call("leaveTeam", this.detail.competitionId);
    }

}
