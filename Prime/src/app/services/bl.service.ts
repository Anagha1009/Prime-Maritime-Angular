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
        '&BL_NO=' +
        BL.BL_NO +
        '&DO_NO=' +
        BL.DO_NO +
        '&fromDO=' +
        BL.fromDO +
        '&DEPO_CODE=' +
        BL.DEPO_CODE,
      this.httpOptions
    );
  }

  getBLDetails(BL: Bl) {
    return this._http.get<any>(
      this.BASE_URL +
        'BL/GetBLDetails?AGENT_CODE=' +
        BL.AGENT_CODE +
        '&BOOKING_NO=' +
        BL.BOOKING_NO +
        '&BL_NO=' +
        BL.BL_NO,
      this.httpOptions
    );
  }

  getSRRDetails(BL: Bl) {
    return this._http.get<any>(
      this.BASE_URL +
        'BL/GetSRRDetails?AGENT_CODE=' +
        BL.AGENT_CODE +
        '&BOOKING_NO=' +
        BL.BOOKING_NO +
        '&BL_NO=' +
        BL.BL_NO,
      this.httpOptions
    );
  }

  createBL(bl: any) {
    return this._http.post<any>(
      this.BASE_URL + 'BL/InsertBL',
      bl,
      this.httpOptions
    );
  }

  icici() {
    return this._http.post<any>(
      'https://apic.nlpmuat.com/nlpm/sandbox/customer-verification-api/',
      '{"corpId": "HCCL","userId": "SOOD","customerId": "502432824"}'
    );
  }
}
