import {Component, OnInit} from '@angular/core';
import {Gruppo} from '../../services/types.service';
import {WebSocketService} from '../../../../core/WebSoket/web-socket.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-gruppi-tracker',
  imports: [
    NgClass
  ],
  templateUrl: './gruppi-tracker.component.html',
  styleUrl: './gruppi-tracker.component.css'
})
export class GruppiTrackerComponent implements OnInit {

  gruppi: Gruppo[] = [];

  status: string = 'disconnesso';

  constructor(private wsService: WebSocketService) {
  }

  ngOnInit() {
    const subscription = this.wsService.onMessageType('gruppi').subscribe(msg => {
      this.gruppi = msg.gruppi;
    });
  }

  getInOrario(group: any): { classe: string; text: string } {
    if (group.numero_tappa === 0 && group.arrivato === false) {
      return { classe: 'not-started', text: 'NON PARTITO' };
    }

    if (group.numero_tappa === 0 && group.arrivato === true) {
      return { classe: 'not-started', text: 'USCITO' };
    }

    const partenza = new Date();
    const [ore, minuti] = group.orario_partenza.split(':').map(Number);
    partenza.setHours(ore, minuti + group.minuti_partenza, 0, 0);

    const oraAttuale = new Date();
    oraAttuale.setSeconds(0, 0);

    if (oraAttuale > partenza) {
      const diffMinuti = Math.floor((oraAttuale.getTime() - partenza.getTime()) / 60000);

      if (diffMinuti <= 3) {
        return { classe: 'bit-late', text: 'LIEVE RITARDO' };
      } else {
        return { classe: 'late', text: 'IN RITARDO' };
      }
    }

    return { classe: 'on-time', text: 'IN ORARIO' };
  }
}
