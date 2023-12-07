import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from '../components/modals/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  bsModalRef: BsModalRef<ConfirmDialogComponent> | undefined;

  constructor(private modalService: BsModalService) {}

  confirm(
    title: string = 'Confirmation',
    message: string = 'Are you sure you want to cancel your changes made?',
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel'
  ) {
    const config = {
      initialState: {
        title,
        message,
        btnOkText,
        btnCancelText,
      },
    };
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent, config);
  }
}
