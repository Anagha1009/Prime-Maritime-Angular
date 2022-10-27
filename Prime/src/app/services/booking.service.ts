import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { BOOKING, SLOTS } from '../models/booking';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };
  constructor(private _http: HttpClient) {}

  getBookingList(Booking: BOOKING) {
    return this._http.get<any>(
      this.BASE_URL +
        'Booking/GetBookingList?AGENT_CODE=' +
        Booking.AGENT_CODE +
        '&BOOKING_NO=' +
        Booking.BOOKING_NO,
      this.httpOptions
    );
  }

  getBookingDetails(Booking: BOOKING) {
    return this._http.get<any>(
      this.BASE_URL +
        'Booking/GetBookingDetails?AGENT_CODE=' +
        Booking.AGENT_CODE +
        '&BOOKING_NO=' +
        Booking.BOOKING_NO,
      this.httpOptions
    );
  }

  validateSlots(Slots: SLOTS) {
    return this._http.get<any>(
      this.BASE_URL +
        'Booking/ValidateSlots?SRR_NO=' +
        Slots.SRR_NO +
        '&NO_OF_SLOTS=' +
        Slots.NO_OF_SLOTS,
      this.httpOptions
    );
  }
}