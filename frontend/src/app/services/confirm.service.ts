import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from '../components/modals/confirm-dialog/confirm-dialog.component';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  bsModalRef: BsModalRef<ConfirmDialogComponent> | undefined;

  constructor(private modalService: BsModalService) {}

  confirm(
    title: string = 'Confirmation',
    message: string = 'Are you sure you want to continue? Any unsaved changes will be lost.',
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel'
  ): Observable<boolean> {
    const config = {
      initialState: {
        title,
        message,
        btnOkText,
        btnCancelText,
      },
    };
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent, config);
    // returns an Observable of type boolean
    return this.bsModalRef.onHidden!.pipe(
      // transforms event into the result
      map(() => {
        return this.bsModalRef!.content!.result;
      })
    );
  }
}
