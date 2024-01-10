import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent {
  taskForm: FormGroup;

  @Output() taskAdded = new EventEmitter<void>();

  constructor(private taskService: TaskService) {
    this.taskForm = new FormGroup({
      title: new FormControl('', Validators.required),
      status: new FormControl(false, Validators.required),
    });
  }

  addTask(): void {
    if (this.taskForm.valid) {
      console.log(this.taskForm.value);
      const _validatedTask = {
        ...this.taskForm.value,
        status: this.taskForm.value.status === 'true',
      };

      console.log(_validatedTask);

      this.taskService.addTask(_validatedTask).subscribe({
        next: () => {
          this.taskAdded.emit();
          this.taskForm.reset({ title: '', status: false });
        },
        error: (err) => console.error('Error adding task', err),
      });
    } else {
      // Handle invalid form scenario
    }
  }
}
