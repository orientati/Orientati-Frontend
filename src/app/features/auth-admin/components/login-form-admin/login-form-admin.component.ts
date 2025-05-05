import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import  { AuthAdminService} from '../../services/auth-admin.service';

@Component({
  selector: 'app-login-form-admin',
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login-form-admin.component.html',
  styleUrl: './login-form-admin.component.css'
})
export class LoginFormAdminComponent {
  LoginResult: boolean = true;
  ForgotPasswordResult: boolean = true;
  TogglePassword: boolean = false;

  constructor(private authService: AuthAdminService, private router: Router) {
    if(this.authService.isAuthenticated()) {
      //this.router.navigate(['/trade']);
    }
  }

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  async login(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      setTimeout(() => {
        this.loginForm.markAsUntouched();
      }, 5000);
      return;
    }

    this.LoginResult = await this.authService.login(
      this.loginForm.value.email!,
      this.loginForm.value.password!,
    );

    if (this.LoginResult) {
      await this.router.navigate(['/trade']);
    }
  }

  on_enter(): void {
    this.login();
  }
/*
  async forgot_password(): Promise<void> {
    const emailControl: any = this.loginForm.get('email');
    if (emailControl && emailControl.invalid) {
      emailControl.markAsTouched();
      setTimeout(() => {
        this.loginForm.markAsUntouched();
      }, 5000);
      return;
    }

    this.ForgotPasswordResult = await this.authService.forgotPassword(
      this.loginForm.value.email!,
    );

    if (this.ForgotPasswordResult) {
      const forgotPassword = document.getElementById('forgotPassword') as HTMLParagraphElement;
      forgotPassword.innerText = 'Email sent! Check your inbox :)';

      if (this.loginForm.get('password')) {
        this.loginForm.get('password')!.reset();
      }

      this.LoginResult = true;

      setTimeout(() => {
        forgotPassword.innerText = 'Forgot your password?';
      }, 10000);
    }
  }

  toggle_password_visibility(): void {
    this.TogglePassword = !this.TogglePassword;
  }

 */
}
