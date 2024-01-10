import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../models/task.model';

@Pipe({ name: 'filterTasks' })
export class FilterTasksPipe implements PipeTransform {
  transform(tasks: Task[], searchTerm: string): Task[] {
    if (!searchTerm) return tasks;
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
