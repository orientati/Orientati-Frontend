import {Injectable} from '@angular/core';
import {ApiService} from '../../../core/services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGenitoriService {
  constructor(private apiService: ApiService) {
  }

  async login(username: string, password: string): Promise<boolean> {
    const requestBody = JSON.stringify({
      username,
    });

    try {
      //TODO
      const response: any = this.apiService.post('/genitore', requestBody);
      sessionStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('tokenType', response.token_type);
      return (!response.nome || !response.cognome || !response.comune);
    } catch (error) {
      console.error('Errore durante la richiesta:', error);
      throw error;
    }
  }

  async register(nome: string, cognome: string, comune: string, email: string): Promise<boolean> {
    const requestBody = JSON.stringify({
      email,
      nome,
      cognome,
      comune
    });

    try {
      //TODO
      const response = this.apiService.put('/genitore', requestBody);
      return !!response
    } catch (error) {
      console.error('Errore durante la richiesta:', error);
      throw error;
    }
  }




















  /*
    async logout(): Promise<boolean> {
      try {
        const response = await this.apiService.sendRequest('/auth/logout', 'POST');
        sessionStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return !!response;
      } catch (error) {
        console.error('Errore durante la richiesta:', error);
        throw error;
      }
    }

    async forgotPassword(email: string): Promise<boolean> {
      const requestBody = JSON.stringify({
        email
      });

      try {
        const response = await this.apiService.sendRequest('/auth/forgot-password', 'POST', requestBody);
        return !!response;
      } catch (error) {
        console.error('Errore durante la richiesta:', error);
        throw error;
      }
    }
   */
}
