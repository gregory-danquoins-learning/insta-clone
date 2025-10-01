import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class Auth {
  apiUrl = 'http://localhost:8080'; // backend Spring Boot
  private _isLoggedIn = signal(false);
  private _username = signal<string | null>(null);
  private _currentUser = signal<any | null>(null);

  constructor(public http: HttpClient, private router: Router) {}

  isLoggedIn() {
    return this._isLoggedIn.asReadonly();
  }

  username() {
    return this._username.asReadonly();
  }

  currentUser() {
    return this._currentUser.asReadonly();
  }

  get userId(): number | null {
    return this._currentUser()?.id ?? null;
  }

  login(email: string, password: string) {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(email + ':' + password)
    });

    this.http.get(this.apiUrl + '/api/account', { headers, withCredentials: true })
      .subscribe({
        next: (user: any) => {
          this._username.set(user.email);
          this._isLoggedIn.set(true);
          this._currentUser.set(user);
          this.router.navigateByUrl('/');
        },
        error: () => {
          this._isLoggedIn.set(false);
          this._username.set(null);
          this._currentUser.set(null);
        }
      });
  }

  logout() {
    this.http.post(this.apiUrl + '/api/logout', {}, { withCredentials: true })
      .subscribe({
        next: () => {
          this._isLoggedIn.set(false);
          this._username.set(null);
          this._currentUser.set(null);
          this.router.navigateByUrl('/login');
        }
      });
  }

  /**
   * Vérifie si une session est déjà active côté backend
   * (utilisé par le guard ou au démarrage de l'app).
   */
  checkSession() {
    return this.http.get(this.apiUrl + '/api/account', { withCredentials: true });
  }
}
