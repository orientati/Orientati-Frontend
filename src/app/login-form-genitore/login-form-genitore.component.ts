import { Component } from '@angular/core';
import { AuthGenitoriService } from '../features/auth-genitori/services/auth-genitori.service';
import { ApiService } from '../core/services/api/api.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormInputComponent } from '../shared/components/forms/form-input/form-input.component';
import { FormButtonComponent } from '../shared/components/forms/form-button/form-button.component';

import { FormSelectComponent } from '../shared/components/forms/form-select/form-select.component';

@Component({
  selector: 'app-login-form-genitore',
  imports: [
    ReactiveFormsModule,
    FormButtonComponent,
    FormInputComponent,
    FormSelectComponent
  ],
  templateUrl: './login-form-genitore.component.html',
  styleUrl: './login-form-genitore.component.css'
})
export class LoginFormGenitoreComponent {

  formSubmitted = false;

  Registrazione: boolean = false;

  private email: string = '';

  frutti = ['Mela', 'Banana', 'Pera'];

  constructor(private authService: AuthGenitoriService, private apiService: ApiService, private router: Router) {
  }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  signupForm: FormGroup = new FormGroup({
    nome: new FormControl('', Validators.required),
    cognome: new FormControl('', Validators.required),
    comune: new FormControl('', Validators.required),
  });

  getControl(controlName: string, formName: FormGroup): FormControl {
    return formName.get(controlName) as FormControl;
  }

  async login(): Promise<void> {
    this.formSubmitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.Registrazione = true;


    /*
    let email: string = this.loginForm.value.email!;
    this.authService.login(email).subscribe({
      next: () => {
        //this.router.navigate(['/home']);
        console.log("Login successful");
      },
      //error: err => this.errorMessage = 'Credenziali errate'
    });

    */
  }




}
