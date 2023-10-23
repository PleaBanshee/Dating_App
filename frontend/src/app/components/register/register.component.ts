import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  user: any = {};

  register() {
    console.log(this.user);
  }

  cancel() {
    console.log(`Cancelled`);
  }
}
