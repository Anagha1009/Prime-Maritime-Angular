import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import { QUOTATION } from 'src/app/models/quotation';
import { CommonService } from 'src/app/services/common.service';
import { QuotationService } from 'src/app/services/quotation.service';
import { locale as english } from 'src/app/@core/translate/srr/en';
import { locale as hindi } from 'src/app/@core/translate/srr/hi';
import { locale as arabic } from 'src/app/@core/translate/srr/ar';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-quotation-list',
  templateUrl: './quotation-list.component.html',
  styleUrls: ['./quotation-list.component.scss'],
})
export class QuotationListComponent implements OnInit {
  quotation = new QUOTATION();
  quotationList: any[] = [];
  isScroll: boolean = false;
  quotationDetails: any;
  slotDetailsForm: FormGroup;
  quotationForm: FormGroup;
  containerForm: FormGroup;
  containerList: any[] = [];
  rateForm: FormGroup;
  expRecords: any = 0;
  vesselList: any[] = [];
  voyageList: any[] = [];
  portList: any[] = [];
  voyageForm: FormGroup;
  vesselList1: any[] = [];
  currencyList: any[] = [];
  currencyList1: any[] = [];
  currencyList2: any[] = [];
  isVoyageAdded: boolean = false;
  servicenameList: any[] = [];
  servicenameList1: any[] = [];
  slotoperatorList: any[] = [];
  submitted: boolean = false;
  submitted2: boolean = false;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  srrNo: string = '';
  submitted3: boolean = false;
  terminalList: any[] = [];
  isrefresh: boolean = false;
  commodityHAZ: boolean = false;
  commodityFLEXI: boolean = false;
  commoditySP: boolean = false;
  isTranshipment: boolean = false;
  bookingNo: string = '';

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

  @ViewChild('openBtn') openBtn: ElementRef;
  @ViewChild('openBtn1') openBtn1: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeBtn1') closeBtn1: ElementRef;
  @ViewChild('closeBtn2') closeBtn2: ElementRef;
  @ViewChild('closeBtn3') closeBtn3: ElementRef;
  @ViewChild('closeBtn4') closeBtn4: ElementRef;
  @ViewChild('containerModal') containerModal: ElementRef;
  @ViewChild('rateModal') rateModal: ElementRef;

  constructor(
    private _quotationService: QuotationService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _bookingService: BookingService,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, hindi, arabic);
  }

  ngOnInit(): void {
    this.getForm();
    this.quotationForm = this._formBuilder.group({
      SRR_NO: [''],
      CUSTOMER_NAME: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
      STATUS: [''],
    });

    this.getSRRList();

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

    this.containerForm = this._formBuilder.group({
      SRR_CONTAINERS: new FormArray([]),
    });

    this.rateForm = this._formBuilder.group({
      SRR_RATES: new FormArray([]),
    });

    this.getDropdown();
  }

  getDropdown() {
    this._commonService.getDropdownData('PORT').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.portList = res.Data;
      }
    });

    this._commonService.getDropdownData('VESSEL_NAME').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
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
    this.isLoading = true;
    this.getSRRList();
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

    this.isLoading1 = true;
    this.getSRRList();
  }

  refresh() {
    this.isrefresh = true;
    setTimeout(() => {
      this.getSRRList();
    }, 1000);
  }

  getSRRList() {
    this.quotation.AGENT_CODE = this._commonService.getUserCode();
    this.quotation.OPERATION = 'GET_SRRLIST';

    this._quotationService.getSRRList(this.quotation).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.isLoading1 = false;
        this.quotationList = [];
        this.isScroll = false;
        this.isrefresh = false;
        if (res.hasOwnProperty('Data')) {
          if (res.Data?.length > 0) {
            this.quotationList = res.Data;
            if (this.quotationList?.length >= 4) {
              this.isScroll = true;
            } else {
              this.isScroll = false;
            }

            this.expRecords = 0;
            res.Data.forEach((element: any) => {
              if (element.DAYS <= 3) {
                this.expRecords = this.expRecords + 1;
              }
            });
          }
        }
      },
      (error: any) => {
        if (error.status == 401) {
          this._commonService.errorMsg(
            'You are not authorized to access this page, please login'
          );
          this._router.navigateByUrl('login');
        }
      }
    );
  }

  getSRRDetails(item: any, value: string) {
    this.srrNo = item.SRR_NO;
    var quotation = new QUOTATION();
    quotation.SRR_NO = item.SRR_NO;
    quotation.AGENT_CODE = this._commonService.getUserCode();
    this._quotationService.getSRRDetails(quotation).subscribe(
      (res: any) => {
        this.containerList = res.Data?.SRR_CONTAINERS;

        const add = this.containerForm.get('SRR_CONTAINERS') as FormArray;
        add.clear();
        this.containerList.forEach((element) => {
          add.push(
            this._formBuilder.group({
              SRR_ID: [item.SRR_ID],
              SRR_NO: [element.SRR_NO],
              POL: [res.Data?.POL],
              POD: [res.Data?.POD],
              CONTAINER_TYPE: [element.CONTAINER_TYPE],
              CONTAINER_SIZE: [element.CONTAINER_SIZE],
              SERVICE_MODE: [element.SERVICE_MODE],
              IMM_VOLUME_EXPECTED: ['', Validators.required],
              STATUS: [element.STATUS],
              CREATED_BY: [this._commonService.getUserName()],
            })
          );
        });

        const add1 = this.rateForm.get('SRR_RATES') as FormArray;
        add1.clear();
        res.Data?.SRR_RATES.forEach((element: any) => {
          add1.push(this._formBuilder.group(element));
        });
      },
      (error: any) => {
        if (error.status == 401) {
          this._commonService.errorMsg(
            'You are not authorized to access this page, please login'
          );
          this._router.navigateByUrl('login');
        }
      }
    );

    if (value == 'container') {
      this.submitted2 = false;
      this.containerModal.nativeElement.click();
    } else if (value == 'rate') {
      this.rateModal.nativeElement.click();
    }
  }

  addContainer() {
    var valid = true;
    this.containerList.forEach((element, i) => {
      if (
        +element.IMM_VOLUME_EXPECTED +
          +this.containerForm.value.SRR_CONTAINERS[i].IMM_VOLUME_EXPECTED >
        +element.TOTAL_VOLUME_EXPECTED
      ) {
        valid = false;
      }
    });

    if (!valid) {
      this._commonService.errorMsg(
        'You cannot add containers more than Total Volume Expected !'
      );
      return;
    }

    this.submitted2 = true;
    if (this.containerForm.invalid) {
      return;
    }
    this._quotationService
      .insertContainer(JSON.stringify(this.containerForm.value.SRR_CONTAINERS))
      .subscribe(
        (res: any) => {
          this.closeBtn1.nativeElement.click();
          this._commonService.successMsg(
            'Your container has been added successfully  !'
          );
          this.getSRRList();
        },
        (error: any) => {
          if (error.status == 401) {
            this._commonService.errorMsg(
              'You are not authorized to access this page, please login'
            );
            this._router.navigateByUrl('login');
          }
        }
      );
  }

  getServiceName1(event: any) {
    this.servicenameList1 = [];
    this.terminalList = [];
    this.slotDetailsForm.get('SERVICE_NAME')?.setValue('');
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

  get f6() {
    return this.voyageForm.controls;
  }

  getQuotationDetails(SRR_NO: any) {
    localStorage.setItem('SRR_NO', SRR_NO);
    this._router.navigateByUrl('home/rate-request/srr-details');
  }

  slotAllocation() {
    var slotDetails = this.slotDetailsForm.get('SLOT_LIST') as FormArray;

    slotDetails.push(
      this._formBuilder.group({
        SLOT_OPERATOR: ['', Validators.required],
        NO_OF_SLOTS: ['', Validators.required],
      })
    );
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
      .subscribe(
        (res: any) => {
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
        },
        (error: any) => {
          if (error.status == 401) {
            this._commonService.errorMsg(
              'You are not authorized to access this page, please login'
            );
            this._router.navigateByUrl('login');
          }
        }
      );
  }

  bookingSuccessful(item: any, i: any, totalBookings: any) {
    this.openBtn1.nativeElement.click();
    this.bookingNo = item.BOOKING_NO;
    this.srrNo = item.SRR_NO;
    if (totalBookings == 1) {
      this.quotationList[i].COMMODITY?.split(', ').forEach((element: any) => {
        if (element.split('-')[0].includes('HAZ')) {
          this.commodityHAZ = true;
        } else if (element.split('-')[0].includes('SP')) {
          this.commoditySP = true;
        } else if (element.split('-')[0].includes('FLEXIBAG')) {
          this.commodityFLEXI = true;
        }
      });
    }
  }

  bookingSuccessfulSubmit() {
    if (this.commodityHAZ) {
      var Hazfiles = this.fileList.filter((x) => x.COMMODITY_TYPE == 'HAZ');
      if (Hazfiles.length != 3) {
        alert('Please Upload All 3 Hazardous Files !');
        return;
      }
    }
    if (this.commodityFLEXI) {
      var flexifiles = this.fileList.filter(
        (x) => x.COMMODITY_TYPE == 'FLEXIBAG'
      );
      if (flexifiles.length != 2) {
        alert('Please Upload All 2 Flexibag Files !');
        return;
      }
    }
    if (this.commoditySP) {
      var spfiles = this.fileList.filter((x) => x.COMMODITY_TYPE == 'SP');
      if (spfiles.length != 2) {
        alert('Please Upload All 2 Special Equipment Files !');
        return;
      }
    }

    if (this.commodityHAZ || this.commodityFLEXI || this.commoditySP) {
      this.uploadFilestoDB(this.srrNo);
    }
    this.closeBtn4.nativeElement.click();
    this._commonService.successMsg(
      'Your booking is already created ! Booking No is ' + this.bookingNo
    );
    this._router.navigateByUrl('/home/booking-list');
  }

  openBookingModal(i: any, totalBookings: any) {
    this.quotationDetails = new QUOTATION();
    this.quotationDetails.POL = this.quotationList[i].POL;
    this.quotationDetails.POD = this.quotationList[i].POD;
    this.quotationDetails.SRR_ID = this.quotationList[i].SRR_ID;
    this.quotationDetails.SRR_NO = this.quotationList[i].SRR_NO;
    this.quotationDetails.NO_OF_CONTAINERS =
      this.quotationList[i].NO_OF_CONTAINERS;

    if (totalBookings == 0) {
      this.quotationList[i].COMMODITY?.split(', ').forEach((element: any) => {
        if (element.split('-')[0].includes('HAZ')) {
          this.commodityHAZ = true;
        } else if (element.split('-')[0].includes('SP')) {
          this.commoditySP = true;
        } else if (element.split('-')[0].includes('FLEXIBAG')) {
          this.commodityFLEXI = true;
        }
      });
    }

    this.slotDetailsForm.reset();
    this.submitted = false;
    this.slotDetailsForm.get('VESSEL_NAME')?.setValue('');
    this.slotDetailsForm.get('VOYAGE_NO')?.setValue('');
    var slotDetails = this.slotDetailsForm.get('SLOT_LIST') as FormArray;

    slotDetails.clear();

    slotDetails.push(
      this._formBuilder.group({
        SLOT_OPERATOR: ['', Validators.required],
        NO_OF_SLOTS: ['', Validators.required],
      })
    );

    this._commonService
      .getDropdownData(
        'SLOT_OPERATOR',
        this.quotationDetails?.POL.split('(')[1].split(')')[0],
        this.quotationDetails?.POD.split('(')[1].split(')')[0]
      )
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.slotoperatorList = res.Data;
        }
      });

    this.openBtn.nativeElement.click();
  }

  bookNow() {
    if (this.commodityHAZ) {
      var Hazfiles = this.fileList.filter((x) => x.COMMODITY_TYPE == 'HAZ');
      if (Hazfiles.length != 3) {
        alert('Please Upload All 3 Hazardous Files !');
        return;
      }
    }
    if (this.commodityFLEXI) {
      var flexifiles = this.fileList.filter(
        (x) => x.COMMODITY_TYPE == 'FLEXIBAG'
      );
      if (flexifiles.length != 2) {
        alert('Please Upload All 2 Flexibag Files !');
        return;
      }
    }
    if (this.commoditySP) {
      var spfiles = this.fileList.filter((x) => x.COMMODITY_TYPE == 'SP');
      if (spfiles.length != 2) {
        alert('Please Upload All 2 Special Equipment Files !');
        return;
      }
    }

    this.submitted = true;
    if (this.slotDetailsForm.invalid) {
      return;
    }
    var bookingNo = this._commonService.getRandomNumber('BK');
    this.slotDetailsForm.get('BOOKING_NO')?.setValue(bookingNo);
    this.slotDetailsForm.get('SRR_ID')?.setValue(this.quotationDetails?.SRR_ID);
    this.slotDetailsForm.get('SRR_NO')?.setValue(this.quotationDetails?.SRR_NO);
    this.slotDetailsForm.get('STATUS')?.setValue('Booked');
    this.slotDetailsForm
      .get('CREATED_BY')
      ?.setValue(this._commonService.getUserName());
    this.slotDetailsForm
      .get('AGENT_NAME')
      ?.setValue(this._commonService.getUserName());
    this.slotDetailsForm
      .get('AGENT_CODE')
      ?.setValue(this._commonService.getUserCode());

    this.closeBtn.nativeElement.click();
    this._quotationService
      .booking(JSON.stringify(this.slotDetailsForm.value))
      .subscribe(
        (res: any) => {
          if (res.responseCode == 200) {
            if (this.commodityHAZ || this.commodityFLEXI || this.commoditySP) {
              this.uploadFilestoDB(this.quotationDetails?.SRR_NO);
            }

            this._commonService.successMsg(
              'Your booking is placed successfully ! Booking No is ' + bookingNo
            );
            this._router.navigateByUrl('/home/booking/booking-list');
          }
        },
        (error: any) => {
          if (error.status == 401) {
            this._commonService.errorMsg(
              'You are not authorized to access this page, please login'
            );
            this._router.navigateByUrl('login');
          }
        }
      );
  }

  get f() {
    var x = this.slotDetailsForm.get('SLOT_LIST') as FormArray;
    return x.controls;
  }

  get f2() {
    var x = this.containerForm.get('SRR_CONTAINERS') as FormArray;
    return x.controls;
  }

  get f3() {
    var x = this.rateForm.get('SRR_RATES') as FormArray;
    return x.controls;
  }

  get f4() {
    return this.slotDetailsForm.controls;
  }

  removeItem(i: any) {
    const add = this.slotDetailsForm.get('SLOT_LIST') as FormArray;
    add.removeAt(i);
  }

  counterRate(item: any, value: string) {
    var srrRates = this.rateForm.value.SRR_RATES.filter(
      (x: any) => x.CONTAINER_TYPE === item
    );

    srrRates.forEach((element: any) => {
      element.STATUS = value;
      element.CREATED_BY = this._commonService.getUser().role;
    });

    this._quotationService.counterRate(this.rateForm.value.SRR_RATES).subscribe(
      (res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your request is been ' + value == 'Approved'
              ? 'Accepted'
              : value + ' Successfully !'
          );
          this.closeBtn2.nativeElement.click();
          this.getSRRList();
        }
      },
      (error: any) => {
        if (error.status == 401) {
          this._commonService.errorMsg(
            'You are not authorized to access this page, please login'
          );
          this._router.navigateByUrl('login');
        }
      }
    );
  }

  getForm() {
    this.voyageForm = this._formBuilder.group({
      VESSEL_NAME: ['', Validators.required],
      VOYAGE_NO: ['', Validators.required],
      ATA: [],
      ATD: [],
      TERMINAL_CODE: ['', Validators.required],
      SERVICE_NAME: ['', Validators.required],
      VIA_NO: ['', Validators.required],
      PORT_CODE: ['', Validators.required],
      ETA: ['', Validators.required],
      ETD: ['', Validators.required],
      CREATED_BY: [''],
    });
  }

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

  uploadFilestoDB(SRRNO: string) {
    const payload = new FormData();
    this.fileList.forEach((element: any) => {
      payload.append('FILE', element.FILE);
      payload.append('COMMODITY_TYPE', element.COMMODITY_TYPE);
    });

    this._quotationService.uploadFiles(payload, SRRNO).subscribe();
  }
}
