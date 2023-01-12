import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QUOTATION } from 'src/app/models/quotation';
import { BookingService } from 'src/app/services/booking.service';
import { CommonService } from 'src/app/services/common.service';
import { PartyService } from 'src/app/services/party.service';
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
  submitted2: boolean = false;
  submitted1: boolean = false;
  isContainer: boolean = false;
  containerList: any[] = [];
  icdList: any[] = [];
  containersizeList: any[] = [];
  servicenameList: any[] = [];
  servicenameList1: any[] = [];
  servicetypeList: any[] = [];
  conindex: any = 0;
  polList: any[] = [];
  podList: any[] = [];
  ts1List: any[] = [];
  ts2List: any[] = [];
  customerList: any[] = [];
  slotDetailsForm: FormGroup;
  isVesselVal: boolean = false;
  containerTypeList: any[] = [];
  vesselList: any[] = [];
  voyageList: any[] = [];
  isScroll: boolean = false;
  slotoperatorList: any[] = [];
  voyageForm: FormGroup;
  vesselList1: any[] = [];
  currencyList: any[] = [];
  currencyList1: any[] = [];
  currencyList2: any[] = [];
  portList: any[] = [];
  submitted3: boolean = false;
  isVoyageAdded: boolean = false;
  isLoading: boolean = false;
  imoclassList: any[] = [];
  imoclassNames: string = '';
  unnoList: any[] = [];
  unno: string = '';
  chargecodeList: any[] = [];
  //Customer Popup
  submitted5: boolean = false;
  partyForm: FormGroup;

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

  @ViewChild('RateModal') RateModal: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeBtn3') closeBtn3: ElementRef;
  @ViewChild('RateDetailModal') RateDetailModal: ElementRef;

  @ViewChild('openBtn5') openBtn5: ElementRef;
  @ViewChild('closeBtn5') closeBtn5: ElementRef;

  constructor(
    private _quotationService: QuotationService,
    private _partyService: PartyService,
    private _bookingService: BookingService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _router: Router
  ) { }

  ngOnInit(): void {

    this.getForm();
    this.partyForm = this._formBuilder.group({
      CUST_ID: [0],
      CUST_NAME: ['', Validators.required],
      CUST_EMAIL: ['', Validators.required],
      CUST_ADDRESS: ['', Validators.required],
      CUST_TYPE: ['', Validators.required],
      GSTIN: ['', Validators.required],
      AGENT_CODE: [''],
      STATUS: ['', Validators.required]
    });
    this.getDropdown();

    var currentDate = new Date();

    this.currentDate = this._commonService.getcurrentDate(currentDate);
    this.quotationForm.get('EFFECT_FROM')?.setValue(this.currentDate);

    this.getEffectToDate(currentDate, 0);

  }

  //Create Customer
  InsertPartyMaster() {
    debugger;
    this.submitted5 = true;
    this.partyForm.get('AGENT_CODE')?.setValue(localStorage.getItem('usercode'));
    this.partyForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    this.partyForm.get('STATUS')?.setValue(true);
    if (this.partyForm.invalid) {
      return
    }


    console.log(JSON.stringify(this.partyForm.value));
    this._partyService.postParty(JSON.stringify(this.partyForm.value)).subscribe((res: any) => {
      if (res.responseCode == 200) {
        alert('Your record has been submitted successfully !');
        this._commonService
          .getDropdownData('CUSTOMER_NAME')
          .subscribe((res: any) => {
            if (res.hasOwnProperty('Data')) {
              this.customerList = res.Data;
            }
          });
        this.closeBtn5.nativeElement.click();
        //this.ClearForm()
      }
    });
  }

  CancelPartyMaster() {
    this.partyForm.get('CUST_NAME')?.setValue("");
    this.partyForm.get('CUST_EMAIL')?.setValue("");
    this.partyForm.get('CUST_ADDRESS')?.setValue("");
    this.partyForm.get('CUST_TYPE')?.setValue("");
    this.partyForm.get('GSTIN')?.setValue("");
    this.partyForm.get('AGENT_CODE')?.setValue("");
    this.partyForm.get('CREATED_BY')?.setValue("");

  }

  get fcp() {
    return this.partyForm.controls;

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
    if (index == '2') {
      if (this.quotationForm.invalid) {
        alert('Please complete SRR Details');
        this.tabs = '1';
      } else {
        this.tabs = index;
      }
    } else if (index == '3') {
      if (this.quotationForm.invalid) {
        alert('Please complete SRR Details');
        this.tabs = '1';
      } else if (this.f7.length == 0) {
        alert('Please complete Commodity Details');
        this.tabs = '2';
      } else {
        this.tabs = index;
      }
    } else {
      this.tabs = index;
    }
    // this.tabs=index;
  }

  onchangeIMO(event: any) {
    var x: any = this.imoclassList.filter((x) => x.CODE == event);
    this.commoditiesForm.value.IMO_CLASS_NAME = x[0].CODE_DESC;
  }

  onchangeUN(event: any) {
    var x: any = this.unnoList.filter((x) => x.CODE == event);
    this.commoditiesForm.value.UN_NO_NAME = x[0].CODE_DESC;
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
      this.commoditiesForm.get('VENTILATION')?.disable();
      this.commoditiesForm.get('HUMIDITY')?.disable();
      this.commoditiesForm.get('TEMPERATURE')?.disable();
      this.commoditiesForm.get('LENGTH')?.disable();
      this.commoditiesForm.get('WIDTH')?.disable();
      this.commoditiesForm.get('HEIGHT')?.disable();
    } else if (this.commodityType == 'HAZ') {
      this.commoditiesForm.get('FLASH_POINT')?.disable();
      this.commoditiesForm.get('CAS_NO')?.disable();
      this.commoditiesForm.get('VENTILATION')?.disable();
      this.commoditiesForm.get('HUMIDITY')?.disable();
      this.commoditiesForm.get('TEMPERATURE')?.disable();
      this.commoditiesForm.get('LENGTH')?.disable();
      this.commoditiesForm.get('WIDTH')?.disable();
      this.commoditiesForm.get('HEIGHT')?.disable();
    } else if (this.commodityType == 'FLEXIBAG') {
      this.commoditiesForm.get('IMO_CLASS')?.disable();
      this.commoditiesForm.get('UN_NO')?.disable();
      this.commoditiesForm.get('HAZ_APPROVAL_REF')?.disable();
      this.commoditiesForm.get('VENTILATION')?.disable();
      this.commoditiesForm.get('HUMIDITY')?.disable();
      this.commoditiesForm.get('TEMPERATURE')?.disable();
      this.commoditiesForm.get('LENGTH')?.disable();
      this.commoditiesForm.get('WIDTH')?.disable();
      this.commoditiesForm.get('HEIGHT')?.disable();
    } else if (this.commodityType == 'REEFER') {
      this.commoditiesForm.get('IMO_CLASS')?.disable();
      this.commoditiesForm.get('UN_NO')?.disable();
      this.commoditiesForm.get('HAZ_APPROVAL_REF')?.disable();
      this.commoditiesForm.get('FLASH_POINT')?.disable();
      this.commoditiesForm.get('CAS_NO')?.disable();
      this.commoditiesForm.get('LENGTH')?.disable();
      this.commoditiesForm.get('WIDTH')?.disable();
      this.commoditiesForm.get('HEIGHT')?.disable();
    } else if (this.commodityType == 'SP') {
      this.commoditiesForm.get('IMO_CLASS')?.disable();
      this.commoditiesForm.get('UN_NO')?.disable();
      this.commoditiesForm.get('HAZ_APPROVAL_REF')?.disable();
      this.commoditiesForm.get('FLASH_POINT')?.disable();
      this.commoditiesForm.get('CAS_NO')?.disable();
      this.commoditiesForm.get('VENTILATION')?.disable();
      this.commoditiesForm.get('HUMIDITY')?.disable();
      this.commoditiesForm.get('TEMPERATURE')?.disable();
    }

    if (this.commoditiesForm.invalid) {
      return;
    }

    var commodities = this.quotationForm.get('SRR_COMMODITIES') as FormArray;

    debugger;
    commodities.push(
      this._formBuilder.group({
        COMMODITY_NAME: [this.commoditiesForm.value.COMMODITY_NAME],
        LENGTH: [
          this.commoditiesForm.value.LENGTH == undefined
            ? 0
            : +this.commoditiesForm.value.LENGTH,
        ],
        WIDTH: [
          this.commoditiesForm.value.WIDTH == undefined
            ? 0
            : +this.commoditiesForm.value.WIDTH,
        ],
        HEIGHT: [
          this.commoditiesForm.value.HEIGHT == undefined
            ? 0
            : +this.commoditiesForm.value.HEIGHT,
        ],

        WEIGHT: [this.commoditiesForm.value.WEIGHT],
        WEIGHT_UNIT: [this.commoditiesForm.value.WEIGHT_UNIT],
        COMMODITY_TYPE: [this.commoditiesForm.value.COMMODITY_TYPE],
        IMO_CLASS: [this.commoditiesForm.value.IMO_CLASS],
        UN_NO: [this.commoditiesForm.value.UN_NO],
        HAZ_APPROVAL_REF: [this.commoditiesForm.value.HAZ_APPROVAL_REF],
        FLASH_POINT: [this.commoditiesForm.value.FLASH_POINT],
        CAS_NO: [this.commoditiesForm.value.CAS_NO],
        VENTILATION: [
          this.commoditiesForm.value.VENTILATION == undefined
            ? 0
            : +this.commoditiesForm.value.VENTILATION,
        ],
        HUMIDITY: [
          this.commoditiesForm.value.HUMIDITY == undefined
            ? 0
            : +this.commoditiesForm.value.HUMIDITY,
        ],
        TEMPERATURE: [
          this.commoditiesForm.value.TEMPERATURE == undefined
            ? 0
            : +this.commoditiesForm.value.TEMPERATURE,
        ],
        REMARKS: [this.commoditiesForm.value.REMARKS],
      })
    );

    this.f7;
    this.commoditiesForm.reset();
    this.submitted2 = false;
  }

  saveCommodity() {
    this.onchangeTab('3');
  }

  openCustModal() {
    this.submitted5 = true;
    this.partyForm.reset();
    var element = document.getElementById("openmymodal") as HTMLElement;
    element.click();
    //this.openBtn5.nativeElement.click();
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
        STANDARD_RATE: ['0'],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: [''],
      })
    );

    this.chargecodeList = [];
    this._commonService
      .getDropdownData(
        'CHARGE_CODE',
        this.quotationForm.get('POL')?.value,
        this.quotationForm.get('POD')?.value,
        this.containerForm.get('IMM_VOLUME_EXPECTED')?.value
      )
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.chargecodeList = res.Data;
        }
      });

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
        STANDARD_RATE: ['0'],
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
      Container: this.containerForm.value.CONTAINER_TYPE,
      ServiceMode: this.containerForm.value.SERVICE_MODE,
    });

    var containers = this.quotationForm.get('SRR_CONTAINERS') as FormArray;
    containers.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [this.containerForm.value.CONTAINER_TYPE],
        CONTAINER_SIZE: [0],
        SERVICE_MODE: [this.containerForm.value.SERVICE_MODE],
        POD_FREE_DAYS: [this.containerForm.value.POD_FREE_DAYS],
        POL_FREE_DAYS: [this.containerForm.value.POL_FREE_DAYS],
        IMM_VOLUME_EXPECTED: [this.containerForm.value.IMM_VOLUME_EXPECTED],
        TOTAL_VOLUME_EXPECTED: [this.containerForm.value.TOTAL_VOLUME_EXPECTED],
      })
    );

    this.containerForm.reset();
    this.containerForm.get('CONTAINER_SIZE')?.setValue('NULL');
    this.containerForm.get('CONTAINER_TYPE')?.setValue('');
    this.containerForm.get('SERVICE_MODE')?.setValue('');

    this.isContainer = true;
    this.closeBtn.nativeElement.click();
  }

  saveContainer() {
    debugger
    this.isLoading = true;
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
      this.quotationForm.get('IS_VESSELVALIDITY')?.setValue(true);
    }

    console.log("Form" + JSON.stringify(this.quotationForm.value));

    this._quotationService
      .insertSRR(JSON.stringify(this.quotationForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          if (
            this.commodityType == 'HAZ' ||
            this.commodityType == 'FLEXIBAG' ||
            this.commodityType == 'SP'
          ) {
            this.uploadFilestoDB(SRRNO);
          }

          if (this.isVesselVal) {
            this.isLoading = true;
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
                  this.isLoading = false;
                  alert('Your quotation has been submitted successfully !');
                  this._router.navigateByUrl('/home/quotation-list');
                }
              });
          } else {
            this.isLoading = false;
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

  insertVoyage() {
    this.submitted3 = true;

    if (this.voyageForm.invalid) {
      return;
    }

    this.voyageForm
      .get('CREATED_BY')
      ?.setValue(localStorage.getItem('username'));

    this._bookingService
      .insertVoyage(JSON.stringify(this.voyageForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Voyage added successfully !');
          this.slotDetailsForm
            .get('VOYAGE_NO')
            ?.setValue(this.voyageForm.get('VOYAGE_NO')?.value);
          this.slotDetailsForm
            .get('VESSEL_NAME')
            ?.setValue(this.voyageForm.get('VESSEL_NAME')?.value);

          this.isVoyageAdded = true;
          this.closeBtn3.nativeElement.click();
        }
      });
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
      IS_VESSELVALIDITY: [false],
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
      CONTAINER_SIZE: ['NULL', Validators.required],
      SERVICE_MODE: ['', Validators.required],
      POD_FREE_DAYS: ['', Validators.required],
      POL_FREE_DAYS: ['', Validators.required],
      IMM_VOLUME_EXPECTED: ['', Validators.required],
      TOTAL_VOLUME_EXPECTED: ['', Validators.required],
    });

    this.commoditiesForm = this._formBuilder.group({
      COMMODITY_NAME: ['', Validators.required],
      LENGTH: ['', Validators.required],
      WIDTH: ['', Validators.required],
      HEIGHT: ['', Validators.required],
      WEIGHT: ['', Validators.required],
      WEIGHT_UNIT: ['', Validators.required],
      COMMODITY_TYPE: ['', Validators.required],
      IMO_CLASS: ['', Validators.required],
      IMO_CLASS_NAME: [''],
      UN_NO: ['', Validators.required],
      UN_NO_NAME: [''],
      HAZ_APPROVAL_REF: ['', Validators.required],
      FLASH_POINT: ['', Validators.required],
      CAS_NO: ['', Validators.required],
      VENTILATION: ['', Validators.required],
      HUMIDITY: ['', Validators.required],
      TEMPERATURE: ['', Validators.required],
      REMARKS: [''],
    });

    this.slotDetailsForm = this._formBuilder.group({
      BOOKING_NO: [''],
      SRR_ID: [''],
      SRR_NO: [''],
      VESSEL_NAME: ['', Validators.required],
      VOYAGE_NO: ['', Validators.required],
      MOTHER_VESSEL_NAME: [''],
      MOTHER_VOYAGE_NO: [''],
      AGENT_CODE: [''],
      AGENT_NAME: [''],
      STATUS: [''],
      CREATED_BY: [''],
      SLOT_LIST: new FormArray([]),
    });

    this.voyageForm = this._formBuilder.group({
      VESSEL_NAME: ['', Validators.required],
      VOYAGE_NO: ['', Validators.required],
      ATA: ['', Validators.required],
      ATD: ['', Validators.required],
      IMM_CURR: ['', Validators.required],
      IMM_CURR_RATE: ['', Validators.required],
      EXP_CURR: ['', Validators.required],
      EXP_CURR_RATE: ['', Validators.required],
      TERMINAL_CODE: ['', Validators.required],
      SERVICE_NAME: ['', Validators.required],
      VIA_NO: ['', Validators.required],
      PORT_CODE: ['', Validators.required],
      ETA: ['', Validators.required],
      ETD: ['', Validators.required],
      CREATED_BY: [''],
    });
  }

  getEffectToDate(e: any, param: any) {
    let x = new Date(param == 0 ? e : e.target.value);

    var newDate = new Date();
    newDate.setDate(x.getDate() + 15);

    this.effectToDate = this._commonService.getcurrentDate(newDate);
    this.quotationForm.get('EFFECT_TO')?.setValue(this.effectToDate);
  }

  getDropdown() {
    this._commonService.getDropdownData('PORT').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.portList = res.Data;
      }
    });

    this._commonService.getDropdownData('ICD').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.icdList = res.Data;
      }
    });

    this._commonService
      .getDropdownData('CONTAINER_TYPE')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.containerTypeList = res.Data;
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
      .getDropdownData('SERVICE_TYPE')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.servicetypeList = res.Data;
        }
      });

    this._commonService
      .getDropdownData('CUSTOMER_NAME')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.customerList = res.Data;
        }
      });

    this._commonService.getDropdownData('VESSEL_NAME').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.vesselList = res.Data;
        this.vesselList1 = res.Data;
      }
    });

    this._commonService
      .getDropdownData('SLOT_OPERATOR')
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.slotoperatorList = res.Data;
        }
      });

    this._commonService.getDropdownData('CURRENCY').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.currencyList = res.Data;
        this.currencyList1 = res.Data;
        this.currencyList2 = res.Data;
      }
    });

    this._commonService.getDropdownData('IMO_CLASS').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.imoclassList = res.Data;
      }
    });

    this._commonService.getDropdownData('UN_NO').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.unnoList = res.Data;
      }
    });
  }

  getServiceName(event: any) {
    this.servicenameList = [];
    this.quotationForm.get('SERVICE_NAME')?.setValue('');
    this._commonService
      .getDropdownData('SERVICE_NAME', event, '')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.servicenameList = res.Data;
        }
      });
  }

  getServiceName1(event: any) {
    this.servicenameList1 = [];
    this.slotDetailsForm.get('SERVICE_NAME')?.setValue('');
    this._commonService
      .getDropdownData('SERVICE_NAME', event, '')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.servicenameList1 = res.Data;
        }
      });
  }

  getVoyageList(event: any) {
    this.slotDetailsForm.get('VOYAGE_NO')?.setValue('');
    this.voyageList = [];
    this._commonService
      .getDropdownData('VOYAGE_NO', '', event)
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.voyageList = res.Data;
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

  get f5() {
    return this.slotDetailsForm.controls;
  }

  get f6() {
    return this.voyageForm.controls;
  }

  get f7() {
    var s = this.quotationForm.get('SRR_COMMODITIES') as FormArray;
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

  slotAllocation() {
    var slotDetails = this.slotDetailsForm.get('SLOT_LIST') as FormArray;

    slotDetails.push(
      this._formBuilder.group({
        SLOT_OPERATOR: [''],
        NO_OF_SLOTS: [''],
      })
    );

    if (slotDetails.length > 2) {
      this.isScroll = true;
    }
  }

  removeItem(i: any) {
    const add = this.slotDetailsForm.get('SLOT_LIST') as FormArray;
    add.removeAt(i);
  }

  // FILE UPLOAD

  fileUpload(event: any, value: string, commodityType: string) {
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

    this.fileList.push({
      "FILE": event.target.files[0],
      "COMMODITY_TYPE": commodityType
    });

    console.log('File List' + JSON.stringify(this.fileList));

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

  uploadFilestoDB(SRRNO: string) {
    const payload = new FormData();
    this.fileList.forEach((element: any) => {
      payload.append('FILE', element.FILE);
      payload.append('COMMODITY_TYPE', element.COMMODITY_TYPE);
    });

    console.log("payload" + JSON.stringify(payload))
    this._quotationService.uploadFiles(payload, SRRNO).subscribe();
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

  getRate(event: any, i: number) {
    var srr = new QUOTATION();
    srr.POL = this.quotationForm.get('POL')?.value;
    srr.POD = this.quotationForm.get('POD')?.value;
    srr.CHARGE = event;
    srr.CONTAINER_TYPE = this.containerForm.get('CONTAINER_TYPE')?.value;

    const add = this.quotationForm.get('SRR_RATES1') as FormArray;

    this._quotationService.getRate(srr).subscribe((res: any) => {
      add.controls[i].get('STANDARD_RATE')?.setValue('');
      add.controls[i].get('STANDARD_RATE')?.setValue(res.Data);
    });
  }
}
