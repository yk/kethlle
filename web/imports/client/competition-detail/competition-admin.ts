import 'reflect-metadata';
import { Component} from '@angular/core';
import { CompetitionDetail } from './competition-detail';
import { MeteorComponent } from 'angular2-meteor';
import {Competitions, Submissions} from '../../collections/collections';
import {Router} from '@angular/router';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, Validators } from '@angular/forms';
import {Mongo} from 'meteor/mongo';
import * as _u from 'lodash';
 
@Component({
    templateUrl: '/imports/client/competition-detail/competition-admin.html',
    directives: [REACTIVE_FORM_DIRECTIVES],
})
export class CompetitionAdmin extends MeteorComponent{
    editCompetitionForm = new FormGroup({
        name: new FormControl('', Validators.required),
        description: new FormControl(''),
        solution: new FormControl(''),
        scoring: new FormControl(''),
    });
    addAdminForm = new FormGroup({
        username: new FormControl('', Validators.required),
    });
    submissions: Mongo.Cursor<Submission>;

    constructor(private detail: CompetitionDetail, private router: Router){
        super();
        setTimeout(() => {
            this.updateEditCompetitionForm();
            this.detail.competitionUpdated.subscribe(()=>this.updateEditCompetitionForm());
        }, 0);
        this.subscribe('submissionsAdmin', this.detail.competitionId, () => {
            this.submissions = Submissions.find();
        });
    }

    updateEditCompetitionForm(){
        if(this.detail.competition){
            _u.forEach(['name', 'description', 'solution', 'scoring'], p => {
                this.editCompetitionForm.controls[p].updateValue(this.detail.competition[p]);
            });
        }
    }

    editCompetition(){
        if(!this.detail.competition)
            return;
        Competitions.update(this.detail.competition._id, {
            $set: {
                name: this.editCompetitionForm.controls['name'].value,
                description: this.editCompetitionForm.controls['description'].value,
                scoring: this.editCompetitionForm.controls['scoring'].value,
                solution: this.editCompetitionForm.controls['solution'].value,
            }
        });
    }

    deleteCompetition(){
        if(confirm("Are you sure you want to delete this competition?")){
            Competitions.remove(this.detail.competitionId);
            this.router.navigate(['/competition-list']);
        }
    }

    removeAdmin(admin){
        if(admin == this.detail.user._id)
            return;
        Competitions.update(this.detail.competitionId, {$pull: {admins: admin}});
    }

    addAdmin(){
        let admin = this.addAdminForm.controls['username'].value;
        Competitions.update(this.detail.competitionId, {$addToSet: {admins: admin}});
        this.addAdminForm.controls['username'].updateValue('');
    }

    removeParticipant(part){
        Competitions.update(this.detail.competitionId, {$pull: {participants: part}});
    }

    scoreSubmission(subId){
        Meteor.call("scoreSubmission", subId);
    }
    removeSubmission(subId){
        Submissions.remove(subId);
    }

}
