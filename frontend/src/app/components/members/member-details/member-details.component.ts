import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { TimeagoModule } from 'ngx-timeago';
import { Member } from 'src/app/models/member';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/message';
import { PresenceService } from 'src/app/services/presence.service';

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
export class MemberDetailsComponent implements OnInit {
  // For accessing the memberTabs template variable
  // Resolve the query at the component's initialization,
  // rather than waiting until after the view is created.
  @ViewChild('memberTabs', { static: true }) memberTabs:
    | TabsetComponent
    | undefined;
  member: Member = {} as Member; // Type assertion from empty object to Member
  messages: Message[] = [];
  images: GalleryItem[] = [];
  activeTab: TabDirective | undefined;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute, // get route parameters
    public presenceService: PresenceService
  ) {}

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
    if (this.activeTab.heading === 'Messages') {
      this.loadMessages();
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
}
