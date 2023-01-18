import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { QUOTATION } from 'src/app/models/quotation';
import { QuotationService } from 'src/app/services/quotation.service';
import * as jquery from 'jquery';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-pm-quotation-list',
  templateUrl: './pm-quotation-list.component.html',
  styleUrls: ['./pm-quotation-list.component.scss'],
})
export class PmQuotationListComponent implements OnInit {
  quotation = new QUOTATION();
  quotationList: any[] = [];
  selectedQuotations:any[]=[];
  quotationDetails: any;
  rateForm: FormGroup;
  quotationForm: FormGroup;
  showButtons:boolean=false;
  readonly VAPID_PUBLIC_KEY =
    'BMhvJ95Ji0uVwIzhyeZwb133-4e7Hb_DtMP0-SKTFBcnbg_a7PlLCMD2ofLMNwNLZ5NqM-9pXOX4zDj64R-MXp4';

  constructor(
    private _quotationService: QuotationService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.quotationForm = this._formBuilder.group({
      SRR_NO: [''],
      CUSTOMER_NAME: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
      STATUS: ['']
    });

    this.rateForm = this._formBuilder.group({
      SRR_RATES: new FormArray([]),
    });

    this.getQuotationList();
  }

  Search() {
    var SRR_NO = this.quotationForm.value.SRR_NO;
    var CUSTOMER_NAME = this.quotationForm.value.CUSTOMER_NAME;
    var STATUS = this.quotationForm.value.STATUS;
    var FROM_DATE = this.quotationForm.value.FROM_DATE;
    var TO_DATE = this.quotationForm.value.TO_DATE;

    if (
      SRR_NO == '' &&
      CUSTOMER_NAME == '' &&
      STATUS == '' &&
      FROM_DATE == '' &&
      TO_DATE == ''
    ) {
      alert('Please enter atleast one filter to search !');
      return;
    } else if (FROM_DATE > TO_DATE) {
      alert('From Date should be less than To Date !');
      return;
    }

    this.quotation.SRR_NO = SRR_NO;
    this.quotation.CUSTOMER_NAME = CUSTOMER_NAME;
    this.quotation.STATUS = STATUS;
    this.quotation.FROMDATE = FROM_DATE;
    this.quotation.TODATE = TO_DATE;

    this.getQuotationList();
  }

  Clear() {
    this.quotationForm.get('SRR_NO')?.setValue('');
    this.quotationForm.get('CUSTOMER_NAME')?.setValue('');
    this.quotationForm.get('STATUS')?.setValue('');
    this.quotationForm.get('FROM_DATE')?.setValue('');
    this.quotationForm.get('TO_DATE')?.setValue('');

    this.quotation.SRR_NO = '';
    this.quotation.CUSTOMER_NAME = '';
    this.quotation.STATUS = '';
    this.quotation.FROMDATE = '';
    this.quotation.TODATE = '';

    this.getQuotationList();
  }

  getQuotationList() {
    this.quotation.OPERATION = 'GET_SRRLIST_PM';

    this._commonService.destroyDT();
    this._quotationService.getSRRList(this.quotation).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.quotationList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  getDetails(SRR_NO: string) {
    this._router.navigateByUrl('/pm/quotation-details/' + SRR_NO);
  }

  get f2() {
    var x = this.quotationForm.get('SRR_MAIN_LIST') as FormArray;
    return x.controls;
  }

  postSelectedRateRequest(item: any, event: any, index: number) {
    debugger;
    this.showButtons=false; 
    if (event.target.checked) {
      this.showButtons=true; 
      this.selectedQuotations.push(item);
    } else {
      this.showButtons=true; 
      this.selectedQuotations = this.selectedQuotations.filter(ele => ele.SRR_NO !== item.SRR_NO);
    }
    if (this.selectedQuotations?.length==0) {
      this.showButtons=false; 
    }
    console.log(this.selectedQuotations);
  }

  approveQuotations(){
    this.selectedQuotations.forEach((element)=>{
      element.STATUS="Approved";
    });
    console.log(this.selectedQuotations);
    this._quotationService.updateSRR(this.selectedQuotations).subscribe((res: any) => {
      if(res.responseCode == 200) {
        this.alertWithSuccess();
        //alert("Updated Successfully");
        // Swal.fire(
        //   'Good job!',
        //   'You clicked the button!',
        //   'success'
        // )
        this.getQuotationList();
      }
    });
  }
  alertWithSuccess(){
    Swal.fire('Congratulations!', 'Quotations are approved succesfully!', 'success');
  }
  rejectQuotations(){
    this.selectedQuotations.forEach((element)=>{
      element.STATUS="Rejected";
    });
    console.log(this.selectedQuotations);
    this._quotationService.updateSRR(this.selectedQuotations).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        alert("Updated Successfully");
        this.getQuotationList();
      }
    });

  }

}
