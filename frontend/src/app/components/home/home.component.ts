import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  registerMode: boolean = false;

  registerToggle() {
    this.registerMode = !this.registerMode;
  }
}
