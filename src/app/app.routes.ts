import {Routes} from '@angular/router';
import {LoginFormAdminComponent} from './features/auth-admin/components/login-form-admin/login-form-admin.component';
import {LoginFormGenitoreComponent} from './login-form-genitore/login-form-genitore.component';
import {DashboardPageComponent} from './features/dashboard/pages/dashboard-page/dashboard-page.component';
import {IscrizioneOrientatoPageComponent} from './iscrizione-orientato-page/iscrizione-orientato-page.component';

export const routes: Routes = [
  {path: 'genitore', component: LoginFormGenitoreComponent},
  {path: 'login', component: LoginFormAdminComponent},
  {path: 'dashboard', component: DashboardPageComponent},
  {path: 'iscrizione', component: IscrizioneOrientatoPageComponent},
];
