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
          const currentUser = res;
          if (currentUser) {
            localStorage.setItem('user', JSON.stringify(currentUser));
            this.currentUserSource.next(currentUser);
          }
        })
      );
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
