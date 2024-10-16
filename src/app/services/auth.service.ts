import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  login() {
    localStorage.setItem('isLoggedIn', 'true');  
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';  
  }

  logout() {
    localStorage.removeItem('isLoggedIn');  
  }
}
