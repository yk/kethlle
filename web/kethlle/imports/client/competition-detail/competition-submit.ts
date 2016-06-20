import 'reflect-metadata';
import { CompetitionDetail } from './competition-detail';
import { Component, Input } from '@angular/core';
import { MeteorComponent } from 'angular2-meteor';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, Validators } from '@angular/forms';
import {Mongo} from 'meteor/mongo';
import {Submissions} from '../../collections/collections';
 
@Component({
    templateUrl: '/imports/client/competition-detail/competition-submit.html',
    directives: [REACTIVE_FORM_DIRECTIVES],
})
export class CompetitionSubmit extends MeteorComponent{
    submissionForm = new FormGroup({
        comment: new FormControl(''),
        data: new FormControl('', Validators.required),
    });
    submissions: Mongo.Cursor<Submission>;

    constructor(private detail: CompetitionDetail){
        super();
        this.subscribe('submissions', this.detail.competitionId, () => {
            this.submissions = Submissions.find();
        }, true);
    }

    makeSubmission(){
        if(this.submissionForm.valid){
            Meteor.call("makeSubmission", this.detail.competitionId,
                        this.submissionForm.controls['data'].value,
                        this.submissionForm.controls['comment'].value);
            this.submissionForm.controls['data'].updateValue('');
            this.submissionForm.controls['comment'].updateValue('');
        }
    }

}
