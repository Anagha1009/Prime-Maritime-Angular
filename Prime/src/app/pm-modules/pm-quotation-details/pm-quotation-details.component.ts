import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
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

  constructor(
    private _quotationService: QuotationService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.rateForm = this._formBuilder.group({
      SRR_RATES: new FormArray([]),
    });
    this.getDetails('BHBAH-SADMM-6398667878112789');
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

    srrRates.forEach((element: any) => {
      element.STATUS = value;
    });

    this._quotationService.approveRate(srrRates).subscribe((res: any) => {
      if (res.responseCode == 200) {
        if (value == 'Approved') {
          alert('Rates are approved successfully !');
        } else {
          alert('Rates are rejected successfully !');
        }
        this.getDetails('BHBAH-SADMM-6398667878112789');
      }
    });
  }
}
