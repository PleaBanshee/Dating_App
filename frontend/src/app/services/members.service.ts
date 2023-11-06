import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  members: Member[] = [];

  constructor(private httpClient: HttpClient) {}

  // returns an observable with the cached data (if any) to avoid making another API request
  getMembers() {
    if (this.members.length > 0) return of(this.members); // converts to observable
    return this.httpClient.get<Member[]>(`${environment.apiUrl}/users`).pipe(
      map((members) => {
        this.members = members;
        return this.members;
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
}
