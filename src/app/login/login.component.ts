import { Component } from '@angular/core';
import { VallauriInputComponent } from '../components/vallauri.input/vallauri.input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [VallauriInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  handleEmailChange(value: string) {
    this.email = value;
    console.log('Mail:', value);
  }

  handlePasswordChange(value: string) {
    this.password = value;
    console.log('Password:', value);
  }
}
