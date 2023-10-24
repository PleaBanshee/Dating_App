import { Component, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  @Output() cancelRegister = new EventEmitter<boolean>(); // Child to Parent data sharing
  user: any = {};

  constructor(
    private accountService: AccountService,
    private toaster: ToastrService
  ) {}

  register() {
    this.accountService.register(this.user).subscribe({
      next: () => {
        this.cancel();
      },
      error: (err) => {
        console.log(err.error.errors);
        this.toaster.error(
          `${err.error.errors.Password ?? err.error.errors.Username}`,
          'ERROR'
        );
      },
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
