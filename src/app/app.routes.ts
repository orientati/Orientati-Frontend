import { Routes } from '@angular/router';
import { LoginFormAdminComponent } from './features/auth-admin/components/login-form-admin/login-form-admin.component';
import { LoginFormGenitoreComponent } from './login-form-genitore/login-form-genitore.component';


export const routes: Routes = [
  { path: 'genitore', component: LoginFormGenitoreComponent },
  { path: 'login', component: LoginFormAdminComponent },
];
