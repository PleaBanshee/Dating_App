import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})

// Serves as error handler for errors received from backend
export class ErrorComponent {
  validationErrors: string[] = [];

  constructor(private httpClient: HttpClient) {}

  getNotFound() {
    this.httpClient
      .get(`${environment.apiUrl}/errorhandler/not-found`)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => console.log(err),
      });
  }

  getBadRequest() {
    this.httpClient
      .get(`${environment.apiUrl}/errorhandler/bad-request`)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => console.log(err),
      });
  }

  getInternalServerError() {
    this.httpClient
      .get(`${environment.apiUrl}/errorhandler/server-error`)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => console.log(err),
      });
  }

  getNotAuth() {
    this.httpClient.get(`${environment.apiUrl}/errorhandler/auth`).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => console.log(err),
    });
  }

  getValidationError() {
    this.httpClient
      .post(`${environment.apiUrl}/account/register`, {})
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          this.validationErrors = err;
          console.log(err);
        },
      });
  }
}
