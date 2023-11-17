import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';
import { Observable, map, of } from 'rxjs';
import { PaginatedResults } from '../models/pagination';
import { UserParams } from '../models/user-params';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  members: Member[] = [];

  constructor(private httpClient: HttpClient) {}

  // page number & items per page is optional, as you get a default value from the API
  getMembers(userParams: UserParams): Observable<PaginatedResults<Member[]>> {
    let params = this.getPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);

    return this.getPaginatedResult<Member[]>(
      `${environment.apiUrl}/users`,
      params
    );
  }

  private getPaginatedResult<T>(
    url: string,
    params: HttpParams
  ): Observable<PaginatedResults<T>> {
    const paginatedResult: PaginatedResults<T> = new PaginatedResults<T>();
    // Full HTTP response should be observed, and any query parameters should be included.
    return this.httpClient
      .get<PaginatedResults<T>>(url, {
        observe: 'response',
        params,
      })
      .pipe(
        map((res) => {
          if (res.body) {
            paginatedResult.result = res.body as T;
          }
          const pagination = res.headers.get('Pagination');
          if (pagination) {
            paginatedResult.pagination = JSON.parse(pagination);
          }
          return paginatedResult as PaginatedResults<T>;
        })
      );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    return params;
  }

  getMemberByName(username: string) {
    const member = this.members.find((user) => user.userName === username);
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
}
