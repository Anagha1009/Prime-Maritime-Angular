import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Bl } from '../models/bl';

@Injectable({
  providedIn: 'root',
})
export class BlService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };
  constructor(private _http: HttpClient) {}

  getContainerList(BL: Bl) {
    return this._http.get<any>(
      this.BASE_URL +
        'BL/GetContainerList?AGENT_CODE=' +
        BL.AGENT_CODE +
        '&BOOKING_NO=' +
        BL.BOOKING_NO +
        '&CRO_NO=' +
        BL.CRO_NO +
        '&BL_NO='+
        BL.BL_NO,
      this.httpOptions
    );
  }
}
