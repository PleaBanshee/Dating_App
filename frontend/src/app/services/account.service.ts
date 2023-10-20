import { Injectable } from '@angular/core';
import { Constants } from '../constants/Constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private httpClient: HttpClient) {}

  login(user: any) {
    return this.httpClient.post(`${Constants.BASE_URL}/account/login`, user);
  }
}
