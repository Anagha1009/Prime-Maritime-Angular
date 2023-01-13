import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { QUOTATION } from 'src/app/models/quotation';
import { QuotationService } from 'src/app/services/quotation.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent implements OnInit {
  calcForm: FormGroup;

  constructor(
    private _quotationService: QuotationService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.calcForm = this._formBuilder.group({
      FREIGHT_LIST: new FormArray([]),
      EXP_COST_LIST: new FormArray([]),
      IMP_COST_LIST: new FormArray([]),
      LADEN_BACK_COST: [0],
    });

    this.getRates();
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

  get f() {
    var x = this.calcForm.get('EXP_COST_LIST') as FormArray;
    return x.controls;
  }

  get f1() {
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
