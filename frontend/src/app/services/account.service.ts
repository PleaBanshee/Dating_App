import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  // Instantiate a user
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(
    private httpClient: HttpClient,
    private presenceService: PresenceService
  ) {}

  login(user: User) {
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

  register(user: User) {
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
    user.roles = [];
    // gets roles from JWT token
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? (user.roles = roles) : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
    // creates connection to SignalR
    this.presenceService.createHubConnection(user);
  }

  getDecodedToken(token: string) {
    // decodes and parses JWT token
    return JSON.parse(atob(token.split('.')[1]));
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    // stops connection to SignalR
    this.presenceService.stopHubConnection();
  }
}
