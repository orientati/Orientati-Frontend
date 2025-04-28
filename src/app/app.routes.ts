import { Routes } from '@angular/router';
import {RowComponent} from "./row/row.component";
import {DashboardPageComponent} from "./dashboard-page/dashboard-page.component";

export const routes: Routes = [
    {path: '', component: DashboardPageComponent},
];
