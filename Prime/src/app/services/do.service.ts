import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { DO } from '../models/do';

@Injectable({
  providedIn: 'root'
})
export class DoService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };
  constructor(private _http: HttpClient) {}

  postDODetails(dO:any){
    debugger;
    return this._http.post<any>(
      this.BASE_URL + 'DO/InsertDO',
      dO,
      this.httpOptions
    );
  }

  getDOList(dO: any) {
    return this._http.get<any>(
      this.BASE_URL +
        'DO/GetDOList?AGENT_CODE=' +
        dO.AGENT_CODE,
      this.httpOptions
    );
  }

  // getBookingDetails(dO: dO) {
  //   return this._http.get<any>(
  //     this.BASE_URL +
  //       'Booking/GetBookingDetails?AGENT_CODE=' +
  //       Booking.AGENT_CODE +
  //       '&BOOKING_NO=' +
  //       Booking.BOOKING_NO,
  //     this.httpOptions
  //   );
  // }

}
