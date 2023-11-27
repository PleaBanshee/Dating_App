import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TimeagoModule } from 'ngx-timeago';
import { Message } from 'src/app/models/message';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss'],
  imports: [CommonModule, TimeagoModule],
})
export class MemberMessagesComponent {
  @Input() messages: Message[] = [];
  @Input() userName: string = '';

  constructor() {}
}
