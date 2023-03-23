import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Bl } from '../models/bl';
import { CARGO_MANIFEST } from '../models/manifest';

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

  updateBL(bl: any) {
    return this._http.post<any>(
      this.BASE_URL + 'BL/UpdateBL',
      bl,
      this.httpOptions
    );
  }

  getCargoManifestList(BL: CARGO_MANIFEST) {
    return this._http.get<any>(
      this.BASE_URL +
        'BL/GetCargoManifestList?AGENT_CODE=' +
        BL.AGENT_CODE +
        '&VESSEL_NAME=' +
        BL.VESSEL_NAME +
        '&VOYAGE_NO=' +
        BL.VOYAGE_NO,
      this.httpOptions
    );
  }

  getBLHistory(agentCode: any) {
    return this._http.get<any>(
      this.BASE_URL + 'BL/GetBLHistory?AGENT_CODE=' + agentCode,
      this.httpOptions
    );
  }

  getinvoiceDetails(BL: Bl) {
    return this._http.get<any>(
      this.BASE_URL +
        'SRR/GetInvoiceDetails?INVOICE_NO=' +
        BL.INVOICE_NO +
        '&CONTAINER_TYPE=' +
        BL.CONTAINER_TYPE,
      this.httpOptions
    );
  }

  getinvoiceList(BL: Bl) {
    return this._http.get<any>(
      this.BASE_URL +
        'SRR/GetInvoiceList?INVOICE_NO=' +
        BL.INVOICE_NO +
        '&FROM_DATE=' +
        BL.FROM_DATE +
        '&TO_DATE=' +
        BL.TO_DATE +
        '&AGENT_CODE=' +
        BL.AGENT_CODE,
      this.httpOptions
    );
  }

  createInvoice(bl: any) {
    return this._http.post<any>(
      this.BASE_URL + 'SRR/InsertInvoice',
      bl,
      this.httpOptions
    );
  }
}
