import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { QUOTATION } from 'src/app/models/quotation';
import { QuotationService } from 'src/app/services/quotation.service';

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

  @ViewChild('openBtn') openBtn: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeBtn1') closeBtn1: ElementRef;
  @ViewChild('containerModal') containerModal: ElementRef;

  constructor(
    private _quotationService: QuotationService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
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

    this.containerForm = this._formBuilder.group({
      SRR_CONTAINERS: new FormArray([]),
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
            this.quotationList = res.Data;

            if (this.quotationList?.length >= 4) {
              this.isScroll = true;
            } else {
              this.isScroll = false;
            }
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

  getSRRDetails(item: any) {
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
            IMM_VOLUME_EXPECTED: [''],
            CREATED_BY: [localStorage.getItem('username')],
          })
        );
      });
    });

    this.containerModal.nativeElement.click();
  }

  addContainer() {
    this._quotationService
      .insertContainer(JSON.stringify(this.containerForm.value))
      .subscribe((res: any) => {
        this.closeBtn1.nativeElement.click();
        alert('Your container has been added successfully !');
        this.getSRRList();
      });
  }

  getQuotationDetails(SRR_NO: any) {
    localStorage.setItem('SRR_NO', SRR_NO);
    this._router.navigateByUrl('home/quotation-details');
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

  openBookingModal(i: any) {
    this.quotationDetails = new QUOTATION();
    this.quotationDetails.POL = this.quotationList[i].POL;
    this.quotationDetails.POD = this.quotationList[i].POD;
    this.quotationDetails.SRR_ID = this.quotationList[i].SRR_ID;
    this.quotationDetails.SRR_NO = this.quotationList[i].SRR_NO;
    this.quotationDetails.NO_OF_CONTAINERS =
      this.quotationList[i].NO_OF_CONTAINERS;

    this.slotDetailsForm.reset();
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

    console.log(JSON.stringify(this.slotDetailsForm.value));

    this.closeBtn.nativeElement.click();

    this._quotationService
      .booking(JSON.stringify(this.slotDetailsForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your booking is placed successfully !');
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

  f3(i: any) {
    return i;
  }

  getRandomNumber() {
    var num = Math.floor(Math.random() * 1e16).toString();
    return 'BK' + num;
  }
}
