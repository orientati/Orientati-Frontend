import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { tokenInterceptor } from './core/interceptors/token/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor])),
  ]
};


import { InjectionToken } from '@angular/core';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  factory: () => {
    const ps = "8000";
    const pl = "8000";
    const ep = "api/v1/";

    if (location.origin === 'file://') {
      return `https://localhost:${pl}/${ep}`;
    } else {
      return `https://${location.hostname}:${ps}/${ep}`;
    }
  }
});
