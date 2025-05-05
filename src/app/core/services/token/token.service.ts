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
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  saveTokens(access: string, refresh: string): void {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
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
    localStorage.removeItem('refreshToken');
    location.href = ''; //TODO
  }
}
