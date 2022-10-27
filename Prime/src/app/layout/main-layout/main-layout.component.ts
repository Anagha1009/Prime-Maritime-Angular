import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  menu: any;

  constructor() {}

  ngOnInit(): void {
    this.menu = localStorage.getItem('username');
  }
}
