import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';
import { Observable, Subscription, map, of } from 'rxjs';
import { PaginatedResults } from '../models/pagination';
import { UserParams } from '../models/user-params';
import { AccountService } from './account.service';
import { User } from '../models/user';
import {
  getPaginatedResult,
  getPaginationHeaders,
} from '../helpers/paginationHelper';

@Injectable({
  providedIn: 'root',
})
export class MembersService implements OnDestroy {
  private currentUserSubscription: Subscription | undefined;
  members: Member[] = [];
  memberCache = new Map(); // used to store key-value pairs
  user: User | undefined;
  userParams: UserParams | undefined;

  constructor(
    private httpClient: HttpClient,
    private accountService: AccountService
  ) {
    this.currentUserSubscription = this.accountService.currentUser$
      .pipe()
      .subscribe({
        next: (user) => {
          if (user) {
            this.userParams = new UserParams(user);
            this.user = user;
          }
        },
      });
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams() {
    if (this.user) {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return;
  }

  // page number & items per page is optional, as you get a default value from the API
  getMembers(userParams: UserParams): Observable<PaginatedResults<Member[]>> {
    // string acts as a unique key for each combination of user parameters.
    // returns caching object if found
    const response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) return of(response);

    let params = getPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResult<Member[]>(
      `${environment.apiUrl}/users`,
      params,
      this.httpClient
    ).pipe(
      map((response) => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    );
  }

  getMemberByName(username: string) {
    // stores flattened array of users
    const member = [...this.memberCache.values()]
      .reduce((arr, current) => arr.concat(current.result), [])
      .find((member: Member) => {
        return member.userName === username;
      });
    if (member) return of(member);
    return this.httpClient.get<Member>(
      `${environment.apiUrl}/users/${username}`
    );
  }

  getMemberById(id: number) {
    const member = this.members.find((user) => user.id === id);
    if (member) return of(member);
    return this.httpClient.get<Member>(`${environment.apiUrl}/users/${id}`);
  }

  addLike(userName: string) {
    return this.httpClient.post(`${environment.apiUrl}/likes/${userName}`, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return getPaginatedResult<Member[]>(
      `${environment.apiUrl}/likes`,
      params,
      this.httpClient
    );
  }

  // No need to specify anobservable when updating
  updateMember(member: Member) {
    return this.httpClient.put(`${environment.apiUrl}/users`, member).pipe(
      map(() => {
        // no value is passed, because it is a put method
        const index = this.members.indexOf(member);
        // updating member value by cloning of the object using the spread operator
        this.members[index] = { ...this.members[index], ...member };
      })
    );
  }

  setProfilePic(photoId: number) {
    return this.httpClient.put(
      `${environment.apiUrl}/users/set-profile-pic/${photoId}`,
      {}
    );
  }

  deletePhoto(photoId: number) {
    return this.httpClient.delete(
      `${environment.apiUrl}/users/delete-photo/${photoId}`
    );
  }

  ngOnDestroy(): void {
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
  }
}
