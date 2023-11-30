import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  loading: boolean = false;

  constructor(private spinnerService: NgxSpinnerService) {}

  busyLoading() {
    this.loading = true;
    this.spinnerService.show(undefined, {
      type: 'ball-spin',
      color: 'rgba(255, 94, 223, 1)',
    });
  }

  idle() {
    this.loading = false;
    this.spinnerService.hide();
  }
}
