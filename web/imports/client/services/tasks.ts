import {Injectable} from '@angular/core';

@Injectable()
export class TasksService {
    public tasks: Task[] = [
        {
            _id: 'task1',
            name: 'Task1',
            description: 'this is the first task',
        },
        {
            _id: 'task2',
            name: 'Task2',
            description: 'this is the second task',
        },
    ];

}
