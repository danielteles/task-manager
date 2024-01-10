import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  onLogin(): void {
    this.authService
      .login({ username: this.username, password: this.password })
      .subscribe({
        next: (response) => {
          console.log('Logged in successfully');
          // Handle response, store token, navigate to another route, etc.
        },
        error: (error) => {
          console.error('Login failed', error);
        },
      });
  }
}
