import { Routes } from '@angular/router';
import {LoginFormAdminComponent} from './features/auth-admin/components/login-form-admin/login-form-admin.component';
import {
  LoginFormGenitoriComponent
} from './features/auth-genitori/components/login-form-genitori/login-form-genitori.component';


export const routes: Routes = [
  {path: 'genitori', component: LoginFormGenitoriComponent},
  {path: 'login', component: LoginFormAdminComponent},
];
