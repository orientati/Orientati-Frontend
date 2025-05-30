import {Component, OnInit} from '@angular/core';
import {Aula} from '../../services/types.service';
import {WebSocketService} from '../../../../WebSoket/web-socket.service';

@Component({
  selector: 'app-aule-overview',
  imports: [],
  templateUrl: './aule-overview.component.html',
  styleUrl: './aule-overview.component.css'
})
export class AuleOverviewComponent implements OnInit {

  aule: Aula[] = [];
  orario: string = '';

  constructor(private wsService: WebSocketService) {
  }

  ngOnInit() {
    const subscription = this.wsService.onMessageType('aule').subscribe(msg => {
      this.aule = msg.aule;
    });
  }
}
