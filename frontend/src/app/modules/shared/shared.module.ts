import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ToastrModule } from 'ngx-toastr';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 3000,
      easing: 'ease-in-out',
      positionClass: 'toast-center-center',
      preventDuplicates: true,
    }),
    FileUploadModule,
  ],
  exports: [BsDropdownModule, ToastrModule, TabsModule, FileUploadModule],
})
export class SharedModule {}
