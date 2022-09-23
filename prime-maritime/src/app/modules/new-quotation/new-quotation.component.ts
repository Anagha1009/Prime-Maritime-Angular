import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { SrrService } from 'src/app/services/srr.service';

@Component({
  selector: 'app-new-quotation',
  templateUrl: './new-quotation.component.html',
  styleUrls: ['./new-quotation.component.css'],
})
export class NewQuotationComponent implements OnInit {
  portList: any[] = [];
  icdList: any[] = [];
  quotationForm: FormGroup;
  containerForm: FormGroup;
  commoditiesForm: FormGroup;
  ratesForm: FormGroup;
  tabActive: string = 'SRR';
  commodityList: any[] = [];
  rateList: any[] = [];

  constructor(
    private _commonService: CommonService,
    private _srrService: SrrService,
    private FormBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.quotationForm = this.FormBuilder.group({
      SRR_NO: [''],
      POL: [''],
      POD: [''],
      ORIGIN_ICD: [''],
      DESTINATION_ICD: [''],
      SERVICE_NAME: [''],
      EFFECT_FROM: [''],
      EFFECT_TO: [''],
      MTY_REPO: [''],
      CUSTOMER_NAME: [''],
      ADDRESS: [''],
      EMAIL: [''],
      CONTACT: [''],
      SHIPPER: [''],
      CONSIGNEE: [''],
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
      STATUS: ['Drafted'],
      SRR_CONTAINERS: new FormArray([]),
      SRR_COMMODITIES: new FormArray([]),
      SRR_RATES: new FormArray([]),
    });

    this.getContainerForm();
    this.getCommodityForm();
    this.getRateForm();
    this.getDropdown();
  }

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
  }

  getContainerForm() {
    this.containerForm = this.FormBuilder.group({
      // SRR_ID: [''],
      // SRR_NO: [''],
      // NO_OF_CONTAINERS: [''],
      // CREATED_BY: [''],
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
    });
  }

  getCommodityForm() {
    this.commoditiesForm = this.FormBuilder.group({
      COMMODITY_NAME: [''],
      LENGTH: [''],
      WIDTH: [''],
      HEIGHT: [''],
      COMMODITY_TYPE: [''],
      REMARKS: [''],
    });
  }

  getRateForm() {
    this.ratesForm = this.FormBuilder.group({
      CHARGE_CODE: [''],
      TRANSPORT_TYPE: [''],
      CURRENCY: [''],
      PAYMENT_TERM: [''],
      STANDARD_RATE: [''],
      RATE_REQUESTED: [''],
      REMARKS: [''],
    });
  }

  onAddContainers() {
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
    this.activeTabs('Commodities');
  }

  onAddCommodities() {
    var commodities = this.quotationForm.get('SRR_COMMODITIES') as FormArray;
    commodities.push(this.commoditiesForm);
    this.commodityList.push(this.commoditiesForm.value);
  }

  onAddRates() {
    var rates = this.quotationForm.get('SRR_RATES') as FormArray;
    rates.push(this.ratesForm);
    this.rateList.push(this.ratesForm.value);
  }

  activeTabs(tab) {
    this.tabActive = tab;
  }

  insertQuotation() {
    debugger;
    var POL = this.quotationForm.value.POL;
    var POD = this.quotationForm.value.POD;

    this.quotationForm.get('SRR_NO')?.setValue(this.getRandomNumber(POL, POD));
    console.log(JSON.stringify(this.quotationForm.value));
    this._srrService
      .insertSRR(JSON.stringify(this.quotationForm.value))
      .subscribe((res) => {
        alert(res.responseMessage);
      });
  }

  getRandomNumber(pol, pod) {
    var num = Math.floor(Math.random() * 1e16).toString();
    return pol + '-' + pod + '-' + num;
  }
}
