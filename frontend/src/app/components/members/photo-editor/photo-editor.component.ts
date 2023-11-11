import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';
import { Photo } from 'src/app/models/photo';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss'],
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member | undefined;
  @Input() user: User | undefined;
  photoNames: string[] = [];
  userName: string = '';

  constructor(
    private accountService: AccountService,
    private memberService: MembersService
  ) {
    if (this.user) {
      this.userName = this.user?.username;
    }
  }

  ngOnInit(): void {
    const userNamePattern = /\/([^/]+)\/?$/;
    if (this.member) {
      for (let photo of this.member.photos) {
        if (photo.url) {
          const match = userNamePattern.exec(photo.url);
          if (match) {
            const photoName = match[1];
            this.photoNames.push(photoName);
          }
        }
      }
    }
  }

  setProfilePic(photo: Photo) {
    this.memberService.setProfilePic(photo.id).subscribe({
      next: () => {
        if (this.user && this.member) {
          this.member.photoUrl = photo.url;
          this.user.photoUrl = photo.url;
          // Set the current user so other components are updated with the same user profile pic
          this.accountService.setCurrentUser(this.user);
          this.member.photos.forEach((pic: Photo) => {
            if (pic.isProfilePic) {
              pic.isProfilePic = false;
            }
            if (pic.id === photo.id) {
              pic.isProfilePic = true;
            }
          });
        }
      },
    });
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        if (this.member) {
          this.member.photos = this.member.photos.filter(
            (photo) => photo.id !== photoId
          );
        }
      },
    });
  }
}
