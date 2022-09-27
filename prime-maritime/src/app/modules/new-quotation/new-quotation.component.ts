import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  containersizeList: any[] = [];
  servicemodeList: any[] = [];
  quotationForm: FormGroup;
  containerForm: FormGroup;
  commoditiesForm: FormGroup;
  ratesForm: FormGroup;
  tabActive: string = 'SRR';
  commodityList: any[] = [];
  rateList: any[] = [];
  submitted: boolean = false;
  submitted1: boolean = false;
  submitted2: boolean = false;
  submitted3: boolean = false;
  commodityType: string = '';
  fileList: File[] = [];

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
    private _srrService: SrrService,
    private FormBuilder: FormBuilder,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.getQuotationForm();
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

  getQuotationForm() {
    this.quotationForm = this.FormBuilder.group({
      SRR_NO: [''],
      POL: ['', Validators.required],
      POD: ['', Validators.required],
      ORIGIN_ICD: ['', Validators.required],
      DESTINATION_ICD: ['', Validators.required],
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
      CONSIGNEE: ['', Validators.required],
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
  }

  getContainerForm() {
    this.containerForm = this.FormBuilder.group({
      PLACE_OF_RECEIPT: [''],
      PLACE_OF_DELIVERY: [''],
      TSP_1: [''],
      TSP_2: [''],
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

  onAddCommodities() {
    this.submitted2 = true;
    debugger;
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

    var commodities = this.quotationForm.get('SRR_COMMODITIES') as FormArray;
    commodities.push(this.commoditiesForm);
    this.commodityList.push(this.commoditiesForm.value);

    this.commoditiesForm.reset();
    this.submitted2 = false;
  }

  onAddRates() {
    debugger;
    this.submitted3 = true;

    if (this.ratesForm.invalid) {
      return;
    }

    var rates = this.quotationForm.get('SRR_RATES') as FormArray;
    rates.push(this.ratesForm);
    this.rateList.push(this.ratesForm.value);
  }

  activeTabs(tab) {
    // if (tab == 'Container') {
    //   if (this.quotationForm.invalid) {
    //     alert('Please complete SRR Details');
    //     this.tabActive = 'SRR';
    //   } else {
    //     this.tabActive = tab;
    //   }
    // } else if (tab == 'Commodities') {
    //   if (this.quotationForm.invalid) {
    //     alert('Please complete SRR Details');
    //     this.tabActive = 'SRR';
    //   } else if (this.containerForm.invalid) {
    //     alert('Please complete add Container');
    //     this.tabActive = 'Container';
    //   } else {
    //     this.tabActive = tab;
    //   }
    // } else {
    //   this.tabActive = tab;
    // }

    this.tabActive = tab;
  }

  insertQuotation() {
    var POL = this.quotationForm.value.POL;
    var POD = this.quotationForm.value.POD;

    this.quotationForm.get('SRR_NO')?.setValue(this.getRandomNumber(POL, POD));
    console.log(JSON.stringify(this.quotationForm.value));
    this._srrService
      .insertSRR(JSON.stringify(this.quotationForm.value))
      .subscribe((res) => {
        if (res.responseCode == 200) {
          if (this.commodityType == 'HAZ' || this.commodityType == 'FLEXIBAG') {
            this.uploadFilestoDB();
          }
          alert(res.responseMessage);
          this._router.navigateByUrl('home/agent-dashboard');
        }
      });
  }

  getRandomNumber(pol, pod) {
    var num = Math.floor(Math.random() * 1e16).toString();
    return pol + '-' + pod + '-' + num;
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

  onNextSRR() {
    this.submitted = true;

    debugger;
    if (this.quotationForm.invalid) {
      return;
    }

    console.log('Quotation ' + JSON.stringify(this.quotationForm.value));

    this.activeTabs('Container');
  }

  onNextContainers() {
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
    this.activeTabs('Commodities');
  }

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

    this._srrService.uploadFiles(payload).subscribe();
  }

  getAddress(event) {
    this.quotationForm.get('ADDRESS1')?.setValue(event.target.value);
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

  onChangeRatePer(event) {
    var percentage = +event.target.value;
    var sr = +this.ratesForm.get('STANDARD_RATE')?.value;
    var pr = (sr * percentage) / 100;
    var value = sr - pr;
    this.ratesForm.get('RATE_REQUESTED')?.setValue(value);
  }
}
