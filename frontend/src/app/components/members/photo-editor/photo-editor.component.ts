import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { Photo } from 'src/app/models/photo';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss'],
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member | undefined;
  @ViewChild(FileUploadComponent) fileUploadComponent:
    | FileUploadComponent
    | undefined;
  photoNames: string[] = [];
  user: User | undefined;
  userName: string = '';

  constructor(
    private accountService: AccountService,
    private memberService: MembersService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          this.userName = user.username;
        }
      },
    });
    this.memberService.getMemberByName(this.userName).subscribe({
      next: (member) => {
        this.member = member;
      },
    });
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
    this.fileUploadComponent?.emitProfilePic(photo);
    this.memberService.setProfilePic(photo.id).subscribe({
      next: () => {
        if (this.user && this.member) {
          this.member.photoUrl = photo.url;
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
}
