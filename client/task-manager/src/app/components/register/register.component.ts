import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  onRegister(): void {
    const user = {
      username: this.username,
      password: this.password,
    };

    this.authService.register(user).subscribe({
      next: () => {
        console.log('Registration successful');
        // Handle successful registration
        // For example, redirect to login or auto-login the user
      },
      error: (error) => {
        console.error('Registration failed', error);
        // Handle registration error
        // For example, show an error message
      },
    });
  }
}
