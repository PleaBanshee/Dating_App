import { Component, Input, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  @Input() title: string = '';
  user: any = {};
  loggedIn: boolean = false;

  constructor(private accountServive: AccountService) {}

  ngOnInit(): void {}

  login() {
    this.accountServive.login(this.user).subscribe({
      next: (res) => {
        this.user = res;
        this.loggedIn = true;
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  logout() {
    this.loggedIn = false;
  }
}
