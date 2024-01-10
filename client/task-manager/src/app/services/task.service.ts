import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';
import { tap } from 'rxjs/operators';
import { CsrfService } from './csrf.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]); // Holds the current state of tasks
  private loaded = false;
  private _currentUser = this.authService.currentUserValue; // Access the current user
  private _userId = this._currentUser?.user_id; // Get the user_id from the current user

  constructor(
    private http: HttpClient,
    private csrfService: CsrfService,
    private authService: AuthService
  ) {}

  // Helper function to get headers with CSRF token
  private get headers() {
    const token = this._currentUser?.token;
    return new HttpHeaders({
      'CSRF-Token': this.csrfService.token, // Add CSRF token to headers
      'Content-Type': 'application/json', // Ensure JSON content type for payload
      Authorization: `Bearer ${token}`, // Add the Authorization header
    });
  }

  // Observable for components to subscribe to
  get tasks$(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  // Fetch tasks for a specific user from the backend and update the BehaviorSubject
  loadTasks(): void {
    if (this._userId && !this.loaded) {
      this.http
        .get<Task[]>(`${this.apiUrl}?userId=${this._userId}`, {
          headers: this.headers,
        }) // Use userId in your request
        .pipe(
          tap((tasks) => {
            // Update the BehaviorSubject with the new data
            this.tasksSubject.next(tasks);
            this.loaded = true;
          })
        )
        .subscribe();
    }
  }

  // Update a task and return the Observable of the updated task
  updateTask(task: Task): Observable<Task> {
    return this.http
      .put<Task>(
        `${this.apiUrl}/${task.id}`,
        { ...task, user_id: this._userId },
        { headers: this.headers }
      )
      .pipe(
        tap((updatedTask) => {
          const currentTasks = this.tasksSubject.getValue();
          const index = currentTasks.findIndex((t) => t.id === updatedTask.id);
          if (index !== -1) {
            currentTasks[index] = updatedTask;
            this.tasksSubject.next(currentTasks); // Update the BehaviorSubject
          }
        })
      );
  }

  // Delete a task by its ID
  deleteTask(id: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${id}`, { headers: this.headers })
      .pipe(
        tap(() => {
          const updatedTasks = this.tasksSubject
            .getValue()
            .filter((task) => task.id !== id);
          this.tasksSubject.next(updatedTasks); // Update the BehaviorSubject
        })
      );
  }

  // Method to update the tasksSubject directly, if needed
  updateTasksSubject(tasks: Task[]): void {
    this.tasksSubject.next(tasks);
  }

  // Add a new task with CSRF protection and return the Observable of the new task
  addTask(task: Task): Observable<Task> {
    return this.http
      .post<Task>(
        this.apiUrl,
        { ...task, user_id: this._userId },
        { headers: this.headers }
      )
      .pipe(
        tap((newTask) => {
          const currentTasks = this.tasksSubject.getValue();
          this.tasksSubject.next([...currentTasks, newTask]); // Append new task to the current state
        })
      );
  }
}
