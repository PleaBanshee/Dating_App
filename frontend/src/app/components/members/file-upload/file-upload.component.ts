import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  @Input() member: Member | undefined;
  @Input() user: User | undefined;
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver: boolean = false;
  baseUrl: string = environment.apiUrl;

  constructor(
    private accountService: AccountService,
    private memberService: MembersService
  ) {}

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    // FileUploader configs
    this.uploader = new FileUploader({
      url: `${this.baseUrl}/users/add-photo`,
      authToken: `Bearer ${this.user?.token}`, // No colon behind bearer, passed with space to headers
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024, // 10 Megabites cap on Cloudinary
    });
    console.log(this.uploader.authToken);

    // Disable credentials when uploading files, prevents CORS issues
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        this.member?.photos.push(photo);
        if (photo.isProfilePic && this.user && this.member) {
          this.user.photoUrl = photo.url; // set the navbar profile pic
          this.member.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
        }
      }
    };
  }
}
