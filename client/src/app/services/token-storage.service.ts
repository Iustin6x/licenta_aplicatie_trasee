import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject } from 'rxjs';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  private loginSubject$ = new BehaviorSubject<boolean>(!!window.sessionStorage.getItem(TOKEN_KEY));
  loginChanged$ = this.loginSubject$.asObservable();
  constructor() { }

   signOut(): void {
    window.sessionStorage.clear();
    this.loginSubject$.next(!!window.sessionStorage.getItem(TOKEN_KEY));

  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    this.loginSubject$.next(!!window.sessionStorage.getItem(TOKEN_KEY));
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));

  }


  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }
}
