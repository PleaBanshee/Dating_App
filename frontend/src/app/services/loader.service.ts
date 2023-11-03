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
      type: 'ball-clip-rotate',
      bdColor: 'rgba(215,215,219,1.000)', // background colour
      color: 'rgba(50,168,52,1.000)',
    });
  }

  idle() {
    this.loading = false;
    this.spinnerService.hide();
  }
}
