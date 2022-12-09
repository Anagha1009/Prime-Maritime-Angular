import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Mr, MR_DETAILS } from 'src/app/models/mr';
import { DepoService } from 'src/app/services/depo.service';

@Component({
  selector: 'app-pm-mr-request',
  templateUrl: './pm-mr-request.component.html',
  styleUrls: ['./pm-mr-request.component.scss']
})
export class PmMrRequestComponent implements OnInit {

  mr = new Mr();
  mrList: any[] = [];
  mrDetailsList: any[] = [];
  mrForm: FormGroup;

  @ViewChild('MRModal') MRModal: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;

  constructor(
    private _depoService: DepoService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.mrForm = this._formBuilder.group({
      MR_REQ: new FormArray([]),
    });

    this.getMRList();
  }

  f(i: any) {
    return i;
  }

  getMRList() {
    this.mr.OPERATION = 'GET_MNR_LIST_PM';
    this._depoService.getMRList(this.mr).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.mrList = res.Data;
      }
    });
  }

  getDetails(MR_NO: string) {
    var mr = new MR_DETAILS();
    mr.MR_NO = MR_NO;
    this._depoService.getMRDetails(mr).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.mrDetailsList = res.Data;
        //console.log(JSON.stringify(res.Data));

        const add = this.mrForm.get('MR_REQ') as FormArray;
        add.clear();
        res.Data.forEach((element: any) => {
          add.push(this._formBuilder.group(element));
        });
        this.MRModal.nativeElement.click();
      }
    });
  }

  get f1() {
    var r = this.mrForm.get('MR_REQ') as FormArray;
    return r.controls;
  }

  approveRate() {
    //console.log(this.mrForm.value.MR_REQ);
    this._depoService
      .approveRate(this.mrForm.value.MR_REQ)
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Rates are approved successfully !');
          this.closeBtn.nativeElement.click();
          this.getMRList();
        }
      });
  }
}
