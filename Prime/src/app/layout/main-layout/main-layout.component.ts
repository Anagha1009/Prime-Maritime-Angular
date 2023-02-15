import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  menu: any;
  username: any;

  constructor(private _cs: CommonService) {}

  ngOnInit(): void {
    this.menu = this._cs.getUser().roleCode;
    this.username = this._cs.getUserName();
  }
}
