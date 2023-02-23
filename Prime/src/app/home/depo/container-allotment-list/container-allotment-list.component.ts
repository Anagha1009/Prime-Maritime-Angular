import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Bl } from 'src/app/models/bl';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-container-allotment-list',
  templateUrl: './container-allotment-list.component.html',
  styleUrls: ['./container-allotment-list.component.scss'],
})
export class ContainerAllotmentListComponent implements OnInit {
  containerAllotmentList: any[] = [];
  isScroll: boolean = false;
  containerForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _blService: BlService,
    private _commonService:CommonService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.containerForm = this._formBuilder.group({
      CONTAINER_NO: [''],
      CUSTOMER_NAME: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
      STATUS: [''],
    });

    this.getDepoContainerList();
  }

  Search() {}

  Clear() {}

  getDepoContainerList() {
    var bl = new Bl();
    bl.AGENT_CODE = '';
    bl.DEPO_CODE = '022';
    this._blService.getContainerList(bl).subscribe((res: any) => {
      this.isScroll = false;
      this.containerAllotmentList = [];
      if (res.ResponseCode == 200) {
        if (res.Data.length > 0) {
          this.containerAllotmentList = res.Data;

          if (this.containerAllotmentList?.length >= 4) {
            this.isScroll = true;
          } else {
            this.isScroll = false;
          }
        }
        this._commonService.getDT();
      }
    });
  }
}
