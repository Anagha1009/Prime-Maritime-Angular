import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BOOKING } from 'src/app/models/booking';
import { BookingService } from 'src/app/services/booking.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-pm-booking-list',
  templateUrl: './pm-booking-list.component.html',
  styleUrls: ['./pm-booking-list.component.scss'],
})
export class PmBookingListComponent implements OnInit {
  filterForm: FormGroup;
  bookingList: any[] = [];
  booking: BOOKING = new BOOKING();
  isLoading: boolean = false;
  isLoading1: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.filterForm = this._formBuilder.group({
      BOOKING_NO: [''],
      CUSTOMER_NAME: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.getBookingList();
  }

  Search() {
    var BOOKING_NO = this.filterForm.value.BOOKING_NO;
    var FROM_DATE = this.filterForm.value.FROM_DATE;
    var TO_DATE = this.filterForm.value.TO_DATE;

    if (BOOKING_NO == '' && FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.booking.BOOKING_NO = BOOKING_NO;
    this.booking.FROM_DATE = FROM_DATE;
    this.booking.TO_DATE = TO_DATE;
    this.isLoading = true;
    this.getBookingList();
  }

  Clear() {
    this.filterForm.get('BOOKING_NO')?.setValue('');
    this.filterForm.get('FROM_DATE')?.setValue('');
    this.filterForm.get('TO_DATE')?.setValue('');

    this.booking.BOOKING_NO = '';
    this.booking.FROM_DATE = '';
    this.booking.TO_DATE = '';
    this.isLoading1 = true;
    this.getBookingList();
  }

  getBookingList() {
    this._commonService.destroyDT();
    this._bookingService
      .getBookingListPM(this.booking)
      .subscribe((res: any) => {
        this.bookingList = [];
        this.isLoading = false;
        this.isLoading1 = false;
        if (res.ResponseCode == 200) {
          if (res.Data.length > 0) {
            this.bookingList = res.Data;
          }
        }
        this._commonService.getDT();
      });
  }
}
