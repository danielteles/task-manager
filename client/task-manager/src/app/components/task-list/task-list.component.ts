import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<Task[]>; // Observable of tasks
  sortKey: string = '';
  searchTerm: string = '';

  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.tasks$; // Assign the Observable from the service
  }

  ngOnInit(): void {
    this.taskService.loadTasks(); // Load tasks which will update the BehaviorSubject
  }

  onEdit(task: Task): void {
    // Handle edit logic if needed
    // This could involve setting the task to edit mode, which can be handled in the component or the template
  }

  onSave(task: Task): void {
    this.taskService.updateTask(task).subscribe({
      next: (updatedTask) => {
        // The service's BehaviorSubject is already updated in the service
        // No need to update the local state here
      },
      error: (error) => {
        console.error('Error saving task', error);
      },
    });
  }

  onDelete(taskId: string): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        // The service's BehaviorSubject is already updated in the service
        // No need to update the local state here
      },
      error: (error) => {
        console.error('Error deleting task', error);
      },
    });
  }
}
