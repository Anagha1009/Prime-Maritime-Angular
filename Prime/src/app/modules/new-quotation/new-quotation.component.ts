import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { SRRService } from 'src/app/services/srr.service';

@Component({
  selector: 'app-new-quotation',
  templateUrl: './new-quotation.component.html',
  styleUrls: ['./new-quotation.component.scss'],
})
export class NewQuotationComponent implements OnInit {
  tabs: string = '1';
  currentDate: string = '';
  portList: any[] = [];
  icdList: any[] = [];
  containersizeList: any[] = [];
  servicemodeList: any[] = [];
  quotationForm: FormGroup;
  containerForm: FormGroup;
  commoditiesForm: FormGroup;
  ratesForm: FormGroup;
  effectToDate: string = '';
  submitted: boolean = false;
  submitted1: boolean = false;
  submitted2: boolean = false;
  submitted3: boolean = false;
  commodityType: string = '';
  fileList: File[] = [];
  commodityList: any[] = [];
  rateList: any[] = [];

  //Files
  isUploadedPOL: boolean = false;
  POLAcceptanceFile: string = '';

  isUploadedPOD: boolean = false;
  PODAcceptanceFile: string = '';

  isUploadedVslOp: boolean = false;
  VslOpAcceptanceFile: string = '';

  isUploadedShpLOY: boolean = false;
  ShpLOYAcceptanceFile: string = '';

  isUploadedVslOpAp: boolean = false;
  VslOpApAcceptanceFile: string = '';

  constructor(
    private _commonService: CommonService,
    private _srrService: SRRService,
    private FormBuilder: FormBuilder,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.getQuotationForm();
    this.getContainerForm();
    this.getCommodityForm();
    this.getRateForm();
    this.getDropdown();

    var currentDate = new Date();

    this.currentDate = this.getcurrentDate(currentDate);
    this.quotationForm.get('EFFECT_FROM').setValue(this.currentDate);

    this.getEffectToDate(currentDate);
  }

  // ON CHANGE

  onchangeTab(index) {
    this.tabs = index;
  }

  onChangeCommodityType(event) {
    this.commodityType = event.target.value;

    if (this.commodityType == 'HAZ') {
      this.commoditiesForm.get('FLASH_POINT')?.disable();
      this.commoditiesForm.get('CAS_NO')?.disable();

      this.commoditiesForm.get('IMO_CLASS')?.enable();
      this.commoditiesForm.get('UN_NO')?.enable();
      this.commoditiesForm.get('HAZ_APPROVAL_REF')?.enable();
    } else {
    }

    if (this.commodityType == 'FLEXIBAG') {
      this.commoditiesForm.get('IMO_CLASS')?.disable();
      this.commoditiesForm.get('UN_NO')?.disable();
      this.commoditiesForm.get('HAZ_APPROVAL_REF')?.disable();

      this.commoditiesForm.get('FLASH_POINT')?.enable();
      this.commoditiesForm.get('CAS_NO')?.enable();
    }
  }

  onchangeChargeCode(code) {
    if (code == 'Gross Freight') {
      this.ratesForm.get('STANDARD_RATE')?.setValue('500');
    } else if (code == 'THC') {
      this.ratesForm.get('STANDARD_RATE')?.setValue('750');
    } else if (code == 'EWRI') {
      this.ratesForm.get('STANDARD_RATE')?.setValue('400');
    } else if (code == 'TERMINAL REBATE') {
      this.ratesForm.get('STANDARD_RATE')?.setValue('1800');
    }
  }

  //GET FORM

  getQuotationForm() {
    this.quotationForm = this.FormBuilder.group({
      SRR_NO: [''],
      POL: ['', Validators.required],
      POD: ['', Validators.required],
      ORIGIN_ICD: ['', Validators.required],
      // DESTINATION_ICD: ['', Validators.required],
      SERVICE_NAME: ['', Validators.required],
      EFFECT_FROM: ['', Validators.required],
      EFFECT_TO: ['', Validators.required],
      MTY_REPO: ['', Validators.required],
      CUSTOMER_NAME: ['', Validators.required],
      ADDRESS: ['', Validators.required],
      ADDRESS1: [''],
      EMAIL: ['', Validators.required],
      CONTACT: ['', Validators.required],
      SHIPPER: ['', Validators.required],
      CONSIGNEE: [''],
      OTHER_PARTIES: [''],
      NOTIFY_PARTY: [''],
      BROKERAGE_PARTY: [''],
      FORWARDER: [''],
      PLACE_OF_RECEIPT: [''],
      PLACE_OF_DELIVERY: [''],
      TSP_1: [''],
      TSP_2: [''],
      CONTAINER_TYPE: [''],
      CONTAINER_SIZE: [''],
      SERVICE_MODE: [''],
      POD_FREE_DAYS: [''],
      POL_FREE_DAYS: [''],
      IMM_VOLUME_EXPECTED: [''],
      TOTAL_VOLUME_EXPECTED: [''],
      CREATED_BY: [''],
      AGENT_NAME: [''],
      AGENT_CODE: [''],
      STATUS: ['Requested'],
      SRR_CONTAINERS: new FormArray([]),
      SRR_COMMODITIES: new FormArray([]),
      SRR_RATES: new FormArray([]),
    });
  }

  getContainerForm() {
    this.containerForm = this.FormBuilder.group({
      CONTAINER_TYPE: ['', Validators.required],
      CONTAINER_SIZE: ['', Validators.required],
      SERVICE_MODE: ['', Validators.required],
      POD_FREE_DAYS: ['', Validators.required],
      POL_FREE_DAYS: ['', Validators.required],
      IMM_VOLUME_EXPECTED: ['', Validators.required],
      TOTAL_VOLUME_EXPECTED: ['', Validators.required],
    });
  }

  getCommodityForm() {
    this.commoditiesForm = this.FormBuilder.group({
      COMMODITY_NAME: ['', Validators.required],
      LENGTH: [''],
      WIDTH: [''],
      HEIGHT: [''],
      COMMODITY_TYPE: ['', Validators.required],
      IMO_CLASS: ['', Validators.required],
      UN_NO: ['', Validators.required],
      HAZ_APPROVAL_REF: ['', Validators.required],
      FLASH_POINT: ['', Validators.required],
      CAS_NO: ['', Validators.required],
      REMARKS: [''],
    });
  }

  getRateForm() {
    this.ratesForm = this.FormBuilder.group({
      CHARGE_CODE: ['', Validators.required],
      TRANSPORT_TYPE: ['', Validators.required],
      CURRENCY: ['', Validators.required],
      PAYMENT_TERM: ['', Validators.required],
      STANDARD_RATE: [''],
      RATE_REQUESTED: ['', Validators.required],
      REMARKS: [''],
    });
  }

  get f() {
    return this.quotationForm.controls;
  }

  get f1() {
    return this.containerForm.controls;
  }

  get f2() {
    return this.commoditiesForm.controls;
  }

  get f3() {
    return this.ratesForm.controls;
  }

  //GET DATA

  getDropdown() {
    this._commonService.getDropdownData('PORT').subscribe((res) => {
      if (res.hasOwnProperty('Data')) {
        this.portList = res.Data;
      }
    });

    this._commonService.getDropdownData('ICD').subscribe((res) => {
      if (res.hasOwnProperty('Data')) {
        this.icdList = res.Data;
      }
    });

    this._commonService.getDropdownData('CONTAINER_SIZE').subscribe((res) => {
      if (res.hasOwnProperty('Data')) {
        this.containersizeList = res.Data;
      }
    });

    this._commonService.getDropdownData('SERVICE_MODE').subscribe((res) => {
      if (res.hasOwnProperty('Data')) {
        this.servicemodeList = res.Data;
      }
    });
  }

  getcurrentDate(date) {
    // var date: any = new Date();

    var todate: any = date.getDate();
    if (todate < 10) {
      todate = '0' + todate;
    }

    var month = date.getMonth() + 1;

    if (month < 10) {
      month = '0' + month;
    }

    var year = date.getFullYear();
    return year + '-' + month + '-' + todate;
  }

  getEffectToDate(e) {
    let x = new Date(e);

    var newDate = new Date();
    newDate.setDate(x.getDate() + 15);

    this.effectToDate = this.getcurrentDate(newDate);
    this.quotationForm.get('EFFECT_TO').setValue(this.effectToDate);
  }

  // ON SAVE

  saveQuotation() {
    this.submitted = true;

    if (this.quotationForm.invalid) {
      return;
    }

    this.onchangeTab('2');
  }

  saveContainer() {
    this.submitted1 = true;

    if (this.containerForm.invalid) {
      return;
    }

    this.quotationForm.patchValue(this.containerForm.value);
    var mty = this.quotationForm.get('MTY_REPO')?.value;
    mty == 'true'
      ? this.quotationForm.get('MTY_REPO')?.setValue(true)
      : this.quotationForm.get('MTY_REPO')?.setValue(false);
    var containers = this.quotationForm.get('SRR_CONTAINERS') as FormArray;
    containers.push(
      this.FormBuilder.group({
        NO_OF_CONTAINERS: [this.containerForm.value.IMM_VOLUME_EXPECTED],
      })
    );

    this.onchangeTab('3');
  }

  addCommodity() {
    this.submitted2 = true;

    if (this.commodityType == 'NORMAL') {
      this.commoditiesForm.get('IMO_CLASS')?.disable();
      this.commoditiesForm.get('UN_NO')?.disable();
      this.commoditiesForm.get('HAZ_APPROVAL_REF')?.disable();
      this.commoditiesForm.get('FLASH_POINT')?.disable();
      this.commoditiesForm.get('CAS_NO')?.disable();
    } else if (this.commodityType == 'HAZ') {
      this.commoditiesForm.get('FLASH_POINT')?.disable();
      this.commoditiesForm.get('CAS_NO')?.disable();
    } else if (this.commodityType == 'FLEXIBAG') {
      this.commoditiesForm.get('IMO_CLASS')?.disable();
      this.commoditiesForm.get('UN_NO')?.disable();
      this.commoditiesForm.get('HAZ_APPROVAL_REF')?.disable();
    }

    if (this.commoditiesForm.invalid) {
      return;
    }

    var length = this.commoditiesForm.get('LENGTH')?.value;
    this.commoditiesForm.get('LENGTH')?.setValue(length == '' ? 0 : +length);

    var width = this.commoditiesForm.get('WIDTH')?.value;
    this.commoditiesForm.get('WIDTH')?.setValue(width == '' ? 0 : +width);

    var height = this.commoditiesForm.get('HEIGHT')?.value;
    this.commoditiesForm.get('HEIGHT')?.setValue(height == '' ? 0 : +height);

    var commodities = this.quotationForm.get('SRR_COMMODITIES') as FormArray;
    commodities.push(this.commoditiesForm);
    this.commodityList.push(this.commoditiesForm.value);

    // this.commoditiesForm.reset();
    this.submitted2 = false;
  }

  saveCommodity() {
    this.onchangeTab('4');
  }

  addRate() {
    this.submitted3 = true;

    if (this.ratesForm.invalid) {
      return;
    }

    var rates = this.quotationForm.get('SRR_RATES') as FormArray;
    rates.push(this.ratesForm);
    this.rateList.push(this.ratesForm.value);
  }

  saveRate() {
    var POL = this.quotationForm.value.POL;
    var POD = this.quotationForm.value.POD;

    this.quotationForm.get('SRR_NO')?.setValue(this.getRandomNumber(POL, POD));
    this.quotationForm
      .get('CREATED_BY')
      ?.setValue(localStorage.getItem('username'));
    this.quotationForm
      .get('AGENT_NAME')
      ?.setValue(localStorage.getItem('username'));
    this.quotationForm
      .get('AGENT_CODE')
      ?.setValue(localStorage.getItem('rolecode'));

    var otherparties = this.quotationForm.get('OTHER_PARTIES')?.value;

    this.quotationForm
      .get('BROKERAGE_PARTY')
      ?.setValue(otherparties == 'Brokerage Party' ? 'Yes' : 'No');
    this.quotationForm
      .get('CONSIGNEE')
      ?.setValue(otherparties == 'Consignee' ? 'Yes' : 'No');
    this.quotationForm
      .get('FORWARDER')
      ?.setValue(otherparties == 'Forwarder' ? 'Yes' : 'No');

    console.log(JSON.stringify(this.quotationForm.value));
    this._srrService
      .insertSRR(JSON.stringify(this.quotationForm.value))
      .subscribe((res) => {
        if (res.responseCode == 200) {
          if (this.commodityType == 'HAZ' || this.commodityType == 'FLEXIBAG') {
            this.uploadFilestoDB();
          }
          alert('Your quotation has been submitted successfully !');
          this._router.navigateByUrl('home/agent-dashboard');
        }
      });
  }

  // FILE UPLOAD

  fileUpload(event, value) {
    if (event.target.files[0].type == 'application/pdf') {
    } else {
      alert('Please Select PDF only');
      return;
    }

    if (+event.target.files[0].size > 5000000) {
      alert('Please upload file less than 5 mb..!');
      return;
    }

    this.fileList.push(event.target.files[0]);

    if (value == 'POL') {
      this.isUploadedPOL = true;
      this.POLAcceptanceFile = event.target.files[0].name;
    }

    if (value == 'POD') {
      this.isUploadedPOD = true;
      this.PODAcceptanceFile = event.target.files[0].name;
    }

    if (value == 'VslOp') {
      this.isUploadedVslOp = true;
      this.VslOpAcceptanceFile = event.target.files[0].name;
    }

    if (value == 'ShpLOY') {
      this.isUploadedShpLOY = true;
      this.ShpLOYAcceptanceFile = event.target.files[0].name;
    }

    if (value == 'VslOpAp') {
      this.isUploadedVslOpAp = true;
      this.VslOpApAcceptanceFile = event.target.files[0].name;
    }
  }

  uploadFilestoDB() {
    const payload = new FormData();
    this.fileList.forEach((element) => {
      payload.append('formFile', element);
    });

    //this._srrService.uploadFiles(payload).subscribe();
  }

  // OTHER FUNCTIONS

  getRandomNumber(pol, pod) {
    var num = Math.floor(Math.random() * 1e16).toString();
    return pol + '-' + pod + '-' + num;
  }
}
