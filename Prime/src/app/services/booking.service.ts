import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { BOOKING, SLOTS } from '../models/booking';
import { DETENTION } from '../models/detention';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  getDetentionList(detention: DETENTION) {
    throw new Error('Method not implemented.');
  }
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
        Booking.BOOKING_NO +
        '&FROM_DATE=' +
        Booking.FROM_DATE +
        '&TO_DATE=' +
        Booking.TO_DATE +
        '&ORG_CODE=' +
        Booking.ORG_CODE +
        '&PORT=' +
        Booking.PORT,
      this.httpOptions
    );
  }

  getBookingListPM(Booking: BOOKING) {
    return this._http.get<any>(
      this.BASE_URL +
        'Booking/GetBookingListPM?BOOKING_NO=' +
        Booking.BOOKING_NO +
        '&FROM_DATE=' +
        Booking.FROM_DATE +
        '&TO_DATE=' +
        Booking.TO_DATE,
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

  postBookingDetails(Booking: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Booking/InsertBooking',
      Booking,
      this.httpOptions
    );
  }

  insertVoyage(Voyage: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Booking/InsertVoyage',
      Voyage,
      this.httpOptions
    );
  }

  getTrackingDetail(BookingNo: string) {
    return this._http.get<any>(
      this.BASE_URL + 'Booking/GetTrackingDetail?BOOKING_NO=' + BookingNo,
      this.httpOptions
    );
  }

  getRollOverList(booking: any) {
    return this._http.get<any>(
      this.BASE_URL +
        'Booking/GetRolloverList?AGENT_CODE=' +
        booking.AGENT_CODE,
      this.httpOptions
    );
  }
}
