import {inject, Injectable} from '@angular/core';
import {ApiService} from './core/services/api/api.service';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IscrizioneRagazzoService {

  constructor(private apiService: ApiService) {
  }

  private api = inject(ApiService);

  getRagazzi(): Observable<any> {
    return this.api.get<any>('public/ragazzo/')
      .pipe(
        catchError(error => {
          console.error('Errore nel caricamento dei ragazzi:', error);
          return throwError(() => error);
        })
      );
  }

  aggiungiRagazzo(nome: string, cognome: string, scuolaDiProvenienza_id: number): Observable<any> {
    const requestBody = {
      nome,
      cognome,
      scuolaDiProvenienza_id
    };

    console.log('Richiesta di aggiunta ragazzo:', requestBody);

    return this.api.post<any>('public/ragazzo/', requestBody)
      .pipe(
        catchError(error => {
          console.error('Errore nel caricamento dei ragazzi:', error);
          return throwError(() => error);
        })
      );
  }

  eliminaRagazzo(id: number): Observable<void> {
    return this.api.delete<void>(`public/ragazzo/${id}`);
  }

  getScuole(): Observable<any> {
    return this.api.get<any>('public/scuola/')
      .pipe(
        catchError(error => {
          console.error('Errore nel recupero delle scuole:', error);
          return throwError(() => error);
        })
      );
  }

  getIscrizioni(): Observable<any> {
    return this.api.get<any>('public/iscrizione')
      .pipe(
        catchError(error => {
          console.error('Errore nel recupero delle iscrizioni:', error);
          return throwError(() => error);
        })
      );
  }

  eliminaIscrizione(id: number): Observable<void> {
    return this.api.delete<void>(`public/iscrizione/${id}`);
  }

  getDate(): Observable<any> {
    return this.api.get<any>('public/date')
      .pipe(
        catchError(error => {
          console.error('Errore nel recupero delle iscrizioni:', error);
          return throwError(() => error);
        })
      );
  }
}
