import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<string>();
  @Output() save = new EventEmitter<Task>();

  enableEdit(): void {
    this.task.editing = true;
    this.edit.emit(this.task);
  }

  saveEdit(): void {
    this.task.editing = false;
    this.save.emit(this.task);
  }

  cancelEdit(): void {
    this.task.editing = false;
  }

  deleteTask(): void {
    this.delete.emit(this.task.id);
  }

  toggleCompletion(event: any) {
    this.task.status = event.checked;
    this.save.emit(this.task);
  }
}
