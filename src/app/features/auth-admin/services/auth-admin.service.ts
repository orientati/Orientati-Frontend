import {Injectable} from '@angular/core';
import {ApiService} from '../../../core/services/api/api.service';
import {firstValueFrom, Observable, tap} from "rxjs";
import {TokenService} from '../../../core/services/token/token.service';

type LoginResponse = {
    access_token: string;
    refresh_token: string;
    token_type: string;
};

@Injectable({
    providedIn: 'root'
})
export class AuthAdminService {

    constructor(private apiService: ApiService, private tokenService: TokenService) {
    }

    login(requestBody: FormData): Observable<any> {
        try {
            return this.apiService.post<LoginResponse>('login', requestBody).pipe(
                tap(response => {
                    this.tokenService.saveTokens(response.access_token, response.refresh_token);
                })
            );
        } catch (error) {
            console.error('Error during the request:', error);
            throw error;
        }
    }
















    isAuthenticated(): boolean {
        this.tokenService.getAccessToken();
        this.tokenService.getRefreshToken();

        return true;
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
