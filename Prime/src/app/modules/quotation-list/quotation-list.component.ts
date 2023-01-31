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
import Swal from 'sweetalert2';


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
  submitted2:boolean=false;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  srrNo: string = '';
  submitted3: boolean = false;

  @ViewChild('openBtn') openBtn: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeBtn1') closeBtn1: ElementRef;
  @ViewChild('closeBtn2') closeBtn2: ElementRef;
  @ViewChild('closeBtn2') closeBtn3: ElementRef; 
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
      SLOT_OPERATOR:['',Validators.required],
      NO_OF_SLOTS:['',Validators.required],
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

  getSRRList() {
    this.quotation.AGENT_CODE = localStorage.getItem('usercode');
    this.quotation.OPERATION = 'GET_SRRLIST';
    this._quotationService.getSRRList(this.quotation).subscribe(
      (res: any) => {
        this.quotationList = [];
        this.isScroll = false;
        if (res.hasOwnProperty('Data')) {
          if (res.Data?.length > 0) {
            this.isLoading = false;
            this.isLoading1 = false;
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
          alert('You are not authorized to access this page, please login');
          this._router.navigateByUrl('login');
        }
      }
    );
  }

  getSRRDetails(item: any, value: string) {
    this.srrNo = item.SRR_NO;
    var quotation = new QUOTATION();
    quotation.SRR_NO = item.SRR_NO;
    quotation.AGENT_CODE = localStorage.getItem('usercode');
    this._quotationService.getSRRDetails(quotation).subscribe((res: any) => {
      this.containerList = res.Data?.SRR_CONTAINERS;

      const add = this.containerForm.get('SRR_CONTAINERS') as FormArray;
      add.clear();
      this.containerList.forEach((element) => {
        add.push(
          this._formBuilder.group({
            SRR_ID: [item.SRR_ID],
            SRR_NO: [element.SRR_NO],
            CONTAINER_TYPE: [element.CONTAINER_TYPE],
            CONTAINER_SIZE: [element.CONTAINER_SIZE],
            SERVICE_MODE: [element.SERVICE_MODE],
            IMM_VOLUME_EXPECTED: ['',Validators.required],
            STATUS: [element.STATUS],
            CREATED_BY: [localStorage.getItem('username')],
          })
        );
      });

      const add1 = this.rateForm.get('SRR_RATES') as FormArray;

      add1.clear();
      res.Data?.SRR_RATES.forEach((element: any) => {
        add1.push(this._formBuilder.group(element));
      });
    });

    if (value == 'container') {
      this.containerModal.nativeElement.click();
    } else if (value == 'rate') {
      this.rateModal.nativeElement.click();
    }
  }

  addContainer() {
    this.submitted2 = true;
    if (this.containerForm.invalid) {
      return;
    }
    this._quotationService
      .insertContainer(JSON.stringify(this.containerForm.value.SRR_CONTAINERS))
      .subscribe((res: any) => {
        this.closeBtn1.nativeElement.click();
         this. _commonService.successMsg('Your container has been added successfully  !');

        //  alert('Your container has been added successfully !');
        this.getSRRList();
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

  get f6() {
    return this.voyageForm.controls;
  }

  getQuotationDetails(SRR_NO: any) {
    localStorage.setItem('SRR_NO', SRR_NO);
    this._router.navigateByUrl('home/srr-details');
  }

  slotAllocation() {
    var slotDetails = this.slotDetailsForm.get('SLOT_LIST') as FormArray;

    slotDetails.push(
      this._formBuilder.group({
        SLOT_OPERATOR: [''],
        NO_OF_SLOTS: [''],
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

  openBookingModal(i: any) {
    this.quotationDetails = new QUOTATION();
    this.quotationDetails.POL = this.quotationList[i].POL;
    this.quotationDetails.POD = this.quotationList[i].POD;
    this.quotationDetails.SRR_ID = this.quotationList[i].SRR_ID;
    this.quotationDetails.SRR_NO = this.quotationList[i].SRR_NO;
    this.quotationDetails.NO_OF_CONTAINERS =
      this.quotationList[i].NO_OF_CONTAINERS;

    this.slotDetailsForm.reset();
    this.slotDetailsForm.get('VESSEL_NAME')?.setValue('');
    this.slotDetailsForm.get('VOYAGE_NO')?.setValue('');
    var slotDetails = this.slotDetailsForm.get('SLOT_LIST') as FormArray;

    slotDetails.clear();

    slotDetails.push(
      this._formBuilder.group({
        SLOT_OPERATOR: [''],
        NO_OF_SLOTS: [''],
      })
    );

    this.openBtn.nativeElement.click();
  }

  bookNow() {
    this.submitted = true;
    this.slotDetailsForm.get('BOOKING_NO')?.setValue(this.getRandomNumber());
    this.slotDetailsForm.get('SRR_ID')?.setValue(this.quotationDetails?.SRR_ID);
    this.slotDetailsForm.get('SRR_NO')?.setValue(this.quotationDetails?.SRR_NO);
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

    this.closeBtn.nativeElement.click();

    this._quotationService
      .booking(JSON.stringify(this.slotDetailsForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this. _commonService.successMsg('Your booking is placed successfully !');
          this._router.navigateByUrl('/home/booking-list');
        }
      });
  }

  get f() {
    var x = this.slotDetailsForm.get('SLOT_LIST') as FormArray;
    return x.controls;
  }

  f1(i: any) {
    return i;
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

  getRandomNumber() {
    var num = Math.floor(Math.random() * 1e16).toString();
    return 'BK' + num;
  }

  removeItem(i: any) {
    const add = this.slotDetailsForm.get('SLOT_LIST') as FormArray;
    add.removeAt(i);
  }

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

  counterRate(item: any, value: string) {
    var srrRates = this.rateForm.value.SRR_RATES.filter(
      (x: any) => x.CONTAINER_TYPE === item
    );

    srrRates.forEach((element: any) => {
      element.STATUS = value;
      element.CREATED_BY = localStorage.getItem('username');
    });

    this._quotationService
      .counterRate(this.rateForm.value.SRR_RATES)
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your request is been sent Successfully !');
          this.closeBtn2.nativeElement.click();
          this.getSRRList();
        }
      });
  }

  getForm() {
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



  
}
