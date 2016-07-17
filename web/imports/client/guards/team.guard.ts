import {Injectable, NgZone} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Tracker} from 'meteor/tracker';
import {Meteor} from 'meteor/meteor';
import {Router} from '@angular/router';
import {TasksService} from '../services/tasks';
import {Teams} from '../../collections/collections';

@Injectable()
export class TeamGuard implements CanActivate {

    constructor(private tasksService: TasksService, private router: Router, private ngZone: NgZone){}

    canActivate(route) {
        let task = this.tasksService.tasks.find(t => t._id == route.params['id']);
        return Observable.create(obs => {
            Tracker.autorun(() => {
                let user = Meteor.user();
                if(user){
                    Meteor.subscribe('teams', task._id, () => {
                        let team = Teams.findOne({taskId: task._id, members: user._id});
                        let guardingTeams = route.url.length == 3 && route.url[route.url.length-1].path == 'teams';
                        this.ngZone.run(() => {
                            if(!team && !guardingTeams){
                                this.router.navigate(['/tasks', task._id, 'teams'])
                            }else if(team && guardingTeams){
                                this.router.navigate(['/tasks', task._id])
                            }else{
                                obs.next(true);
                                obs.complete();
                            }
                        });
                    });
                }
            });
        });
    }
}
