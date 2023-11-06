import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/models/member';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss'],
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member | undefined;
  photoNames: string[] = [];

  constructor(private memberService: MembersService) {}

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
