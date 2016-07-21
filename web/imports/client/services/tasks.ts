import {Injectable} from '@angular/core';

@Injectable()
export class TasksService {
    public tasks: Task[] = [
{
    _id: 'task1',
    name: 'Task1',
    shortDescription: 'this is the first task',
    description: `
### Overview
Hello, *oooh*, __this is strong__!
and this is the next line.

### Submission Instructions
1. Take a file
2. Upload it

### Data
Follow this [link](http://www.google.com)`,
},
{
    _id: 'task2',
    name: 'Task2',
    shortDescription: 'this is the second task',
    description: `
Hello, *oooh*, __this is strong__!
and this is the next line.`,
},
    ];

}
