import { Component, Input } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  @Input() title: string = '';
  user: any = {};

  constructor(public accountService: AccountService) {}

  login() {
    this.accountService.login(this.user).subscribe({
      next: (res) => {
        console.log(`User: ${res}`);
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  logout() {
    this.accountService.logout();
  }
}
