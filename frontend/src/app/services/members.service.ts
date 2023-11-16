import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';
import { Observable, map, of } from 'rxjs';
import { PaginatedResults } from '../models/pagination';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  members: Member[] = [];
  paginatedResult: PaginatedResults<Member[]> = new PaginatedResults<
    Member[]
  >();

  constructor(private httpClient: HttpClient) {}

  // returns an observable with the cached data (if any) to avoid making another API request
  // page number & items per page is optional, as you get a default value from the API
  getMembers(
    page?: number,
    itemsPerPage?: number
  ): Observable<PaginatedResults<Member[]>> {
    let params = new HttpParams();
    if (page && itemsPerPage) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (this.members.length > 0) {
      const paginatedResult: PaginatedResults<Member[]> = {
        result: this.members,
        pagination: {
          currentPage: 1, // Adjust with your default values
          totalPages: 1,
          totalItems: this.members.length,
          itemsPerPage: this.members.length,
        },
      };
      return of(paginatedResult);
    }

    // Full HTTP response should be observed, and any query parameters should be included.
    return this.httpClient
      .get<Member[]>(`${environment.apiUrl}/users`, {
        observe: 'response',
        params,
      })
      .pipe(
        map((res) => {
          if (res.body) {
            this.paginatedResult.result = res.body ?? [];
          }
          const pagination = res.headers.get('Pagination');
          if (pagination) {
            this.paginatedResult.pagination = JSON.parse(pagination);
          }
          return this.paginatedResult ?? [];
        })
      );
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
        this.members[index] = { ...this.members[index], ...member }; // updating member value by cloning of the object using the spread operator
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
