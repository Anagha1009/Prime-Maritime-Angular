import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-new-quotation',
  templateUrl: './new-quotation.component.html',
  styleUrls: ['./new-quotation.component.css'],
})
export class NewQuotationComponent implements OnInit {
  portList: any[] = [];
  icdList: any[] = [];

  constructor(private _commonService: CommonService) {}

  ngOnInit(): void {
    this.getDropdown();
  }

  getDropdown() {
    this._commonService.getDropdownData('PORT').subscribe((res) => {
      if (res.hasOwnProperty('Data')) {
        this.portList = res.Data;
      }
    });

    this._commonService.getDropdownData('ICD').subscribe((res) => {
      if (res.hasOwnProperty('Data')) {
        this.icdList = res.Data;
      }
    });
  }
}
