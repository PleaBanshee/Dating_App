import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { TimeagoModule } from 'ngx-timeago';
import { Member } from 'src/app/models/member';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/message';
import { PresenceService } from 'src/app/services/presence.service';
import { AccountService } from 'src/app/services/account.service';
import { User } from 'src/app/models/user';
import { take } from 'rxjs';

@Component({
  selector: 'app-member-details',
  standalone: true, // component manages its dependencies via imports, not modules
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss'],
  imports: [
    CommonModule,
    TabsModule,
    GalleryModule,
    TimeagoModule,
    MemberMessagesComponent,
  ], // imports for standalone component
})
export class MemberDetailsComponent implements OnInit, OnDestroy {
  // For accessing the memberTabs template variable
  // Resolve the query at the component's initialization,
  // rather than waiting until after the view is created.
  @ViewChild('memberTabs', { static: true }) memberTabs:
    | TabsetComponent
    | undefined;
  member: Member = {} as Member; // Type assertion from empty object to Member
  user: User | undefined;
  messages: Message[] = [];
  images: GalleryItem[] = [];
  activeTab: TabDirective | undefined;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute, // get route parameters
    public presenceService: PresenceService,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
        }
      },
    });
  }

  ngOnInit(): void {
    // Fetch member from data from route resolver
    this.route.data.subscribe({
      next: (data) => {
        this.member = data['member'];
      },
    });
    // listens for changes in query params, and sets the active tab based on the tab value
    this.route.queryParams.subscribe({
      next: (params) => {
        params['tab'] && this.selectTab(params['tab']);
      },
    });
    this.getImages();
  }

  selectTab(heading: string) {
    if (this.memberTabs) {
      const tabToActivate = this.memberTabs.tabs.find(
        (x) => x.heading === heading
      );

      if (tabToActivate) {
        tabToActivate.active = true;
      }
    }
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.user) {
      this.messageService.createHubConnection(this.user, this.member.userName);
    } else {
      this.messageService.stopHubConnection();
    }
  }

  loadMessages() {
    if (this.member) {
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: (res) => {
          this.messages = res;
        },
      });
    }
  }

  getImages() {
    if (!this.member?.photos) return;
    for (const photo of this.member.photos) {
      this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
    }
  }

  // Stops the hub connection when component is destroyed
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
}
