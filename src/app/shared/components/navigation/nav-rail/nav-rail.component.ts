import {Component} from '@angular/core';
import {NavItemComponent} from '../nav-item/nav-item.component';

@Component({
  selector: 'app-nav-rail',
  imports: [
    NavItemComponent
  ],
  templateUrl: './nav-rail.component.html',
  styleUrl: './nav-rail.component.css'
})
export class NavRailComponent {
  navItems = [
    {label: 'Dashboard', route: '/dashboard', icon: 'dashboard'},
    {label: 'Chat', route: '/chat', icon: 'chat'},
    {label: 'Aula magna', route: '/aula-magna', icon: 'jamboard_kiosk'},
    {label: 'Statistiche', route: '/statistiche', icon: 'monitoring'},
    {label: 'Logout', route: '/logout', icon: 'logout'}
  ];
}
