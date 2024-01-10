import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Logged in successfully');
          this.router.navigate(['/list']);
        },
        error: (error) => {
          console.error('Login failed', error);
        },
      });
    } else {
      console.error('Form is not valid');
    }
  }
}
