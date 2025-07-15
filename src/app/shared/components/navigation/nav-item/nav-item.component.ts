import {Component, Input, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-nav-item',
  imports: [
    RouterLink
  ],
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.css'
})
export class NavItemComponent implements OnInit {
  @Input() label!: string;
  @Input() route!: string;
  @Input() icon!: string;

  active: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const currentRoute: string = this.router.url;
    if (currentRoute === this.route) {
      this.active = true;
    }
  }
}
