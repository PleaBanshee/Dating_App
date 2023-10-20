import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  @Input() title: string = '';
  model: any = {};

  ngOnInit(): void {}

  login() {
    console.log(this.model);
  }
}
