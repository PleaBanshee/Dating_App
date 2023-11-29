import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { Message } from 'src/app/models/message';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss'],
  imports: [CommonModule, TimeagoModule, FormsModule],
})
export class MemberMessagesComponent {
  @ViewChild('messageForm') messageForm: NgForm | undefined;
  @Input() messages: Message[] = [];
  @Input() userName: string = '';
  messageContent: string = '';

  constructor(private messageService: MessageService) {}

  sendMessage() {
    if (!this.userName) return;
    this.messageService
      .sendMessage(this.userName, this.messageContent)
      .subscribe({
        next: (message) => {
          this.messages.push(message);
          this.messageForm?.reset(); // clears values on form
        },
      });
  }
}
