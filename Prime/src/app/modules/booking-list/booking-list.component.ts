import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import { BOOKING } from 'src/app/models/booking';
import { BookingService } from 'src/app/services/booking.service';
import { locale as english } from 'src/app/@core/translate/booking/en';
import { locale as hindi } from 'src/app/@core/translate/booking/hi';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
})
export class BookingListComponent implements OnInit {
  booking = new BOOKING();
  bookingList: any[] = [];
  isScroll: boolean = false;
  bookingForm: FormGroup;
  expRecords: any = 0;

  constructor(
    private _formBuilder: FormBuilder,
    private _bookingService: BookingService,
    private _router: Router,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, hindi);
  }

  ngOnInit(): void {
    this.bookingForm = this._formBuilder.group({
      BOOKING_NO: [''],
      CUSTOMER_NAME: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
      STATUS: [''],
    });

    this.getBookingList();
  }

  Search() {
    var BOOKING_NO = this.bookingForm.value.BOOKING_NO;
    var CUSTOMER_NAME = this.bookingForm.value.CUSTOMER_NAME;
    var STATUS = this.bookingForm.value.STATUS;
    var FROM_DATE = this.bookingForm.value.FROM_DATE;
    var TO_DATE = this.bookingForm.value.TO_DATE;

    if (
      BOOKING_NO == '' &&
      CUSTOMER_NAME == '' &&
      STATUS == '' &&
      FROM_DATE == '' &&
      TO_DATE == ''
    ) {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.booking.BOOKING_NO = BOOKING_NO;
    this.booking.CUSTOMER_NAME = CUSTOMER_NAME;
    this.booking.STATUS = STATUS;

    this.getBookingList();
  }

  Clear() {
    this.bookingForm.get('BOOKING_NO')?.setValue('');
    this.bookingForm.get('CUSTOMER_NAME')?.setValue('');
    this.bookingForm.get('STATUS')?.setValue('');
    this.bookingForm.get('FROM_DATE')?.setValue('');
    this.bookingForm.get('TO_DATE')?.setValue('');

    this.booking.BOOKING_NO = '';
    this.booking.CUSTOMER_NAME = '';
    this.booking.STATUS = '';

    this.getBookingList();
  }

  getBookingList() {
    this.booking.AGENT_CODE = localStorage.getItem('usercode');

    this._bookingService.getBookingList(this.booking).subscribe((res: any) => {
      this.isScroll = false;
      this.bookingList = [];
      if (res.ResponseCode == 200) {
        if (res.Data.length > 0) {
          this.bookingList = res.Data;

          if (this.bookingList?.length >= 4) {
            this.isScroll = true;
          } else {
            this.isScroll = false;
          }
        }
      }
    });
  }

  createCRO(item: any) {
    localStorage.setItem('BOOKING_ID', item.ID);
    localStorage.setItem('BOOKING_NO', item.BOOKING_NO);
    this._router.navigateByUrl('/home/new-cro');
  }
}
