import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/models/member';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-member-details',
  standalone: true, // component manages its dependencies via imports, not modules
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss'],
  imports: [CommonModule, TabsModule, GalleryModule], // imports for standalone component
})
export class MemberDetailsComponent implements OnInit {
  member: Member | undefined;
  images: GalleryItem[] = [];

  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute // get route parameters
  ) {}

  ngOnInit(): void {
    this.loadMember();
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
