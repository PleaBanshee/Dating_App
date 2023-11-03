import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  constructor(private httpClient: HttpClient) {}

  getMembers() {
    return this.httpClient.get<Member[]>(`${environment.apiUrl}/users`);
  }

  getMemberByName(username: string) {
    return this.httpClient.get<Member>(
      `${environment.apiUrl}/users/${username}`
    );
  }

  getMemberById(id: number) {
    return this.httpClient.get<Member>(`${environment.apiUrl}/users/${id}`);
  }

  updateMember(member: Member) {
    return this.httpClient.put(`${environment.apiUrl}/users`, member);
  }
}
