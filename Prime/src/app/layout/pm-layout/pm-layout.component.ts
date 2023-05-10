import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-pm-layout',
  templateUrl: './pm-layout.component.html',
  styleUrls: ['./pm-layout.component.scss'],
})
export class PmLayoutComponent implements OnInit {
  username: any;
  constructor(private _cs: CommonService) {}

  ngOnInit(): void {
    this.username = this._cs.getUserName();
  }
}
