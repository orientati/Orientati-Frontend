import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthAdminService} from '../../services/auth-admin.service';
import {FormInputComponent} from "../../../../form-input/form-input.component";

@Component({
    selector: 'app-login-form-admin',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        FormInputComponent
    ],
    templateUrl: './login-form-admin.component.html',
    styleUrl: './login-form-admin.component.css'
})
export class LoginFormAdminComponent {
    formSubmitted = false;

    constructor(private authService: AuthAdminService, private router: Router) {
        if (this.authService.isAuthenticated()) {
            //this.router.navigate(['/trade']);
        }
    }

    loginForm: FormGroup = new FormGroup({
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
    });

    getControl(controlName: string): FormControl {
        return this.loginForm.get(controlName) as FormControl;
    }


    async login(): Promise<void> {

        this.formSubmitted = true;

        if (this.loginForm.invalid) {
            //this.loginForm.markAllAsTouched();
            return;
        }

        const formData = new FormData();
        formData.append('username', this.loginForm.value.username!);
        formData.append('password', this.loginForm.value.password!);

        this.authService.login(formData).subscribe({
            next: () => {
                //this.router.navigate(['/home']);
                console.log("Login successful");
            },
            //error: err => this.errorMessage = 'Credenziali errate'
        });
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
