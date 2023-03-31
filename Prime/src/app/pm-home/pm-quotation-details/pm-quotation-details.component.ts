import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { QUOTATION } from 'src/app/models/quotation';
import { CommonService } from 'src/app/services/common.service';
import { QuotationService } from 'src/app/services/quotation.service';

@Component({
  selector: 'app-pm-quotation-details',
  templateUrl: './pm-quotation-details.component.html',
  styleUrls: ['./pm-quotation-details.component.scss'],
})
export class PmQuotationDetailsComponent implements OnInit {
  excRates1: any;
  excRates2: any;
  usdExcRate: any;
  usdRate: any = 0;
  polRate: any = 0;
  podRate: any = 0;
  container: any = '';
  quotationDetails: any;
  commodityDetails: any;
  rateForm: FormGroup;
  collapse1: boolean = false;
  collapse2: boolean = false;
  collapse3: boolean = false;
  srrcal: boolean = false;
  SRR_NO: any = '';
  calcForm: FormGroup;
  requestOptions: any;

  @ViewChild('openScBtn') openScBtn: ElementRef;
  @ViewChild('closeScBtn') closeScBtn: ElementRef;

  constructor(
    private _quotationService: QuotationService,
    private _formBuilder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.SRR_NO = this._activatedRoute.snapshot.paramMap.get('SRR_NO');
    this.rateForm = this._formBuilder.group({
      SRR_RATES: new FormArray([]),
    });

    this.getDetails();

    this.calcForm = this._formBuilder.group({
      FREIGHT_LIST: new FormArray([]),
      POL_EXP: new FormArray([]),
      POD_IMP: new FormArray([]),
      LADEN_BACK_COST: [0],
      EMPTY_BACK_COST: [0],
    });
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

        res.Data.SRR_CONTAINERS.forEach((items: any) => {
          if (items.STATUS == 'Requested') {
            this.rateForm.get('SRR_RATES').value.forEach((element: any) => {
              element.APPROVED_RATE = element.RATE_REQUESTED;
            });

            add.patchValue(this.rateForm.get('SRR_RATES').value);
          }
        });

        this.commodityDetails = res.Data.SRR_COMMODITIES;
        this.container = this.quotationDetails?.SRR_CONTAINERS[0].CONTAINERS;
      }
    });
  }

  onchangeContainer(event: any) {
    this.getRates(event.target.value);
  }

  get f1() {
    var x = this.rateForm.get('SRR_RATES') as FormArray;
    return x.controls.filter(
      (x) => x.get('RATE_TYPE').value === 'FREIGHT_CHARGES'
    );
  }

  get f4() {
    var x = this.rateForm.get('SRR_RATES') as FormArray;
    return x.controls.filter((x) => x.get('RATE_TYPE').value === 'POL CHARGES');
  }

  get f5() {
    var x = this.rateForm.get('SRR_RATES') as FormArray;
    return x.controls.filter((x) => x.get('RATE_TYPE').value === 'POD_CHARGES');
  }

  updateRate(item: any, value: string) {
    var srrRates = this.rateForm.value.SRR_RATES.filter(
      (x: any) => x.CONTAINER_TYPE === item
    );

    var isApproveValid = true;
    var isRejectValid = true;

    srrRates.forEach((element: any) => {
      element.STATUS = value;
      element.CREATED_BY = this._commonService.getUser().role;

      if (element.APPROVED_RATE != 0 && value == 'Approved') {
        isApproveValid = false;
      } else if (element.APPROVED_RATE != 0 && value == 'Rejected') {
        isRejectValid = false;
      }
    });

    if (!isApproveValid || !isRejectValid) {
      srrRates.forEach((element: any) => {
        element.APPROVED_RATE = element.RATE_REQUESTED;
        element.REMARKS = '';
      });
    }

    if (
      confirm(
        value == 'Approved'
          ? 'Are you sure want to approve this Rate ?'
          : value == 'Rejected'
          ? 'Are you sure want to reject this Rate ?'
          : 'Are you sure want to counter this Rate ?'
      )
    ) {
      this._quotationService.approveRate(srrRates).subscribe((res: any) => {
        if (res.responseCode == 200) {
          if (value == 'Approved') {
            this._commonService.successMsg('Rates are approved successfully !');
          } else if (value == 'Rejected') {
            this._commonService.successMsg('Rates are rejected successfully !');
          } else {
            this._commonService.successMsg(
              'Rates are countered successfully !'
            );
          }
          this.getDetails();
        }
      });
    }
  }

  getRates(container: any) {
    var srr = new QUOTATION();
    srr.POL = this.quotationDetails?.SRR_NO.split('-')[0];
    srr.POD = this.quotationDetails?.SRR_NO.split('-')[1];
    srr.CONTAINER_TYPE = container.split(' X ')[0];
    srr.SRR_NO = this.quotationDetails?.SRR_NO;
    srr.NO_OF_CONTAINERS = container.split(' X ')[1];

    const add1 = this.calcForm.get('FREIGHT_LIST') as FormArray;
    add1.clear();

    this.quotationDetails.SRR_RATES.filter(
      (x: any) => x.RATE_TYPE === 'FREIGHT_CHARGES'
    ).forEach((element: any) => {
      add1.push(this._formBuilder.group(element));
    });

    const add2 = this.calcForm.get('POL_EXP') as FormArray;
    add2.clear();

    this.quotationDetails.SRR_RATES.filter(
      (x: any) => x.RATE_TYPE === 'POL CHARGES'
    ).forEach((element: any) => {
      add2.push(this._formBuilder.group(element));
    });

    const add3 = this.calcForm.get('POD_IMP') as FormArray;
    add3.clear();
    this.quotationDetails.SRR_RATES.filter(
      (x: any) => x.RATE_TYPE === 'POD_CHARGES'
    ).forEach((element: any) => {
      add3.push(this._formBuilder.group(element));
    });

    this._quotationService
      .getExcRates(
        add2.at(0)?.get('CURRENCY')?.value,
        this.quotationDetails.AGENT_CODE
      )
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.excRates1 = res.Data;
          //convert pol aed to usd
          this.polRate = this.excRates1.TT_SELLING;
        } else {
          this._commonService.warnMsg('Please enter exhange rates first!');
        }
      });

    this._quotationService
      .getExcRates(
        add3.at(0)?.get('CURRENCY')?.value,
        this.quotationDetails.AGENT_CODE
      )
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.excRates2 = res.Data;
          //convert pol aed to usd
          this.podRate = this.excRates2.TT_SELLING;
        } else {
          this._commonService.warnMsg('Please enter exhange rates first!');
        }
      });

    this._quotationService
      .getExcRates('USD', this.quotationDetails.AGENT_CODE)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.usdExcRate = res.Data;
          //usd rate
          this.usdRate = this.usdExcRate.TT_SELLING;
        } else {
          this._commonService.warnMsg('Please enter exhange rates first!');
        }
      });

    this._quotationService.getCalRate(srr).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.calcForm.get('LADEN_BACK_COST').setValue(res.Data.LADEN_BACK_COST);
        this.calcForm.get('EMPTY_BACK_COST').setValue(res.Data.EMPTY_BACK_COST);
      }
    });
  }

  numericOnly(event: any) {
    this._commonService.numericOnly(event);
  }

  get f0() {
    var x = this.calcForm.get('FREIGHT_LIST') as FormArray;
    return x.controls;
  }

  get f2() {
    var x = this.calcForm.get('POL_EXP') as FormArray;
    return x.controls;
  }

  get f3() {
    var x = this.calcForm.get('POD_IMP') as FormArray;
    return x.controls;
  }

  TotalIncome() {
    const add = this.calcForm.get('POL_EXP') as FormArray;
    const add1 = this.calcForm.get('POD_IMP') as FormArray;
    const add2 = this.calcForm.get('FREIGHT_LIST') as FormArray;

    var total = 0;
    var total1 = 0;
    var total2 = 0;
    //POL
    for (var i = 0; i < add.length; i++) {
      var rr = add.at(i)?.get('RATE_REQUESTED')?.value;
      total1 += +rr;
    }
    total1 = total1 * this.polRate;

    total1 = total1 / this.usdRate;

    //POD
    for (var i = 0; i < add1.length; i++) {
      var rr = add1.at(i)?.get('RATE_REQUESTED')?.value;
      total2 += +rr;
    }
    total2 = total2 * this.podRate;
    total2 = total2 / this.usdRate;
    total = total1 + total2;

    //freights
    for (var i = 0; i < add2.length; i++) {
      var rr = add2.at(i)?.get('RATE_REQUESTED')?.value;
      total += +rr;
    }

    return Math.round(total * 100) / 100;
  }

  TotalExpense() {
    const add = this.calcForm.get('POL_EXP') as FormArray;
    const add1 = this.calcForm.get('POD_IMP') as FormArray;
    const add2 = this.calcForm.get('FREIGHT_LIST') as FormArray;

    var total = 0;
    var total1 = 0;
    var total2 = 0;

    //POL
    for (var i = 0; i < add.length; i++) {
      var rr = add.at(i)?.get('STANDARD_RATE')?.value;
      total1 += +rr;
    }
    total1 = total1 * this.polRate;
    total1 = total1 / this.usdRate;

    //POD
    for (var i = 0; i < add1.length; i++) {
      var rr = add1.at(i)?.get('RATE')?.value;
      total2 += +rr;
    }
    total2 = total2 * this.podRate;
    total2 = total2 / this.usdRate;

    total = total1 + total2;

    //freights
    for (var i = 0; i < add2.length; i++) {
      var rr = add2.at(i)?.get('STANDARD_RATE')?.value;
      total += +rr;
    }

    return Math.round(total * 100) / 100;
  }

  letsCalculate() {
    this.getRates(this.quotationDetails?.SRR_CONTAINERS[0].CONTAINERS);
    this.openScBtn.nativeElement.click();
  }
}
