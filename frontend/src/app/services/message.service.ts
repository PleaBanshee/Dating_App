import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  getPaginationHeaders,
  getPaginatedResult,
} from '../helpers/paginationHelper';
import { Message } from '../models/message';
import { environment } from 'src/environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private hubConnection: HubConnection | undefined;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(private httpClient: HttpClient) {}

  createHubConnection(user: User, otherUserName: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.hubUrl}/message?user=${otherUserName}`, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => {
      console.log(error);
    });

    // Sends message live to other clients
    this.hubConnection.on('ReceiveMessageThread', (messages) => {
      this.messageThreadSource.next(messages);
    });
  }

  stopHubConnection() {
    this.hubConnection?.stop();
  }

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

  deleteMessage(id: number) {
    return this.httpClient.delete(`${environment.apiUrl}/messages/${id}`);
  }
}
