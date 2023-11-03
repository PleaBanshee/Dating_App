import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  @Input() title: string = '';
  user: any = {};

  constructor(
    public accountService: AccountService,
    private router: Router,
    private toaster: ToastrService
  ) {}

  login() {
    this.accountService.login(this.user).subscribe({
      next: (res) => {
        console.log(`User: ${res}`);
        this.router.navigateByUrl('/members');
        this.toaster.success('Logged in successfully', 'SUCCESS');
      },
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
    this.user.username = '';
    this.user.password = '';
  }
}
