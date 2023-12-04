import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  private hubConnection: HubConnection | undefined;
  // stores key value pairs of online users
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  // Observable containing dictionary, subscribes to changes
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(private toaster: ToastrService) {}

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.hubUrl}/presence`, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect() // tries to reconnect if connection is lost
      .build();

    this.hubConnection.start().catch((error) => {
      console.log(error);
    });

    this.hubConnection.on('UserIsOnline', (username) => {
      this.toaster.info(`${username} has connected`, 'INFO');
    });

    this.hubConnection.on('GetOnlineUsers', (usernames) => {
      this.onlineUsersSource.next(usernames);
    });

    this.hubConnection.on('UserIsOffline', (username) => {
      this.toaster.warning(`${username} has disconnected`, 'INFO');
    });
  }

  stopHubConnection() {
    this.hubConnection?.stop().catch((error) => {
      console.log(error);
    });
  }
}
