import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss'],
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member | undefined;
  photoNames: string[] = [];
  user: User | undefined;

  constructor(
    private accountService: AccountService,
    private memberService: MembersService
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
}
