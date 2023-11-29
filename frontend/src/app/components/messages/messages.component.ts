import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/models/message';
import { Pagination } from 'src/app/models/pagination';
import { UserParams } from 'src/app/models/user-params';
import { MembersService } from 'src/app/services/members.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  messages: Message[] | undefined;
  pagination: Pagination | undefined;
  userParams: UserParams | undefined;
  container: string = 'Unread';
  pageNumber: number = 1;
  pageSize: number = 5;
  loading: boolean = false;

  constructor(
    private messageService: MessageService,
    private memberService: MembersService
  ) {
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  // TODO: Fix user params (pagination) for component
  loadMessages() {
    this.loading = true;
    if (this.userParams) {
      this.memberService.setUserParams(this.userParams);
      this.messageService
        .getMessages(this.pageNumber, this.pageSize, this.container)
        .subscribe({
          next: (res) => {
            this.messages = res.result;
            this.pagination = res.pagination;
            this.loading = false;
          },
        });
    }
  }

  resetFilters() {
    this.userParams = this.memberService.resetUserParams();
    this.loadMessages();
  }
}
