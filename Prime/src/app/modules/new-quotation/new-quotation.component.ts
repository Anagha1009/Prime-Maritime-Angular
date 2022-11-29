import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { QuotationService } from 'src/app/services/quotation.service';

@Component({
  selector: 'app-new-quotation',
  templateUrl: './new-quotation.component.html',
  styleUrls: ['./new-quotation.component.scss'],
})
export class NewQuotationComponent implements OnInit {
  tabs: string = '1';
  currentDate: string = '';
  effectToDate: string = '';
  submitted: boolean = false;
  quotationForm: FormGroup;
  containerForm: FormGroup;
  commoditiesForm: FormGroup;
  commodityType: string = '';
  commodityList: any[] = [];
  submitted2: boolean = false;
  submitted1: boolean = false;
  isContainer: boolean = false;
  containerList: any[] = [];
  portList: any[] = [];
  icdList: any[] = [];
  containersizeList: any[] = [];
  servicemodeList: any[] = [];
  servicetypeList: any[] = [];
  conindex: any = 0;

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

  isUploadedTS: boolean = false;
  TSAcceptanceFile: string = '';

  isUploadedVslOpAp2: boolean = false;
  VslOpAp2AcceptanceFile: string = '';

  isUploadedSur: boolean = false;
  SurAcceptanceFile: string = '';
  fileList: any[] = [];
  isTranshipment: boolean = false;

  slotDetailsForm: FormGroup;

  @ViewChild('RateModal') RateModal: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('RateDetailModal') RateDetailModal: ElementRef;
  isVesselVal: boolean = false;

  constructor(
    private _quotationService: QuotationService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.getForm();
    this.getDropdown();

    var currentDate = new Date();

    this.currentDate = this.getcurrentDate(currentDate);
    this.quotationForm.get('EFFECT_FROM')?.setValue(this.currentDate);

    this.getEffectToDate(currentDate, 0);
  }

  // ON CHANGE

  onChangeCommodityType(event: any) {
    this.commodityType = event;

    if (this.commodityType == 'HAZ') {
      this.commoditiesForm.get('FLASH_POINT')?.disable();
      this.commoditiesForm.get('CAS_NO')?.disable();

      this.commoditiesForm.get('IMO_CLASS')?.enable();
      this.commoditiesForm.get('UN_NO')?.enable();
      this.commoditiesForm.get('HAZ_APPROVAL_REF')?.enable();
    }

    if (this.commodityType == 'FLEXIBAG') {
      this.commoditiesForm.get('IMO_CLASS')?.disable();
      this.commoditiesForm.get('UN_NO')?.disable();
      this.commoditiesForm.get('HAZ_APPROVAL_REF')?.disable();

      this.commoditiesForm.get('FLASH_POINT')?.enable();
      this.commoditiesForm.get('CAS_NO')?.enable();
    }

    this.commoditiesForm.get('REMARKS')?.setValue('');
    this.commoditiesForm.get('WEIGHT')?.setValue('');
  }

  onchangeTab(index: any) {
    this.tabs = index;
  }

  // ON SAVE

  saveQuotation() {
    this.submitted = true;

    if (this.quotationForm.invalid) {
      return;
    }

    this.onchangeTab('2');
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

    var weight = this.commoditiesForm.get('WEIGHT')?.value;
    this.commoditiesForm.get('WEIGHT')?.setValue(weight == '' ? 0 : +weight);

    var commodities = this.quotationForm.get('SRR_COMMODITIES') as FormArray;
    commodities.push(this.commoditiesForm);
    this.commodityList.push(this.commoditiesForm.value);

    // this.commoditiesForm.reset();
    this.submitted2 = false;
  }

  saveCommodity() {
    this.onchangeTab('3');
  }

  openModal() {
    this.submitted1 = true;

    if (this.containerForm.invalid) {
      return;
    }

    var rateList = this.quotationForm.get('SRR_RATES1') as FormArray;

    rateList.clear();

    var ct = this.containerForm.value.CONTAINER_TYPE;

    rateList.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [ct],
        CHARGE_CODE: [''],
        CURRENCY: ['USD'],
        STANDARD_RATE: ['100'],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: ['NULL'],
      })
    );

    this.RateModal.nativeElement.click();

    this.submitted1 = false;
  }

  addRates() {
    var rateList = this.quotationForm.get('SRR_RATES1') as FormArray;

    var ct = this.containerForm.value.CONTAINER_TYPE;

    rateList.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [ct],
        CHARGE_CODE: [''],
        CURRENCY: ['USD'],
        STANDARD_RATE: ['100'],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: ['NULL'],
      })
    );
  }

  submitRate() {
    const add = this.quotationForm.get('SRR_RATES1') as FormArray;
    const add1 = this.quotationForm.get('SRR_RATES') as FormArray;

    add.controls.forEach((control) => {
      add1.push(control);
    });

    this.containerList.push({
      Container:
        this.containerForm.value.CONTAINER_TYPE +
        '-' +
        this.containerForm.value.CONTAINER_SIZE,
      ServiceMode: this.containerForm.value.SERVICE_MODE,
    });

    var containers = this.quotationForm.get('SRR_CONTAINERS') as FormArray;
    containers.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [this.containerForm.value.CONTAINER_TYPE],
        CONTAINER_SIZE: [this.containerForm.value.CONTAINER_SIZE],
        SERVICE_MODE: [this.containerForm.value.SERVICE_MODE],
        POD_FREE_DAYS: [this.containerForm.value.POD_FREE_DAYS],
        POL_FREE_DAYS: [this.containerForm.value.POL_FREE_DAYS],
        IMM_VOLUME_EXPECTED: [this.containerForm.value.IMM_VOLUME_EXPECTED],
        TOTAL_VOLUME_EXPECTED: [this.containerForm.value.TOTAL_VOLUME_EXPECTED],
      })
    );

    this.containerForm.reset();
    this.containerForm.get('CONTAINER_TYPE')?.setValue('');
    this.containerForm.get('CONTAINER_SIZE')?.setValue('');
    this.containerForm.get('SERVICE_MODE')?.setValue('');

    this.isContainer = true;
    this.closeBtn.nativeElement.click();
  }

  saveContainer() {
    var POL = this.quotationForm.value.POL;
    var POD = this.quotationForm.value.POD;
    var SRRNO = this.getRandomNumber(POL, POD);

    this.quotationForm.get('SRR_NO')?.setValue(SRRNO);

    this.quotationForm
      .get('CREATED_BY')
      ?.setValue(localStorage.getItem('username'));
    this.quotationForm
      .get('AGENT_NAME')
      ?.setValue(localStorage.getItem('username'));
    this.quotationForm
      .get('AGENT_CODE')
      ?.setValue(localStorage.getItem('usercode'));

    if (this.isVesselVal) {
      this.quotationForm.get('EFFECT_FROM')?.setValue('');
      this.quotationForm.get('EFFECT_TO')?.setValue('');
    }

    console.log(JSON.stringify(this.quotationForm.value));
    this._quotationService
      .insertSRR(JSON.stringify(this.quotationForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          if (
            this.commodityType == 'HAZ' ||
            this.commodityType == 'FLEXIBAG' ||
            this.commodityType == 'SP'
          ) {
            this.uploadFilestoDB();
          }

          if (this.isVesselVal) {
            this.slotDetailsForm
              .get('BOOKING_NO')
              ?.setValue(this.getRandomBookingNumber());
            this.slotDetailsForm.get('SRR_ID')?.setValue(res.data);
            this.slotDetailsForm.get('SRR_NO')?.setValue(SRRNO);
            this.slotDetailsForm.get('STATUS')?.setValue('Booked');
            this.slotDetailsForm
              .get('CREATED_BY')
              ?.setValue(localStorage.getItem('username'));
            this.slotDetailsForm
              .get('AGENT_NAME')
              ?.setValue(localStorage.getItem('username'));
            this.slotDetailsForm
              .get('AGENT_CODE')
              ?.setValue(localStorage.getItem('usercode'));

            console.log(JSON.stringify(this.slotDetailsForm.value));

            this._quotationService
              .booking(JSON.stringify(this.slotDetailsForm.value))
              .subscribe((res: any) => {
                if (res.responseCode == 200) {
                  alert('Your quotation has been submitted successfully !');
                  this._router.navigateByUrl('/home/quotation-list');
                }
              });
          } else {
            alert('Your quotation has been submitted successfully !');
            this._router.navigateByUrl('/home/quotation-list');
          }
        }
      });
  }

  openRateDetailModal(i: any) {
    this.conindex = i;
    this.RateDetailModal.nativeElement.click();
  }

  // GET DATA

  getForm() {
    this.quotationForm = this._formBuilder.group({
      SRR_NO: [''],
      POL: ['', Validators.required],
      POD: ['', Validators.required],
      FINAL_DESTINATION: ['', Validators.required],
      SERVICE_NAME: ['', Validators.required],
      EFFECT_FROM: ['', Validators.required],
      EFFECT_TO: ['', Validators.required],
      // MTY_REPO: [false],
      CUSTOMER_NAME: ['', Validators.required],
      // ADDRESS: ['', Validators.required],
      // ADDRESS1: [''],
      // EMAIL: [
      //   '',
      //   [
      //     Validators.required,
      //     Validators.pattern(
      //       '^[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,})$'
      //     ),
      //   ],
      // ],
      // CONTACT: ['', Validators.required],
      // SHIPPER: [
      //   '',
      //   [Validators.required, Validators.pattern('^[A-Za-z0-9? , _-]+$')],
      // ],
      // NOTIFY_PARTY: ['', Validators.pattern('^[A-Za-z0-9? , _-]+$')],
      // OTHER_PARTY: [''],
      // OTHER_PARTY_NAME: [''],
      PLACE_OF_RECEIPT: ['', Validators.pattern('^[A-Za-z0-9? , _-]+$')],
      PLACE_OF_DELIVERY: ['', Validators.pattern('^[A-Za-z0-9? , _-]+$')],
      TSP_1: [''],
      TSP_2: [''],
      CREATED_BY: [''],
      AGENT_NAME: [''],
      AGENT_CODE: [''],
      STATUS: ['Requested'],
      SRR_CONTAINERS: new FormArray([]),
      SRR_COMMODITIES: new FormArray([]),
      SRR_RATES: new FormArray([]),
      SRR_RATES1: new FormArray([]),
    });

    this.containerForm = this._formBuilder.group({
      CONTAINER_TYPE: ['', Validators.required],
      CONTAINER_SIZE: ['', Validators.required],
      SERVICE_MODE: ['', Validators.required],
      POD_FREE_DAYS: ['', Validators.required],
      POL_FREE_DAYS: ['', Validators.required],
      IMM_VOLUME_EXPECTED: ['', Validators.required],
      TOTAL_VOLUME_EXPECTED: ['', Validators.required],
    });

    this.commoditiesForm = this._formBuilder.group({
      COMMODITY_NAME: ['', Validators.required],
      LENGTH: [''],
      WIDTH: [''],
      HEIGHT: [''],
      WEIGHT: ['', Validators.required],
      COMMODITY_TYPE: ['', Validators.required],
      IMO_CLASS: ['', Validators.required],
      UN_NO: ['', Validators.required],
      HAZ_APPROVAL_REF: ['', Validators.required],
      FLASH_POINT: ['', Validators.required],
      CAS_NO: ['', Validators.required],
      REMARKS: ['', Validators.required],
    });

    this.slotDetailsForm = this._formBuilder.group({
      BOOKING_NO: [''],
      SRR_ID: [''],
      SRR_NO: [''],
      VESSEL_NAME: [''],
      VOYAGE_NO: [''],
      MOTHER_VESSEL_NAME: [''],
      MOTHER_VOYAGE_NO: [''],
      AGENT_CODE: [''],
      AGENT_NAME: [''],
      STATUS: [''],
      CREATED_BY: [''],
      SLOT_LIST: new FormArray([]),
    });
  }

  getcurrentDate(date: any) {
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

  getEffectToDate(e: any, param: any) {
    let x = new Date(param == 0 ? e : e.target.value);

    var newDate = new Date();
    newDate.setDate(x.getDate() + 15);

    this.effectToDate = this.getcurrentDate(newDate);
    this.quotationForm.get('EFFECT_TO')?.setValue(this.effectToDate);
  }

  getDropdown() {
    this._commonService.getDropdownData('PORT').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.portList = res.Data;
      }
    });

    this._commonService.getDropdownData('ICD').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.icdList = res.Data;
      }
    });

    this._commonService
      .getDropdownData('CONTAINER_SIZE')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.containersizeList = res.Data;
        }
      });

    this._commonService
      .getDropdownData('SERVICE_MODE')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.servicemodeList = res.Data;
        }
      });

    this._commonService
      .getDropdownData('SERVICE_TYPE')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.servicetypeList = res.Data;
        }
      });
  }

  getRandomNumber(pol: string, pod: string) {
    var num = Math.floor(Math.random() * 1e16).toString();
    return pol + '-' + pod + '-' + num;
  }

  getRandomBookingNumber() {
    var num = Math.floor(Math.random() * 1e16).toString();
    return 'BK' + num;
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
    var s = this.quotationForm.get('SRR_RATES1') as FormArray;
    return s.controls;
  }

  f4(i: any) {
    return i;
  }

  // getAddress(e: any) {
  //   this.quotationForm.get('ADDRESS1')?.setValue(e);
  // }

  numericOnly(event: any): boolean {
    // restrict e,+,-,E characters in  input type number
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode == 101 || charCode == 69 || charCode == 45 || charCode == 43) {
      return false;
    }
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
    return true;
  }

  // FILE UPLOAD

  fileUpload(event: any, value: string) {
    if (
      event.target.files[0].type == 'application/pdf' ||
      event.target.files[0].type ==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      event.target.files[0].type ==
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      event.target.files[0].type == 'application/xls' ||
      event.target.files[0].type == 'application/xlsx' ||
      event.target.files[0].type == 'application/doc'
    ) {
    } else {
      alert('Please Select PDF or Excel or Word Format only');
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

    if (value == 'TS') {
      this.isUploadedTS = true;
      this.TSAcceptanceFile = event.target.files[0].name;
    }

    if (value == 'VslOpAp2') {
      this.isUploadedVslOpAp2 = true;
      this.VslOpAp2AcceptanceFile = event.target.files[0].name;
    }

    if (value == 'Sur') {
      this.isUploadedSur = true;
      this.SurAcceptanceFile = event.target.files[0].name;
    }
  }

  uploadFilestoDB() {
    const payload = new FormData();
    this.fileList.forEach((element: any) => {
      payload.append('formFile', element);
    });

    //this._srrService.uploadFiles(payload).subscribe();
  }

  isVesselValidity(e: any) {
    var slotDetails = this.slotDetailsForm.get('SLOT_LIST') as FormArray;

    if (e.target.checked) {
      slotDetails.clear();

      slotDetails.push(
        this._formBuilder.group({
          SLOT_OPERATOR: [''],
          NO_OF_SLOTS: [''],
        })
      );

      this.quotationForm.get('EFFECT_FROM')?.disable();
      this.quotationForm.get('EFFECT_TO')?.disable();
      this.isVesselVal = true;
    } else {
      slotDetails.clear();
      this.isVesselVal = false;
      this.quotationForm.get('EFFECT_FROM')?.enable();
      this.quotationForm.get('EFFECT_TO')?.enable();
    }
  }

  get s() {
    var x = this.slotDetailsForm.get('SLOT_LIST') as FormArray;
    return x.controls;
  }

  s1(i: any) {
    return i;
  }
}
