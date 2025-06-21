import {Component} from '@angular/core';
import {AuthGenitoriService} from '../features/auth-genitori/services/auth-genitori.service';
import {ApiService} from '../core/services/api/api.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FormButtonComponent} from '../shared/components/forms/form-button/form-button.component';
import {FormInputComponent} from '../shared/components/forms/form-input/form-input.component';
import {FormSelectComponent} from '../shared/components/forms/form-select/form-select.component';
import {ComuniService, Comune} from '../comuni.service';


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

  email: string = '';

  comuni: Comune[] = [];

  constructor(private comuniService: ComuniService, private authService: AuthGenitoriService, private apiService: ApiService, private router: Router) {

  }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  signupForm: FormGroup = new FormGroup({
    nome: new FormControl('', Validators.required),
    cognome: new FormControl('', Validators.required),
    comune: new FormControl('', Validators.required),
  });

  async login(): Promise<void> {
    this.formSubmitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.email = this.loginForm.value.email!;
    this.authService.login(this.email).subscribe({
      next: async (response) => {
        if (!response.cognome) {
          try {
            this.comuni = await this.comuniService.getComuni();
            console.log(this.comuni);
          } catch (error) {
            console.error('Errore nel caricamento dei comuni', error);
          }
          this.Registrazione = true;
          this.formSubmitted = false;
          return;
        } else {
          this.router.navigate(['/iscrizione']);
        }
        console.log("Login successful");
      },
      //error: err => this.errorMessage = 'Credenziali errate'
    });
  }


  async signup(): Promise<void> {
    this.formSubmitted = true;

    if (this.signupForm.invalid) {
      return;
    }

    /*
    const formData = new FormData();
    formData.append('email', );
    formData.append('nome', this.loginForm.value.nome!);
    formData.append('cognome', this.loginForm.value.cognome!);
    formData.append('comune', this.loginForm.value.comune!);
*/

    let email = this.email!;
    let nome = this.signupForm.value.nome!;
    let cognome = this.signupForm.value.cognome!;
    let comune = this.signupForm.value.comune!;

    this.authService.signup(email, nome, cognome, comune).subscribe({
      next: (data) => {
        this.router.navigate(['/iscrizione']);
        console.log("Login successful", data);
      },
      //error: err => this.errorMessage = 'Credenziali errate'
    });

  }

  getControl(controlName: string, formName: FormGroup): FormControl {
    return formName.get(controlName) as FormControl;
  }

  on_enter_login(): void {
    this.login();
  }

  on_enter_signuip(): void {
    this.signup();
  }


}
