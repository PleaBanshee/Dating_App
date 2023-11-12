import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
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
      username: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        this.matchValues('password'),
      ]),
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => {
        this.registerForm.controls['confirmPassword'].updateValueAndValidity();
      },
    });
  }

  // Compares the values of the two password controls
  // The outer function returns an inner function that represents the validator function
  // If the values don't match, returns an object with an error key
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value
        ? null
        : { notMatching: true };
    };
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
