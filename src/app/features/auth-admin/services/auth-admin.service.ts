import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminService {

  constructor(private apiService: ApiService) {
  }

  async login(username: string, password: string): Promise<boolean> {
    const requestBody = JSON.stringify({
      username,
      password
    });

    try {
      const response = this.apiService.post('', requestBody); //TODO
      sessionStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return !!response;
    } catch (error) {
      console.error('Errore durante la richiesta:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    const accessToken = sessionStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    return !!(accessToken && refreshToken);
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
