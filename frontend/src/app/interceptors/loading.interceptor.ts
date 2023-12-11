import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, delay, finalize, tap } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loaderService: LoaderService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.loaderService.busyLoading();

    // spinnerloads for 1 second
    // tap() allows you to perform side effects and manage observable
    // streams without altering the emitted data
    return next.handle(request).pipe(
      !environment.production ? delay(1000) : tap(),
      finalize(() => {
        this.loaderService.idle();
      })
    );
  }
}
