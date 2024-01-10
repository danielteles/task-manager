import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private authService: AuthService, private router: Router) {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          console.log('Registration successful');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration failed', error);
        },
      });
    } else {
      console.error('Form is not valid');
    }
  }
}
