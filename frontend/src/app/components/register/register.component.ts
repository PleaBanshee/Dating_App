import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  @Input() users: any; // Parent to Child data sharing
  @Output() cancelRegister = new EventEmitter<boolean>(); // Child to Parent data sharing
  user: any = {};

  register() {
    console.log(this.user);
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
