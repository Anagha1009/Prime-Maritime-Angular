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

    if (!isApproveValid) {
      alert(
        'Counter Rate will be marked zero(0) as you are approving the rates'
      );
    }

    if (!isRejectValid) {
      alert(
        'Counter Rate will be marked zero(0) as you are rejecting the rates'
      );
    }

    if (!isApproveValid || !isRejectValid) {
      srrRates.forEach((element: any) => {
        element.APPROVED_RATE = 0;
        element.REMARKS = '';
      });
    }

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
