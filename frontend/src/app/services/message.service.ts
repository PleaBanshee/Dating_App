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
import { BehaviorSubject, take } from 'rxjs';
import { Group } from '../models/group';

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

    // Gets messages live to other clients
    this.hubConnection.on('ReceiveMessageThread', (messages) => {
      this.messageThreadSource.next(messages);
    });

    // Updating connected message groups
    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some((x) => x.username === otherUserName)) {
        this.messageThread$.pipe(take(1)).subscribe({
          next: (messages) => {
            messages.forEach((message) => {
              if (!message.dateRead) {
                message.dateRead = new Date(Date.now());
              }
            });
            this.messageThreadSource.next([...messages]);
          },
        });
      }
    });

    // Receive live messages
    this.hubConnection.on('NewMessage', (message) => {
      this.messageThread$.pipe(take(1)).subscribe({
        next: (messages) => {
          // cloning of messages
          this.messageThreadSource.next([...messages, message]);
        },
      });
    });
  }

  stopHubConnection() {
    if (this.hubConnection) this.hubConnection.stop();
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

  // async method ensures the promise is returned
  async sendMessage(userName: string, content: string) {
    // Sends a message using the Hub and returns a promise
    return this.hubConnection
      ?.invoke('SendMessage', {
        recipientUsername: userName,
        content,
      })
      .catch((error) => console.log(error));
  }

  deleteMessage(id: number) {
    return this.httpClient.delete(`${environment.apiUrl}/messages/${id}`);
  }
}
