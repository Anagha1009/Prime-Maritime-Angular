import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';

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

  constructor(
    private _commonService: CommonService,
    private FormBuilder: FormBuilder
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
    // var newDate = new Date();
    // newDate.setDate(currentDate.getDate() + 15);

    // this.effectToDate = this.getcurrentDate(newDate);
    // this.quotationForm.get('EFFECT_TO').setValue(this.effectToDate);
  }

  onchangeTab(e, index) {
    if (e.target.checked) {
      this.tabs = index;
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
}
