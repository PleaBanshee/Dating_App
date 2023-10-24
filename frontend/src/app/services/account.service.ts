import { Injectable } from '@angular/core';
import { Constants } from '../constants/Constants';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../models/user';

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
      .post<User>(`${Constants.BASE_URL}/account/login`, user)
      .pipe(
        map((res: User) => {
          console.log(res);
          const currentUser = res;
          if (currentUser) {
            localStorage.setItem('user', JSON.stringify(currentUser));
            this.currentUserSource.next(currentUser);
          }
        })
      );
  }

  register(user: any) {
    return this.httpClient
      .post<User>(`${Constants.BASE_URL}/account/register`, user)
      .pipe(
        map((currentUser: User) => {
          if (currentUser) {
            localStorage.setItem('user', JSON.stringify(currentUser));
            this.currentUserSource.next(currentUser);
          }
        })
      );
  }

  getUserName() {
    const obj = localStorage.getItem('user');
    if (obj) {
      const username = JSON.parse(obj).username;
      return username.toUpperCase();
    } else {
      console.log('Local storage does not contain user data');
    }
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}