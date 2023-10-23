import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  @Input() title: string = '';
  user: any = {};

  constructor(public accountService: AccountService) {}

  ngOnInit(): void {}

  login() {
    this.accountService.login(this.user).subscribe({
      next: (res) => {},
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  logout() {
    this.accountService.logout();
  }
}
