import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BOOKING } from 'src/app/models/booking';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
})
export class BookingListComponent implements OnInit {
  booking = new BOOKING();
  bookingList: any[] = [];
  isScroll: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _bookingService: BookingService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.getBookingList();
  }

  getBookingList() {
    var booking = new BOOKING();
    booking.AGENT_CODE = localStorage.getItem('usercode');

    this._bookingService.getBookingList(booking).subscribe((res: any) => {
      this.isScroll = false;
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
