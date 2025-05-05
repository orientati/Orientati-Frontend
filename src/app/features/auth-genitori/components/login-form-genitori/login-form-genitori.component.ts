import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthGenitoriService} from '../../services/auth-genitori.service';
import {ApiService} from '../../../../core/services/api/api.service';

@Component({
  selector: 'app-login-form-genitori',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login-form-genitori.component.html',
  styleUrl: './login-form-genitori.component.css'
})
export class LoginFormGenitoriComponent {
  LoginResult: boolean = true;
  ForgotPasswordResult: boolean = true;
  TogglePassword: boolean = false;

  Registrazione: boolean = false;

  private email: string = '';

  constructor(private authService: AuthGenitoriService, private apiService: ApiService, private router: Router) {
  }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  registerForm: FormGroup = new FormGroup({
    nome: new FormControl('', Validators.required),
    cognome: new FormControl('', Validators.required),
    comune: new FormControl('', Validators.required),
  });

  async login()
    :
    Promise<void> {
    if (this.loginForm.invalid
    ) {
      this.loginForm.markAllAsTouched();
      setTimeout(() => {
        this.loginForm.markAsUntouched();
      }, 5000);
      return;
    }

    this.email = this.loginForm.value.email!;

    this.LoginResult = await this.authService.login(
      this.loginForm.value.email!,
      this.loginForm.value.password!,
    );

//TODO
    if (this.LoginResult) {
      //await this.router.navigate(['/']);
      this.Registrazione = true;


      //window.location.href = 'registrazione.html';
    } else {
      await this.router.navigate(['/']);

      window.location.href = 'home.html';
    }

  }

  on_enter()
    :
    void {
    this.login();
  }

  async register(): Promise<void> {
    if (this.registerForm.invalid
    ) {
      this.registerForm.markAllAsTouched();
      setTimeout(() => {
        this.registerForm.markAsUntouched();
      }, 5000);
      return;
    }

    this.LoginResult = await this.authService.register(
      this.registerForm.value.nome!,
      this.registerForm.value.cognome!,
      this.registerForm.value.comune!,
      this.email!
    );

    if (this.LoginResult) {
      //TODO
      //await this.router.navigate(['/']);
      //window.location.href = 'home.html';

    }
  }

  loadComuni() {
    let data = this.apiService.get('https://raw.githubusercontent.com/matteocontrini/comuni-json/refs/heads/master/comuni.json');

    const select = document.getElementById('comune') as HTMLSelectElement;
    //TODO
    data.sort((a, b) => a.nome.localeCompare(b.nome));
    data.forEach(comune => {
      const option = document.createElement('option');
      option.value = `${comune.nome} (${comune.sigla})`;
      option.text = `${comune.nome} (${comune.sigla})`;
      option.setAttribute('data-provincia', comune.provincia.nome);
      option.setAttribute('data-regione', comune.regione.nome);
      select.appendChild(option);
    });
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
