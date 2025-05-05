import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {API_BASE_URL} from "../../tokens/api-base-url.token";

@Injectable({providedIn: 'root'})
export class TokenService {
  private http = inject(HttpClient);
  private readonly API_URL = inject(API_BASE_URL);

  getAccessToken(): string | null {
    return sessionStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  saveTokens(access: string, refresh: string): void {
    sessionStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  refreshToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return throwError(() => new Error('No refresh token'));

    return this.http.post<any>(`${this.API_URL}/token/refresh`, {
      refreshToken: refreshToken
    }).pipe(
      map(response => {
        this.saveTokens(response.accessToken, response.refreshToken);
        return response.accessToken;
      }),
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refresh_token');
    location.href = ''; //TODO
  }
}
