import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-nav-item',
  imports: [RouterLink],
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.css'
})
export class NavItemComponent implements OnInit {
  @Input() label!: string;
  @Input() route!: string;
  @Input() active!: boolean;

  @Output() itemSelected: EventEmitter<string> = new EventEmitter<string>();

  Active!: boolean;
  Label!: string;
  Route!: string;

  currentRoute: string = '';

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.Label = this.label;
    this.Route = this.route;
    this.Active = this.active;

    this.currentRoute = this.router.url;
    if (this.currentRoute === this.route) {
      this.Active = true;
    }
  };

  /*
  on_item_click(): void {
    this.itemSelected.emit(this.route);
  }
  */
}
