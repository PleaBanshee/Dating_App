import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private httpClient: HttpClient) {}

  getUsersWithRoles() {
    return this.httpClient.get<User[]>(
      `${environment.apiUrl}/admin/users-with-roles`
    );
  }
}
