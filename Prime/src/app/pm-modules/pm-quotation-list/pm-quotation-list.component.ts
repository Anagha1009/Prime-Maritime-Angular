import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
// import { SwPush } from '@angular/service-worker';
import { QUOTATION } from 'src/app/models/quotation';
import { QuotationService } from 'src/app/services/quotation.service';

@Component({
  selector: 'app-pm-quotation-list',
  templateUrl: './pm-quotation-list.component.html',
  styleUrls: ['./pm-quotation-list.component.scss'],
})
export class PmQuotationListComponent implements OnInit {
  quotation = new QUOTATION();
  quotationList: any[] = [];
  quotationDetails: any;
  rateForm: FormGroup;

  @ViewChild('RateModal') RateModal: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;

  readonly VAPID_PUBLIC_KEY =
    'BMhvJ95Ji0uVwIzhyeZwb133-4e7Hb_DtMP0-SKTFBcnbg_a7PlLCMD2ofLMNwNLZ5NqM-9pXOX4zDj64R-MXp4';

  constructor(
    private _quotationService: QuotationService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.rateForm = this._formBuilder.group({
      SRR_RATES: new FormArray([]),
    });

    this.getQuotationList();
  }

  getQuotationList() {
    this.quotation.OPERATION = 'GET_SRRLIST_PM';
    this._quotationService.getSRRList(this.quotation).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.quotationList = res.Data;
      }
    });
  }

  getDetails(SRR_NO: string) {
    var quot = new QUOTATION();
    quot.SRR_NO = SRR_NO;
    this._quotationService.getSRRDetails(quot).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.quotationDetails = res.Data;

        const add = this.rateForm.get('SRR_RATES') as FormArray;
        add.clear();
        res.Data.SRR_RATES.forEach((element: any) => {
          add.push(this._formBuilder.group(element));
        });

        this.RateModal.nativeElement.click();
      }
    });
  }

  numericOnly(event: any): boolean {
    // restrict e,+,-,E characters in  input type number
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode == 101 || charCode == 69 || charCode == 45 || charCode == 43) {
      return false;
    }
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
    return true;
  }

  f(i: any) {
    return i;
  }

  get f1() {
    var r = this.rateForm.get('SRR_RATES') as FormArray;
    return r.controls;
  }

  approveRate() {
    this._quotationService
      .approveRate(this.rateForm.value.SRR_RATES)
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Rates are approved successfully !');
          this.closeBtn.nativeElement.click();
          this.getQuotationList();
        }
      });
  }
}
