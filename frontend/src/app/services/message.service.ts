import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  getPaginationHeaders,
  getPaginatedResult,
} from '../helpers/paginationHelper';
import { Message } from '../models/message';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private httpClient: HttpClient) {}

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('container', container);
    return getPaginatedResult<Message[]>(
      `${environment.apiUrl}/messages`,
      params,
      this.httpClient
    );
  }

  getMessageThread(userName: string) {
    return this.httpClient.get<Message[]>(
      `${environment.apiUrl}/messages/thread/${userName}`
    );
  }

  sendMessage(userName: string, content: string) {
    return this.httpClient.post<Message>(`${environment.apiUrl}/messages`, {
      recipientUsername: userName,
      content,
    });
  }
}
