import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.scss'],
})
export class RolesModalComponent {
  title: string = '';
  list: any;
  closeBtnName: string = '';

  constructor(public bsModalRef: BsModalRef) {}
}
