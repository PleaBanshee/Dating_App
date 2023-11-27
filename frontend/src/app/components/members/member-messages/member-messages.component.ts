import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TimeagoModule } from 'ngx-timeago';
import { Message } from 'src/app/models/message';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss'],
  imports: [CommonModule, TimeagoModule],
})
export class MemberMessagesComponent implements OnChanges {
  @Input() username: string = '';
  messages: Message[] = [];

  constructor(private messageService: MessageService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const usernameChange = changes['username']?.currentValue;

    if (usernameChange) {
      this.loadMessages();
    }
  }

  loadMessages() {
    if (this.username) {
      this.messageService.getMessageThread(this.username).subscribe({
        next: (res) => {
          this.messages = res;
        },
      });
    }
  }
}
