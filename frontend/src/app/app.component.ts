import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title: string = 'Dating App';
  users: any;

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.httpClient
      .get<Observable<any>>('https://localhost:5000/api/users')
      .subscribe({
        next: (res) => {
          this.users = res;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('Users fetched successfully');
        },
      });
  }
}
