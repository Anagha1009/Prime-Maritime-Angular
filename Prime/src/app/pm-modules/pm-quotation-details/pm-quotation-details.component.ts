import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { QUOTATION } from 'src/app/models/quotation';
import { QuotationService } from 'src/app/services/quotation.service';

@Component({
  selector: 'app-pm-quotation-details',
  templateUrl: './pm-quotation-details.component.html',
  styleUrls: ['./pm-quotation-details.component.scss'],
})
export class PmQuotationDetailsComponent implements OnInit {
  quotationDetails: any;
  rateForm: FormGroup;
  collapse1: boolean = false;
  collapse2: boolean = false;
  collapse3: boolean = false;
  srrcal: boolean = false;
  SRR_NO: any = '';
  calcForm: FormGroup;

  constructor(
    private _quotationService: QuotationService,
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.SRR_NO = this._activatedRoute.snapshot.paramMap.get('SRR_NO');
    this.rateForm = this._formBuilder.group({
      SRR_RATES: new FormArray([]),
    });

    this.getDetails();

    this.calcForm = this._formBuilder.group({
      FREIGHT_LIST: new FormArray([]),
      EXP_COST_LIST: new FormArray([]),
      IMP_COST_LIST: new FormArray([]),
      LADEN_BACK_COST: [0],
    });

    this.getRates();
  }

  getDetails() {
    var quot = new QUOTATION();
    quot.SRR_NO = this.SRR_NO;
    this._quotationService.getSRRDetails(quot).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.quotationDetails = res.Data;

        const add = this.rateForm.get('SRR_RATES') as FormArray;
        add.clear();
        res.Data.SRR_RATES.forEach((element: any) => {
          add.push(this._formBuilder.group(element));
        });
      }
    });
  }

  get f1() {
    var x = this.rateForm.get('SRR_RATES') as FormArray;
    return x.controls;
  }

  f(i: any) {
    return i;
  }

  updateRate(item: any, value: string) {
    var srrRates = this.rateForm.value.SRR_RATES.filter(
      (x: any) => x.CONTAINER_TYPE === item
    );

    var isCounterValid = true;
    var isApproveValid = true;
    var isRejectValid = true;

    srrRates.forEach((element: any) => {
      element.STATUS = value;
      element.CREATED_BY = localStorage.getItem('username');
      if (element.APPROVED_RATE == 0 && value == 'Countered') {
        isCounterValid = false;
      } else if (element.APPROVED_RATE != 0 && value == 'Approved') {
        isApproveValid = false;
      } else if (element.APPROVED_RATE != 0 && value == 'Rejected') {
        isRejectValid = false;
      }
    });

    if (!isCounterValid) {
      alert('Counter Rate cannot be zero(0)');
      return;
    }

    if (!isApproveValid || !isRejectValid) {
      srrRates.forEach((element: any) => {
        element.APPROVED_RATE = 0;
        element.REMARKS = '';
      });
    }

    if (
      confirm(
        value == 'Approved'
          ? 'Are you sure want to approve this Rate ? Counter Rate will be marked zero(0) as you are approving the rates'
          : value == 'Rejected'
          ? 'Are you sure want to reject this Rate ? Counter Rate will be marked zero(0) as you are rejecting the rates'
          : 'Are you sure want to counter this Rate ?'
      )
    ) {
      this._quotationService.approveRate(srrRates).subscribe((res: any) => {
        if (res.responseCode == 200) {
          if (value == 'Approved') {
            alert('Rates are approved successfully !');
          } else if (value == 'Rejected') {
            alert('Rates are rejected successfully !');
          } else {
            alert('Rates are countered successfully !');
          }
          this.getDetails();
        }
      });
    }
  }

  getRates() {
    var srr = new QUOTATION();
    srr.POL = 'INIXY';
    srr.POD = 'AEJEA';
    srr.CONTAINER_TYPE = '20DC';
    srr.SRR_NO = 'INIXY-AEJEA-657284290468676';
    srr.NO_OF_CONTAINERS = 13;

    this._quotationService.getCalRate(srr).subscribe((res: any) => {
      if (res.Data.hasOwnProperty('FREIGHTLIST')) {
        console.log(res.Data.FREIGHTLIST);
        const add1 = this.calcForm.get('FREIGHT_LIST') as FormArray;
        add1.clear();
        res.Data.FREIGHTLIST.forEach((element: any) => {
          add1.push(this._formBuilder.group(element));
        });
      }

      if (res.Data.hasOwnProperty('IMP_COSTLIST')) {
        const add2 = this.calcForm.get('IMP_COST_LIST') as FormArray;
        add2.clear();
        res.Data.IMP_COSTLIST.forEach((element: any) => {
          add2.push(this._formBuilder.group(element));
        });
      }

      if (res.Data.hasOwnProperty('EXP_COSTLIST')) {
        var add3 = this.calcForm.get('EXP_COST_LIST') as FormArray;
        add3.clear();
        res.Data.EXP_COSTLIST.forEach((element: any) => {
          add3.push(this._formBuilder.group(element));
        });
      }

      if (res.Data.hasOwnProperty('LADEN_BACK_COST')) {
        this.calcForm
          .get('LADEN_BACK_COST')
          ?.setValue(res.Data.LADEN_BACK_COST);
      }
    });
  }

  get f0() {
    var x = this.calcForm.get('FREIGHT_LIST') as FormArray;
    return x.controls;
  }

  get f2() {
    var x = this.calcForm.get('EXP_COST_LIST') as FormArray;
    return x.controls;
  }

  get f3() {
    var x = this.calcForm.get('IMP_COST_LIST') as FormArray;
    return x.controls;
  }

  TotalIncome() {
    const add = this.calcForm.get('EXP_COST_LIST') as FormArray;
    const add1 = this.calcForm.get('IMP_COST_LIST') as FormArray;
    const add2 = this.calcForm.get('FREIGHT_LIST') as FormArray;

    var total = 0;

    for (var i = 0; i < add2.length; i++) {
      var rr = add2.at(i)?.get('RATE_REQUESTED')?.value;
      total += +rr;
    }

    for (var i = 0; i < add.length; i++) {
      var rr = add.at(i)?.get('RATE_REQUESTED')?.value;
      total += +rr;
    }

    for (var i = 0; i < add1.length; i++) {
      var rr = add1.at(i)?.get('RATE_REQUESTED')?.value;
      total += +rr;
    }

    return Math.round(total * 100) / 100;
  }

  TotalExpense() {
    const add = this.calcForm.get('EXP_COST_LIST') as FormArray;
    const add1 = this.calcForm.get('IMP_COST_LIST') as FormArray;
    const add2 = this.calcForm.get('FREIGHT_LIST') as FormArray;

    var total = 0;

    for (var i = 0; i < add2.length; i++) {
      var rr = add2.at(i)?.get('RATE')?.value;
      total += +rr;
    }

    for (var i = 0; i < add.length; i++) {
      var rr = add.at(i)?.get('RATE')?.value;
      total += +rr;
    }

    for (var i = 0; i < add1.length; i++) {
      var rr = add1.at(i)?.get('RATE')?.value;
      total += +rr;
    }

    return Math.round(total * 100) / 100;
  }
}
