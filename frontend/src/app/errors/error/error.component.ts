import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Constants } from 'src/app/constants/Constants';

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
      .get(`${Constants.BASE_URL}/errorhandler/not-found`)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => console.log(err),
      });
  }

  getBadRequest() {
    this.httpClient
      .get(`${Constants.BASE_URL}/errorhandler/bad-request`)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => console.log(err),
      });
  }

  getInternalServerError() {
    this.httpClient
      .get(`${Constants.BASE_URL}/errorhandler/server-error`)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => console.log(err),
      });
  }

  getNotAuth() {
    this.httpClient.get(`${Constants.BASE_URL}/errorhandler/auth`).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => console.log(err),
    });
  }

  getValidationError() {
    this.httpClient
      .post(`${Constants.BASE_URL}/account/register`, {})
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
