import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {
  Subject,
  Observable,
  filter,
  share,
} from 'rxjs';

@Injectable({providedIn: 'root'})
export class WebSocketService {
  private socket$!: WebSocketSubject<any>;
  private message$ = new Subject<any>();
  private url = 'ws://10.0.5.81:8001/ws';

  connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket({
        url: this.url,
        openObserver: {
          next: () => {
            console.log('✅ WebSocket connesso');
          }
        },
        closeObserver: {
          next: () => {
            console.warn('⚠️ WebSocket disconnesso');
            // Se vuoi tentare la riconnessione manualmente dopo un po'
            // puoi farlo così (meglio che usare retryWhen)
            setTimeout(() => this.connect(), 3000);
          }
        },
        deserializer: ({data}) => {
          try {
            return JSON.parse(data);
          } catch {
            return data;
          }
        }
      });

      this.socket$.subscribe({
        next: msg => this.message$.next(msg),
        error: err => console.error('❌ Errore WebSocket:', err),
        complete: () => console.warn('ℹ️ WebSocket chiuso dal server')
      });
    }
  }


  send(msg: any): void {
    this.socket$?.next(msg);
  }

  onMessageType<T = any>(type: string): Observable<T> {
    return this.message$.pipe(
      filter(msg => msg?.type === type),
      share()
    );
  }
}
