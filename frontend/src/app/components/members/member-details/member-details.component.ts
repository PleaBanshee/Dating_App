import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { TimeagoModule } from 'ngx-timeago';
import { Member } from 'src/app/models/member';
import { MembersService } from 'src/app/services/members.service';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/models/message';

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
  member: Member | undefined;
  messages: Message[] = [];
  images: GalleryItem[] = [];
  activeTab: TabDirective | undefined;

  constructor(
    private memberService: MembersService,
    private messageService: MessageService,
    private route: ActivatedRoute // get route parameters
  ) {}

  ngOnInit(): void {
    this.loadMember();
    // listens for changes in query params, and sets the active tab based on the tab value
    this.route.queryParams.subscribe({
      next: (params) => {
        params['tab'] && this.selectTab(params['tab']);
      },
    });
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

  loadMember() {
    // extracting the 'username' route parameter from current route: /api/users/{username}
    let username: string | null = this.route.snapshot.paramMap.get('username');
    if (!username) return;
    this.memberService.getMemberByName(username).subscribe({
      next: (member) => {
        this.member = member;
        this.getImages();
      },
    });
  }

  getImages() {
    if (!this.member?.photos) return;
    for (const photo of this.member.photos) {
      this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
    }
  }
}
