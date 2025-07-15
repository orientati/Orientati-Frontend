import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {TokenService} from '../../services/token/token.service';
import {HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent} from '@angular/common/http';
import {Observable, catchError, switchMap, throwError} from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const tokenService = inject(TokenService);
  const accessToken = tokenService.getAccessToken();

  const authReq = accessToken ? req.clone({setHeaders: {Authorization: `Bearer ${accessToken}`}}) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.endsWith('/refresh-token')) {
        return tokenService.refreshToken().pipe(
          switchMap((newToken: string) => {
            const retryReq = req.clone({
              setHeaders: {Authorization: `Bearer ${newToken}`}
            });
            return next(retryReq);
          }),
          catchError(err => {
            tokenService.logout();
            return throwError(() => err);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
