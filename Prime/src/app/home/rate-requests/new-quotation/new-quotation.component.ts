import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import { QUOTATION } from 'src/app/models/quotation';
import { BookingService } from 'src/app/services/booking.service';
import { CommonService } from 'src/app/services/common.service';
import { PartyService } from 'src/app/services/party.service';
import { QuotationService } from 'src/app/services/quotation.service';
import { locale as english } from 'src/app/@core/translate/quotation/en';
import { locale as hindi } from 'src/app/@core/translate/quotation/hi';
import { locale as arabic } from 'src/app/@core/translate/quotation/ar';

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
  disabledcommodityType: any[] = [];
  submitted2: boolean = false;
  submitted1: boolean = false;
  isContainer: boolean = false;
  containerList: any[] = [];
  placeofRecpList: any[] = [];
  placeofDelList: any[] = [];
  finalDestList: any[] = [];
  containersizeList: any[] = [];
  servicenameList: any[] = [];
  servicenameList1: any[] = [];
  servicetypeList: any[] = [];
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
  polList: any[] = [];
  podList: any[] = [];
  submitted3: boolean = false;
  isVoyageAdded: boolean = false;
  isLoading: boolean = false;
  imoclassList: any[] = [];
  imoclassNames: string = '';
  unnoList: any[] = [];
  unno: string = '';
  chargecodeList: any[] = [];
  terminalList: any[] = [];
  isgeneralcompleted: boolean = false;
  //Customer Popup
  submitted5: boolean = false;
  partyForm: FormGroup;
  maxValue: string;
  isGST: boolean = false;

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
  submiitedRate: boolean = false;
  rateList: any[] = [];
  connIndex: number = 0;
  custTypeList: any[] = [];
  dropdownSettings = {};
  selectedItems: any[] = [];

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
    private _router: Router,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, hindi, arabic);
  }

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'CODE',
      textField: 'CODE_DESC',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 170,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Select Type',
      noDataAvailablePlaceholderText: 'No Records',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    this.getForm();
    this.getDropdown();
    this.getCustTypeDropdown();

    var currentDate = new Date();

    this.currentDate = this._commonService.getcurrentDate(currentDate);
    this.quotationForm.get('EFFECT_FROM')?.setValue(this.currentDate);

    this.getEffectToDate(currentDate, 0);
  }

  //Create Customer
  InsertPartyMaster() {
    this.submitted5 = true;
    this.partyForm
      .get('AGENT_CODE')
      ?.setValue(this._commonService.getUserCode());
    this.partyForm
      .get('CREATED_BY')
      ?.setValue(this._commonService.getUserName());
    this.partyForm.get('STATUS')?.setValue(true);
    const add = this.partyForm.get('CUST_TYPE_CODE') as FormArray;
    var custType = '';
    add.value.forEach((element: any) => {
      custType += element.CODE + ',';
    });
    this.partyForm.get('CUST_TYPE').setValue(custType);
    if (this.partyForm.invalid) {
      return;
    }

    this._partyService
      .postParty(JSON.stringify(this.partyForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been submitted successfully !'
          );
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
    this.partyForm.get('CUST_NAME')?.setValue('');
    this.partyForm.get('CUST_EMAIL')?.setValue('');
    this.partyForm.get('CUST_ADDRESS')?.setValue('');
    this.partyForm.get('CUST_TYPE')?.setValue('');
    this.partyForm.get('GSTIN')?.setValue('');
    this.partyForm.get('AGENT_CODE')?.setValue('');
    this.partyForm.get('CREATED_BY')?.setValue('');
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

    if (this.commodityType == 'REEFER') {
      this.commoditiesForm.get('VENTILATION')?.enable();
      this.commoditiesForm.get('HUMIDITY')?.enable();
      this.commoditiesForm.get('TEMPERATURE')?.enable();
    }

    if (this.commodityType == 'SP') {
      this.commoditiesForm.get('LENGTH')?.enable();
      this.commoditiesForm.get('WIDTH')?.enable();
      this.commoditiesForm.get('HEIGHT')?.enable();
    }

    this.commoditiesForm.get('REMARKS')?.setValue('');
    this.commoditiesForm.get('WEIGHT')?.setValue('');
  }

  onchangeTab(index: any) {
    if (index == '2') {
      if (!this.isgeneralcompleted) {
        alert('Please complete SRR Details');
        this.tabs = '1';
      } else {
        this.tabs = index;
      }
    } else if (index == '3') {
      if (!this.isgeneralcompleted) {
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
    //this.tabs = index;
  }

  onchangeIMO(event: any) {
    var x: any = this.imoclassList.filter((x) => x.CODE == event);
    this.commoditiesForm.get('IMO_CLASS_NAME')?.setValue(x[0].CODE_DESC);
  }

  onchangeUN(event: any) {
    var y: any = this.unnoList.filter((x) => x.CODE_DESC == event);
    this.commoditiesForm.get('UN_NO_NAME')?.setValue(y[0].CODE_DESC);
  }

  // ON SAVE

  saveQuotation() {
    this.submitted = true;

    if (this.quotationForm.invalid) {
      this.isgeneralcompleted = false;
      return;
    }

    if (this.slotDetailsForm.get('SLOT_LIST').invalid) {
      this.isgeneralcompleted = false;
      return;
    }

    this.isgeneralcompleted = true;
    this.onchangeTab('2');
  }

  addCommodity() {
    this.submitted2 = true;

    if (this.commodityType == 'GEN') {
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

    if (this.commodityType == 'HAZ') {
      var y: any = this.unnoList.filter(
        (x) => x.CODE_DESC == this.commoditiesForm.get('UN_NO_NAME').value
      );
      var UN_NO = y[0].CODE;
    }

    var commodities = this.quotationForm.get('SRR_COMMODITIES') as FormArray;
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
        UN_NO: [UN_NO],
        HAZ_APPROVAL_REF: [this.commoditiesForm.value.HAZ_APPROVAL_REF],
        FLASH_POINT: [this.commoditiesForm.value.FLASH_POINT],
        CAS_NO: [this.commoditiesForm.value.CAS_NO],
        VENTILATION: [this.commoditiesForm.value.VENTILATION],
        HUMIDITY: [this.commoditiesForm.value.HUMIDITY],
        TEMPERATURE: [this.commoditiesForm.value.TEMPERATURE],
        REMARKS: [this.commoditiesForm.value.REMARKS],
      })
    );

    this.f7;
    this.disabledcommodityType.push(this.commodityType);
    this.commoditiesForm.reset();
    this.commoditiesForm.get('COMMODITY_TYPE').setValue('');
    this.commodityType = '';
    this.submitted2 = false;
  }

  removeFile(item: any, value: any) {
    this.fileList.splice(
      this.fileList.findIndex((el) => el.FILE.name === item),
      1
    );
    if (value == 'POL') {
      this.isUploadedPOL = false;
    } else if (value == 'POD') {
      this.isUploadedPOD = false;
    } else if (value == 'VslOp') {
      this.isUploadedVslOp = false;
    } else if (value == 'TS') {
      this.isUploadedTS = false;
    } else if (value == 'ShpLOY') {
      this.isUploadedShpLOY = false;
    } else if (value == 'VslOpAp') {
      this.isUploadedVslOp = false;
    } else if (value == 'VslOpAp2') {
      this.isUploadedVslOpAp2 = false;
    } else if (value == 'Sur') {
      this.isUploadedSur = false;
    }
  }

  saveCommodity() {
    this.onchangeTab('3');
  }

  openCustModal() {
    this.submitted5 = true;
    this.partyForm.reset();
    var element = document.getElementById('openmymodal') as HTMLElement;
    element.click();
  }

  openModal() {
    this.submitted1 = true;
    if (this.containerForm.invalid) {
      return;
    }

    var isvalid: boolean = true;
    this.containerList.forEach((element) => {
      if (
        this.containerForm.get('CONTAINER_TYPE')?.value == element.Container
      ) {
        alert('Sorry ! This container type is already selected !');
        isvalid = false;
      }
    });

    if (!isvalid) {
      return;
    }

    this.submiitedRate = false;

    var srr = new QUOTATION();
    srr.POL = this.quotationForm.get('POL')?.value;
    srr.POD = this.quotationForm.get('POD')?.value;
    srr.CONTAINER_TYPE = this.containerForm.value.CONTAINER_TYPE;
    srr.NO_OF_CONTAINERS = this.containerForm.value.IMM_VOLUME_EXPECTED;

    this._quotationService.getSRRRateList(srr).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        const freightcharges = this.quotationForm.get(
          'FREIGHT_CHARGES'
        ) as FormArray;

        freightcharges.clear();
        res.Data.FREIGHTLIST.forEach((element: any) => {
          freightcharges.push(this._formBuilder.group(element));
        });

        const polcharges = this.quotationForm.get('POL_CHARGES') as FormArray;

        polcharges.clear();
        res.Data.EXP_INCOMELIST.forEach((element: any) => {
          polcharges.push(this._formBuilder.group(element));
        });

        res.Data.EXP_OTHERINCOMELIST.forEach((element: any) => {
          polcharges.push(this._formBuilder.group(element));
        });

        const podcharges = this.quotationForm.get('POD_CHARGES') as FormArray;

        podcharges.clear();
        res.Data.IMP_INCOMELIST.forEach((element: any) => {
          podcharges.push(this._formBuilder.group(element));
        });

        res.Data.IMP_OTHERINCOMELIST.forEach((element: any) => {
          podcharges.push(this._formBuilder.group(element));
        });

        freightcharges.controls.forEach(function (element: any, i) {
          Object.keys(element.controls).forEach(function (control: any) {
            freightcharges
              .at(i)
              .get(control)
              .setValidators(Validators.required);
            freightcharges.at(i).get(control).updateValueAndValidity();

            if (control == 'RATE_REQUESTED') {
              var rate = freightcharges.at(i).get('RATE').value;
              freightcharges.at(i).get(control).setValue(rate);
            }

            if (control == 'PAYMENT_TERM') {
              freightcharges.at(i).get(control).setValue('Prepaid');
            }

            if (control == 'TRANSPORT_TYPE') {
              freightcharges.at(i).get(control).setValue('POL');
            }

            if (control == 'AGENT_REMARKS') {
              freightcharges.at(i).get('AGENT_REMARKS').setValidators(null);
              freightcharges
                .at(i)
                .get('AGENT_REMARKS')
                .updateValueAndValidity();
            }
          });
        });

        polcharges.controls.forEach(function (element: any, i) {
          Object.keys(element.controls).forEach(function (control: any) {
            polcharges.at(i).get(control).setValidators(Validators.required);
            polcharges.at(i).get(control).updateValueAndValidity();

            if (control == 'RATE_REQUESTED') {
              var rate = polcharges.at(i).get('RATE').value;
              polcharges.at(i).get(control).setValue(rate);
            }

            if (control == 'PAYMENT_TERM') {
              polcharges.at(i).get(control).setValue('Prepaid');
            }

            if (control == 'TRANSPORT_TYPE') {
              polcharges.at(i).get(control).setValue('POL');
            }

            if (control == 'AGENT_REMARKS') {
              polcharges.at(i).get('AGENT_REMARKS').setValidators(null);
              polcharges.at(i).get('AGENT_REMARKS').updateValueAndValidity();
            }
          });
        });

        podcharges.controls.forEach(function (element: any, i) {
          Object.keys(element.controls).forEach(function (control: any) {
            podcharges.at(i).get(control).setValidators(Validators.required);
            podcharges.at(i).get(control).updateValueAndValidity();

            if (control == 'RATE_REQUESTED') {
              var rate = podcharges.at(i).get('RATE').value;
              podcharges.at(i).get(control).setValue(rate);
            }

            if (control == 'PAYMENT_TERM') {
              podcharges.at(i).get(control).setValue('Collect');
            }

            if (control == 'TRANSPORT_TYPE') {
              podcharges.at(i).get(control).setValue('POD');
            }

            if (control == 'AGENT_REMARKS') {
              podcharges.at(i).get('AGENT_REMARKS').setValidators(null);
              podcharges.at(i).get('AGENT_REMARKS').updateValueAndValidity();
            }
          });
        });
      }
    });

    if (
      Number(this.containerForm.get('IMM_VOLUME_EXPECTED')?.value) >
      Number(this.containerForm.get('TOTAL_VOLUME_EXPECTED')?.value)
    ) {
      alert('Imm. Volume Expected should be less than Total Volume Expected ');
      this.containerForm.get('IMM_VOLUME_EXPECTED')?.setValue('');
      return;
    }

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

  submitRate() {
    this.submiitedRate = true;

    const add1 = this.quotationForm.get('FREIGHT_CHARGES') as FormArray;
    const add2 = this.quotationForm.get('POL_CHARGES') as FormArray;
    const add3 = this.quotationForm.get('POD_CHARGES') as FormArray;

    if (add1.invalid) {
      return;
    } else if (add2.invalid) {
      return;
    } else if (add3.invalid) {
      return;
    }

    this.containerList.push({
      Container: this.containerForm.value.CONTAINER_TYPE,
      ServiceMode: this.containerForm.value.SERVICE_MODE,
      FREIGHTCHARGE_LIST: [add1.value].flat(1),
      POLCHARGE_LIST: [add2.value].flat(1),
      PODCHARGE_LIST: [add3.value].flat(1),
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

  //Disabling selected container type
  getct(value: any) {
    return this.containerList.some((x) => x.Container == value);
  }

  saveContainer() {
    this.isLoading = true;
    var POL = this.quotationForm.value.POL;
    var POD = this.quotationForm.value.POD;
    var SRRNO = this._commonService.getRandomNumber(POL + '-' + POD + '-');

    this.quotationForm.get('SRR_NO')?.setValue(SRRNO);

    this.quotationForm
      .get('CREATED_BY')
      ?.setValue(this._commonService.getUser().role);
    this.quotationForm
      .get('AGENT_NAME')
      ?.setValue(this._commonService.getUserName());
    this.quotationForm
      .get('AGENT_CODE')
      ?.setValue(this._commonService.getUserCode());

    if (this.isVesselVal) {
      this.quotationForm.get('EFFECT_FROM')?.setValue('');
      this.quotationForm.get('EFFECT_TO')?.setValue('');
      this.quotationForm.get('IS_VESSELVALIDITY')?.setValue(true);
    }

    this._quotationService
      .insertSRR(JSON.stringify(this.quotationForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          if (this.isVesselVal) {
            this.isLoading = true;
            this.slotDetailsForm
              .get('BOOKING_NO')
              ?.setValue(this._commonService.getRandomNumber('BK'));
            this.slotDetailsForm.get('SRR_ID')?.setValue(res.data);
            this.slotDetailsForm.get('SRR_NO')?.setValue(SRRNO);
            this.slotDetailsForm.get('STATUS')?.setValue('Booked');
            this.slotDetailsForm
              .get('CREATED_BY')
              ?.setValue(this._commonService.getUser().role);
            this.slotDetailsForm
              .get('AGENT_NAME')
              ?.setValue(this._commonService.getUserName());
            this.slotDetailsForm
              .get('AGENT_CODE')
              ?.setValue(this._commonService.getUserCode());

            this._quotationService
              .booking(JSON.stringify(this.slotDetailsForm.value))
              .subscribe((res: any) => {
                if (res.responseCode == 200) {
                  this.isLoading = false;
                  this._commonService.successMsg(
                    'Your SRR has been submitted successfully !' +
                      '<br>' +
                      'SRR No. is - ' +
                      SRRNO
                  );
                  this._router.navigateByUrl('/home/rate-request/srr-list');
                }
              });
          } else {
            this.isLoading = false;
            this._commonService.successMsg(
              'Your SRR has been submitted successfully !' +
                '<br>' +
                'SRR No. is - ' +
                SRRNO
            );
            this._router.navigateByUrl('/home/rate-request/srr-list');
          }
        }
      });
  }

  openRateDetailModal(i: any) {
    this.connIndex = i;

    this.RateDetailModal.nativeElement.click();
  }

  insertVoyage() {
    this.submitted3 = true;

    if (this.voyageForm.invalid) {
      return;
    }

    this.voyageForm
      .get('CREATED_BY')
      ?.setValue(this._commonService.getUserName());

    this._bookingService
      .insertVoyage(JSON.stringify(this.voyageForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg('Voyage added successfully !');
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
      CUSTOMER_NAME: ['', Validators.required],
      PLACE_OF_RECEIPT: [''],
      PLACE_OF_DELIVERY: [''],
      TSP_1: [''],
      TSP_2: [''],
      CREATED_BY: [''],
      AGENT_NAME: [''],
      AGENT_CODE: [''],
      STATUS: ['Requested'],
      SRR_CONTAINERS: new FormArray([]),
      SRR_COMMODITIES: new FormArray([]),
      FREIGHT_CHARGES: new FormArray([]),
      POL_CHARGES: new FormArray([]),
      POD_CHARGES: new FormArray([]),
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
      HAZ_APPROVAL_REF: ['', [Validators.pattern('^([a-zA-Z0-9]+)$')]],
      FLASH_POINT: ['', Validators.required],
      CAS_NO: ['', Validators.required],
      VENTILATION: [
        '',
        [Validators.required, Validators.pattern('^([a-zA-Z0-9]+)$')],
      ],
      HUMIDITY: [
        '',
        [Validators.required, Validators.pattern('^([a-zA-Z0-9]+)$')],
      ],
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
      TERMINAL_CODE: ['', Validators.required],
      SERVICE_NAME: ['', Validators.required],
      VIA_NO: ['', Validators.required],
      PORT_CODE: ['', Validators.required],
      ETA: ['', Validators.required],
      ETD: ['', Validators.required],
      CREATED_BY: [''],
    });

    this.partyForm = this._formBuilder.group({
      CUST_ID: [0],
      CUST_NAME: ['', Validators.required],
      CUST_EMAIL: ['', [Validators.email]],
      CUST_ADDRESS: ['', Validators.required],
      CUST_TYPE: [''],
      CUST_TYPE_CODE: new FormControl(this.custTypeList, Validators.required),
      GSTIN: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
          ),
        ],
      ],
      STATUS: ['', Validators.required],
      CUST_CONTACT: [''],
      VAT_NO: ['', Validators.required],
    });

    if (this._commonService.getUser()?.countrycode == 'IN') {
      this.partyForm.get('GSTIN').enable();
      this.partyForm.get('VAT_NO').disable();
      this.isGST = true;
    } else {
      this.partyForm.get('GSTIN').disable();
      this.partyForm.get('VAT_NO').enable();
      this.isGST = false;
    }
  }

  getEffectToDate(e: any, param: any) {
    let x = new Date(param == 0 ? e : e.target.value);

    var newDate = new Date();
    newDate.setDate(x.getDate() + 15);

    this.effectToDate = this._commonService.getcurrentDate(newDate);
    this.quotationForm.get('EFFECT_TO')?.setValue(this.effectToDate);
  }

  getDropdown() {
    var portcode: any = this._commonService.getUser().port;

    this._commonService
      .getDropdownData(
        'PLACE_OF_RECEIPT',
        '',
        this._commonService.getUser().countrycode
      )
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.placeofRecpList = res.Data;
        }
      });

    var countrycode: any = this._commonService.getUser().countrycode;

    this._commonService
      .getDropdownData('PORT', '', countrycode)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.polList = res.Data;
        }
      });

    this._commonService.getDropdownData('PORT').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.podList = res.Data;
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

  getCustTypeDropdown() {
    this.custTypeList = [];
    this.partyForm.get('CUST_TYPE_CODE').setValue('');
    this._commonService
      .getDropdownData('CUST_TYPE', '', '')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.custTypeList = res.Data;
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

  onChangePOD(event: any) {
    this.placeofDelList = [];
    this.quotationForm.get('PLACE_OF_DELIVERY')?.setValue('');
    this._commonService
      .getDropdownData('PLACE_OF_DELIVERY', event)
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.placeofDelList = res.Data;
        }
      });

    this.finalDestList = [];
    this.quotationForm.get('FINAL_DESTINATION')?.setValue('');
    this._commonService
      .getDropdownData('FINAL_DESTINATION', event)
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.finalDestList = res.Data;
        }
      });

    this.slotoperatorList = [];
    this._commonService
      .getDropdownData(
        'SLOT_OPERATOR',
        this.quotationForm.get('POL').value,
        event
      )
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.slotoperatorList = res.Data;
        }
      });
  }

  getServiceName1(event: any) {
    this.servicenameList1 = [];
    this.terminalList = [];
    this.voyageForm.get('SERVICE_NAME')?.setValue('');
    this.voyageForm.get('TERMINAL_CODE')?.setValue('');
    this._commonService
      .getDropdownData('SERVICE_NAME', event, '')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.servicenameList1 = res.Data;
        }
      });

    this._commonService
      .getDropdownData('TERMINAL', event, '')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.terminalList = res.Data;
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
    var s = this.quotationForm.get('FREIGHT_CHARGES') as FormArray;
    return s.controls;
  }

  get f4() {
    var s = this.quotationForm.get('POL_CHARGES') as FormArray;
    return s.controls;
  }

  get f8() {
    var s = this.quotationForm.get('POD_CHARGES') as FormArray;
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

  numericOnly(event: any) {
    this._commonService.numericOnly(event);
  }

  slotAllocation() {
    var slotDetails = this.slotDetailsForm.get('SLOT_LIST') as FormArray;

    slotDetails.push(
      this._formBuilder.group({
        SLOT_OPERATOR: ['', Validators.required],
        NO_OF_SLOTS: ['', Validators.required],
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
      FILE: event.target.files[0],
      COMMODITY_TYPE: commodityType,
    });

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

  isVesselValidity(e: any) {
    var slotDetails = this.slotDetailsForm.get('SLOT_LIST') as FormArray;

    if (e.target.checked) {
      slotDetails.clear();

      slotDetails.push(
        this._formBuilder.group({
          SLOT_OPERATOR: ['', Validators.required],
          NO_OF_SLOTS: ['', Validators.required],
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

  removeCommodity(i: any) {
    var s = this.quotationForm.get('SRR_COMMODITIES') as FormArray;
    s.removeAt(i);
  }

  OnPaymentTerm(event: any, i: number, value: any) {
    const add = this.quotationForm.get(value) as FormArray;
    if (event.target.value == 'Prepaid') {
      add.at(i)?.get('TRANSPORT_TYPE')?.setValue('POL');
    } else if (event.target.value == 'Collect') {
      add.at(i)?.get('TRANSPORT_TYPE')?.setValue('POD');
    }
  }

  removeRate(i: any) {
    this.containerList.splice(i, 1);
  }

  tempValidation(event: any) {
    this._commonService.temperatureValidation(event);
    if (event.target.value.length == 1 && event.target.value == '-') {
      this.maxValue = '4';
    } else if (event.target.value.length == 1 && event.target.value != '-') {
      this.maxValue = '3';
    }
  }
}
