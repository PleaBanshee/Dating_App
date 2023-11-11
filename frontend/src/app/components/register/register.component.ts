import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter<boolean>(); // Child to Parent data sharing
  user: any = {};
  registerForm: FormGroup = new FormGroup({});

  constructor(
    private accountService: AccountService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = new FormGroup({
      username: new FormControl(),
      password: new FormControl(),
      confirmPassword: new FormControl(),
    });
  }

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
