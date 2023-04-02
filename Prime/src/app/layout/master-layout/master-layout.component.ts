import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-master-layout',
  templateUrl: './master-layout.component.html',
  styleUrls: ['./master-layout.component.scss'],
})
export class MasterLayoutComponent implements OnInit {
  isagentMaster: boolean = false;
  menu: any;
  username: any;

  constructor(private _cs: CommonService) {}

  ngOnInit(): void {
    if (this._cs.getUser().roleCode == 1) {
      this.isagentMaster = true;
    } else {
      this.isagentMaster = false;
    }

    this.menu = this._cs.getUser().roleCode;
    this.username = this._cs.getUserName();
  }
}
