import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Mr, MR_DETAILS } from 'src/app/models/mr';
import { DepoService } from 'src/app/services/depo.service';

@Component({
  selector: 'app-mr-request-list',
  templateUrl: './mr-request-list.component.html',
  styleUrls: ['./mr-request-list.component.scss'],
})
export class MrRequestListComponent implements OnInit {
  mrForm: FormGroup;
  mr = new Mr();
  mrList: any[] = [];
  mrDetailsList: any[] = [];

  @ViewChild('MRModal') MRModal: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;

  constructor(
    private _formBuilder: FormBuilder,
    private _depoService: DepoService
  ) {}

  ngOnInit(): void {
    this.mrForm = this._formBuilder.group({
      MR_NO: [''],
      CONTAINER_NO: [''],
      CUSTOMER_NAME: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
      STATUS: [''],
    });

    this.getMRList();
  }

  getMRList() {
    this.mr.OPERATION = 'GET_MNR_LIST';
    this.mr.DEPO_CODE = localStorage.getItem("usercode");
    this._depoService.getMRList(this.mr).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.mrList = res.Data;
        console.log(this.mrList);
      }
    });
  }
  
  getDetails(MR_NO: string) {
    var mr = new MR_DETAILS();
    mr.MR_NO = MR_NO;
    this._depoService.getMRDetails(mr).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.mrDetailsList = res.Data;
        this.MRModal.nativeElement.click();
      }
    });
  }
  
}
