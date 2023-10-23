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

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.accountServive.currentUser$.subscribe({
      next: (user) => (this.loggedIn = !!user),
      error: (err) => console.log(err.error),
    });
  }

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
    this.accountServive.logout();
    this.loggedIn = false;
  }
}
