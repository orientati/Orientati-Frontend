import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthAdminService} from '../../services/auth-admin.service';
import {FormInputComponent} from '../../../../shared/components/forms/form-input/form-input.component';
import {FormButtonComponent} from '../../../../shared/components/forms/form-button/form-button.component';
import {ButtonComponent} from "../../../../shared/button/button.component";

@Component({
    selector: 'app-login-form-admin',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        FormInputComponent,
        FormButtonComponent,
        ButtonComponent
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
              this.router.navigate(['/dashboard']);
                console.log("Login successful");
            },
            //error: err => this.errorMessage = 'Credenziali errate'
        });
    }


    on_enter() {
      this.login();
    }
}


