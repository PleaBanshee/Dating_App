import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { MessageService } from 'src/app/services/message.service';

/* change detection will only be triggered if the input properties of the
   component change or if an event handler is triggered within the component. */
@Component({
  selector: 'app-member-messages',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, //
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss'],
  imports: [CommonModule, TimeagoModule, FormsModule],
})
export class MemberMessagesComponent {
  @ViewChild('messageForm') messageForm: NgForm | undefined;
  @Input() userName: string = '';
  messageContent: string = '';

  constructor(public messageService: MessageService) {}

  sendMessage() {
    if (!this.userName) return;
    this.messageService
      .sendMessage(this.userName, this.messageContent)
      .then(() => {
        this.messageForm?.reset(); // clears values on form
      });
  }
}
