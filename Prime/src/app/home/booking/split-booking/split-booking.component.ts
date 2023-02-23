import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BOOKING } from 'src/app/models/booking';
import { BookingService } from 'src/app/services/booking.service';
import { QuotationService } from 'src/app/services/quotation.service';
import { locale as english } from 'src/app/@core/translate/booking/en';
import { locale as hindi } from 'src/app/@core/translate/booking/hi';
import { locale as arabic } from 'src/app/@core/translate/booking/ar';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-split-booking',
  templateUrl: './split-booking.component.html',
  styleUrls: ['./split-booking.component.scss'],
})
export class SplitBookingComponent implements OnInit {
  splitBookingForm: FormGroup;
  booking = new BOOKING();
  isScroll: boolean = false;
  splitbooking = new BOOKING();
  bookingNo: string = '';
  previewDetails: boolean = false;
  previewNoData: boolean = false;
  submitted: boolean = false;
  vesselList: any[] = [];
  voyageList: any[] = [];
  submitted3: boolean = false;
  voyageForm: FormGroup;
  // slotDetailsForm: FormGroup;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  servicenameList: any[] = [];
  servicetypeList: any[] = [];
  portList: any[] = [];
  rollOverList: any[] = [];
  // booking:BOOKING=new BOOKING ();

  @ViewChild('closeBtn3') closeBtn3: ElementRef;

  constructor(
    private _formBuilder: FormBuilder,
    private _bookingService: BookingService,
    private _commonService: CommonService,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, hindi, arabic);
  }

  ngOnInit(): void {
    this.getForm();
    this.slotAllocation();
    this.getRolloverList();
  }

  slotAllocation(i: any = 0) {
    var slotDetails = this.splitBookingForm.get('SLOT_LIST') as FormArray;

    if (i == 0) {
      slotDetails.clear();
    }

    slotDetails.push(
      this._formBuilder.group({
        SLOT_OPERATOR: ['', Validators.required],
        NO_OF_SLOTS: ['', Validators.required],
      })
    );

    if (slotDetails?.length >= 3) {
      this.isScroll = true;
    }
  }

  get f() {
    var x = this.splitBookingForm.get('SLOT_LIST') as FormArray;
    return x.controls;
  }

  get f2() {
    return this.splitBookingForm.controls;
  }

  get f6() {
    return this.voyageForm.controls;
  }

  getBookingDetails() {
    this.previewNoData = false;
    this.previewDetails = false;
    var bk = new BOOKING();
    bk.AGENT_CODE = this._commonService.getUserCode();
    bk.BOOKING_NO = this.bookingNo;

    this._bookingService.getBookingDetails(bk).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.booking = res.Data;
        this.previewDetails = true;
      }
      if (res.ResponseCode == 500) {
        this.previewNoData = true;
      }
      this.getDropdownData();
      this.getRolloverList();
    });
  }

  getRolloverList() {
    this._commonService.destroyDT();
    this.booking.AGENT_CODE = this._commonService.getUserCode();
    this._bookingService.getRollOverList(this.booking).subscribe((res: any) => {
      this.isLoading = false;
      this.isLoading1 = false;
      if (res.ResponseCode == 200) {
        this.rollOverList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  getServiceName(event: any) {
    this.servicenameList = [];
    this.voyageForm.get('SERVICE_NAME')?.setValue('');
    this._commonService
      .getDropdownData('SERVICE_NAME', event, '')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.servicenameList = res.Data;
        }
      });
  }

  removeItem(i: any) {
    const add = this.splitBookingForm.get('SLOT_LIST') as FormArray;
    add.removeAt(i);

    if (add?.length >= 3) {
      this.isScroll = true;
    } else {
      this.isScroll = false;
    }
  }

  getDropdownData() {
    this._commonService.getDropdownData('VESSEL_NAME').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.vesselList = res.Data;
      }
    });

    this._commonService.getDropdownData('PORT').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.portList = res.Data;
      }
    });
  }

  getVoyageList(event: any) {
    this.splitBookingForm.get('VOYAGE_NO')?.setValue('');
    this.voyageList = [];
    this._commonService
      .getDropdownData('VOYAGE_NO', '', event)
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.voyageList = res.Data;
        }
      });
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
          this.closeBtn3.nativeElement.click();
        }
      });
  }

  getForm() {
    this.splitBookingForm = this._formBuilder.group({
      BOOKING_NO: [''],
      BOOKING_ID: [''],
      SRR_ID: [0],
      SRR_NO: [''],
      VESSEL_NAME: ['', Validators.required],
      VOYAGE_NO: ['', Validators.required],
      MOTHER_VESSEL_NAME: [''],
      MOTHER_VOYAGE_NO: [''],
      AGENT_CODE: [''],
      AGENT_NAME: [''],
      STATUS: [''],
      CREATED_BY: [''],
      IS_ROLLOVER: [false],
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
  }

  splitBooking() {
    this.submitted = true;
    if (this.splitBookingForm.invalid) {
      return;
    }
    this.splitBookingForm.get('BOOKING_NO')?.setValue(this.booking?.BOOKING_NO);
    this.splitBookingForm.get('IS_ROLLOVER')?.setValue(true);
    this.splitBookingForm
      .get('SRR_ID')
      ?.setValue(this.booking?.CONTAINER_LIST[0].SRR_ID);
    this.splitBookingForm
      .get('SRR_NO')
      ?.setValue(this.booking?.CONTAINER_LIST[0].SRR_NO);
    this.splitBookingForm
      .get('AGENT_NAME')
      ?.setValue(this._commonService.getUserName());
    this.splitBookingForm
      .get('AGENT_CODE')
      ?.setValue(this._commonService.getUserCode());
    this.splitBookingForm.get('STATUS')?.setValue('Booked');
    this.splitBookingForm
      .get('CREATED_BY')
      ?.setValue(this._commonService.getUserName());

    this._bookingService
      .postBookingDetails(JSON.stringify(this.splitBookingForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'The booking has been rolled over successfully !'
          );
          this.getRolloverList();
          this.cancelBooking();
        }
      });
  }

  cancelBooking() {
    this.splitBookingForm.get('VESSEL_NAME')?.setValue('');
    this.splitBookingForm.get('VOYAGE_NO')?.setValue('');
    this.voyageList = [];
    this.splitBookingForm.get('MOTHER_VESSEL_NAME')?.setValue('');
    this.splitBookingForm.get('MOTHER_VOYAGE_NO')?.setValue('');
    this.slotAllocation();
  }
}
