import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  // Instantiate a user
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private httpClient: HttpClient) {}

  login(user: any) {
    return this.httpClient
      .post<User>(`${environment.apiUrl}/account/login`, user)
      .pipe(
        map((res: User) => {
          console.log(res);
          const currentUser = res;
          if (currentUser) {
            this.setCurrentUser(currentUser);
          }
        })
      );
  }

  register(user: any) {
    return this.httpClient
      .post<User>(`${environment.apiUrl}/account/register`, user)
      .pipe(
        map((currentUser: User) => {
          if (currentUser) {
            this.setCurrentUser(currentUser);
          }
        })
      );
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
