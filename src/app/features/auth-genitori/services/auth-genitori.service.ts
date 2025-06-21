import {Injectable} from '@angular/core';
import {ApiService} from '../../../core/services/api/api.service';
import {Observable, tap} from 'rxjs';
import {TokenService} from '../../../core/services/token/token.service';

type LoginResponse = {
  nome: string;
  cognome: string;
  comune: string;
  id: number;
  access_token: string;
  token_type: string;
};

@Injectable({
  providedIn: 'root'
})
export class AuthGenitoriService {

  constructor(private apiService: ApiService, private tokenService: TokenService) {
  }

  login(email: string): Observable<any> {
    const requestBody = {
      email
    };

    try {
      return this.apiService.post<LoginResponse>('public/genitore', requestBody).pipe(
        tap(response => {
          this.tokenService.saveTokens(response.access_token);
        })
      );
    } catch (error) {
      console.error('Error during the request:', error);
      throw error;
    }
  }


  signup(email: string, nome: string, cognome: string, comune: string): Observable<any> {
    const requestBody = {
      email,
      nome,
      cognome,
      comune
    };

    try {
      return this.apiService.put<LoginResponse>('public/genitore', requestBody).pipe(
        tap(response => {
          //this.tokenService.saveTokens(response.access_token, response.refresh_token);
        })
      );
    } catch (error) {
      console.error('Error during the request:', error);
      throw error;
    }
  }
}
