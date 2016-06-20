import 'reflect-metadata';
import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Mongo } from 'meteor/mongo';
import { Competitions } from '../../collections/collections';
import { MeteorComponent } from 'angular2-meteor';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, Validators } from '@angular/forms';
 
@Component({
    templateUrl: '/imports/client/competition-list/competition-list.html',
    directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
})
export class CompetitionList extends MeteorComponent {
    competitions: Mongo.Cursor<Competition>;
    newCompetitionForm = new FormGroup({
        name: new FormControl('', Validators.required),
    });

    constructor(){
        super();
        this.subscribe('competitions', () => {
            this.competitions = Competitions.find();
        }, true);
    }

    createCompetition(){
        if(this.newCompetitionForm.valid){
            let name = this.newCompetitionForm.value['name'];
            this.call("createCompetition", name);
            this.newCompetitionForm.controls['name'].updateValue('');
        }
    }

}
