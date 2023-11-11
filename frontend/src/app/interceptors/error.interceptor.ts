import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// Handles requests and responses between server and client
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toaster: ToastrService) {}

  // Intercepts error messages from server
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error) {
          switch (error.status) {
            case 400:
              // Check for account validation error
              if (error.error.errors) {
                const stateErrors = this.getStateErrors(error.error.errors);
                throw stateErrors.flat(); // concatenates array
              } else {
                this.showErrorToaster(error.error, error.status);
              }
              break;
            case 401:
              this.showErrorToaster(
                'Unauthorized: Invalid username or password',
                error.status
              );
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              this.handleServerError(error.error);
              break;
            default:
              this.toaster.error(
                'Something unexpected went wrong... please try again',
                'ERROR'
              );
              console.log(error);
              break;
          }
        }
        throw error;
      })
    );
  }

  private getStateErrors(errors: any): any {
    const errorObj = [];
    for (const key in errors) {
      if (errors[key]) {
        errorObj.push(errors[key]);
      }
    }
    return errorObj;
  }

  private showErrorToaster(message: string, status: number): void {
    this.toaster.error(message, `ERROR ${status}`);
  }

  private handleServerError(error: any): void {
    // specify how to send state to the router
    const navigationExtras: NavigationExtras = {
      state: { error: error },
    };
    this.router.navigateByUrl('/server-error', navigationExtras);
  }
}
