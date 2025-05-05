import {InjectionToken} from '@angular/core';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => {
    const serverPort = '8001';
    const endPoint = 'api/v1';

    //return `http://${location.hostname}:${serverPort}/${endPoint}`;
    return `http://10.0.5.81:${serverPort}/${endPoint}`;
  }
});
