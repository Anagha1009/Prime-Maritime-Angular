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
  freightList: any[] = [];
  impCostList: any[] = [];
  impRevList: any[] = [];
  expCostList: any[] = [];
  expRevList: any[] = [];

  constructor(
    private _quotationService: QuotationService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.calcForm = this._formBuilder.group({
      IMP_COST_LIST: new FormArray([]),
      IMP_REV_LIST: new FormArray([]),
      EXP_COST_LIST: new FormArray([]),
      EXP_REV_LIST: new FormArray([]),
    });

    this.getRates();
  }

  getRates() {
    var srr = new QUOTATION();
    srr.POL = 'INIXY';
    srr.POD = 'AEJEA';
    srr.CONTAINER_TYPE = '20DC';
    srr.SRR_NO = 'INIXY-AEJEA-9122935167759038';

    this._quotationService.getCalRate(srr).subscribe((res: any) => {
      debugger;
      if (res.Data.hasOwnProperty('FREIGHTLIST')) {
        this.freightList = res.Data.FREIGHTLIST;
      }
      if (res.Data.hasOwnProperty('IMP_COSTLIST')) {
        this.impCostList = res.Data.IMP_COSTLIST;
        // const add = this.calcForm.get('IMP_COST_LIST') as FormArray;
        // add.clear();
        // add.push(res.Data.IMP_COSTLIST);
      }
      if (res.Data.hasOwnProperty('IMP_REVENUELIST')) {
        this.impRevList = res.Data.IMP_REVENUELIST;
        // const add = this.calcForm.get('IMP_REV_LIST') as FormArray;
        // add.clear();
        // add.push(res.Data.IMP_REVENUELIST);
      }
      if (res.Data.hasOwnProperty('EXP_COSTLIST')) {
        //this.expCostList = res.Data.EXP_COSTLIST;
        debugger;
        var add = this.calcForm.get('EXP_COST_LIST') as FormArray;

        res.Data.EXP_COSTLIST.forEach((element: any) => {
          add.push(this._formBuilder.group(element));
        });
      }
      if (res.Data.hasOwnProperty('EXP_REVENUELIST')) {
        this.expRevList = res.Data.EXP_REVENUELIST;
        // const add = this.calcForm.get('EXP_REV_LIST') as FormArray;
        // add.clear();
        // add.push(res.Data.EXP_REVENUELIST);
      }
    });
  }

  get f() {
    var x = this.calcForm.get('EXP_COST_LIST') as FormArray;

    // x.push(
    //   this._formBuilder.group({
    //     POL: [''],
    //     POD: [''],
    //     CHARGE_CODE: [''],
    //     IE: [''],
    //     CHARGE_TYPE: [''],
    //     CURRENCY: [''],
    //     RATE: [''],
    //   })
    // );
    return x.controls;
  }

  // f1(i: any) {
  //   return i;
  // }
}
