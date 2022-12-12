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

  constructor(
    private _quotationService: QuotationService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.rateForm = this._formBuilder.group({
      SRR_RATES: new FormArray([]),
    });
    this.getDetails('AEJEA1-QAHMD1-7078198266933213');
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
}
