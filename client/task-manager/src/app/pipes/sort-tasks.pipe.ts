import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../models/task.model';

@Pipe({ name: 'sortTasks' })
export class SortTasksPipe implements PipeTransform {
  transform(tasks: Task[], sortKey: string): Task[] {
    if (!tasks) return [];
    switch (sortKey) {
      case 'completed':
        return tasks
          .slice()
          .sort((a, b) => Number(b.status) - Number(a.status));
      case 'incompleted':
        return tasks
          .slice()
          .sort((a, b) => Number(a.status) - Number(b.status));
      case 'title':
        return tasks.slice().sort((a, b) => a.title.localeCompare(b.title));
      default:
        return tasks; // Default to no sorting
    }
  }
}
