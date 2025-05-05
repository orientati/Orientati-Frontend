import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthAdminService} from '../../services/auth-admin.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-page-admin',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login-page-admin.component.html',
  styleUrl: './login-page-admin.component.css'
})
export class LoginPageAdminComponent {

}
