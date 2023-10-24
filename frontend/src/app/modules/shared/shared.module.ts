import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 3000,
      easing: 'ease-in-out',
      positionClass: 'toast-center-center',
      preventDuplicates: true,
    }),
  ],
  exports: [BsDropdownModule, ToastrModule],
})
export class SharedModule {}
