import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BOOKING } from 'src/app/models/quotation';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss'],
})
export class BookingListComponent implements OnInit {
  bookingForm: FormGroup;
  isScroll: boolean = false;
  bookingList: any[] = [];

  constructor(
    private FormBuilder: FormBuilder,
    private _bookingService: BookingService,
    private router: Router
  ) {}

  @ViewChild('closeBtn3') closeBtn3: ElementRef;

  ngOnInit(): void {
    this.bookingForm = this.FormBuilder.group({
      BOOKING_NO: [''],
      CUSTOMER_NAME: [''],
      STATUS: [''],
    });

    this.getBookingList();
  }

  getBookingList() {
    var booking = new BOOKING();
    booking.AGENT_CODE = +localStorage.getItem('rolecode');

    this._bookingService.getBookingList(booking).subscribe((res) => {
      if (res.ResponseCode == 200) {
        if (res.Data.length > 0) {
          this.bookingList = res.Data;
        }
      }
    });
  }

  createCRO(item) {
    localStorage.setItem('BOOKING_ID', item.BOOKING_ID);
    localStorage.setItem('BOOKING_NO', item.BOOKING_NO);
    this.router.navigateByUrl('/home/new-cro');
  }

  closeModal(): void {
    this.closeBtn3.nativeElement.click();
  }

  redirectToSubMenu(p) {
    this.closeModal();
    if (p == 'cro') {
      this.router.navigateByUrl('/home/cro-list');
    } else if (p == 'booking') {
      this.router.navigateByUrl('/home/bookings');
    }
  }
}
