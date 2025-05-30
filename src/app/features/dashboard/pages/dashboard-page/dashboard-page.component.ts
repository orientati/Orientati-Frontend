import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {WebSocketService} from '../../../../WebSoket/web-socket.service';
import {TokenService} from '../../../../core/services/token/token.service';
import {NavRailComponent} from '../../../../shared/components/navigation/nav-rail/nav-rail.component';
import {AuleOverviewComponent} from '../../components/aule-overview/aule-overview.component';
import {GruppiTrackerComponent} from '../../components/gruppi-traker/gruppi-tracker.component';
import {OrientatiManagerComponent} from '../../components/orientati-manager/orientati-manager.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    NavRailComponent,
    AuleOverviewComponent,
    GruppiTrackerComponent,
    OrientatiManagerComponent
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent implements OnInit {
  private subs: Subscription[] = [];

  constructor(
    private wsService: WebSocketService,
    private tokenService: TokenService
  ) {
  }

  ngOnInit(): void {
    this.wsService.connect();
    this.send();
  }

  send(): void {
    this.wsService.send({
      Authorization: 'Bearer ' + this.tokenService.getAccessToken(),
      dashboard: 'true'
    });
  }

  sendTest(): void {
    this.wsService.send({type: "update_groups"});
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
