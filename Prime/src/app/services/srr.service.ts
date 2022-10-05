import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { QUOTATION } from '../models/quotation';

@Injectable({
  providedIn: 'root',
})
export class SRRService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };
  constructor(private _http: HttpClient) {}

  getSRRList(quotation: QUOTATION) {
    return this._http.get<any>(
      this.BASE_URL +
        'SRR/GetSRRList?SRR_NO=' +
        quotation.SRR_NO +
        '&CUSTOMER_NAME=' +
        quotation.CUSTOMER_NAME +
        '&STATUS=' +
        quotation.STATUS +
        '&AGENT_CODE=' +
        quotation.AGENT_CODE,
      this.httpOptions
    );
  }

  getSRRDetails(SRR_NO) {
    return this._http.get<any>(
      this.BASE_URL + 'SRR/GetSRRBySRRNO?SRR_NO=' + SRR_NO,
      this.httpOptions
    );
  }

  insertSRR(rootobject) {
    return this._http.post<any>(
      this.BASE_URL + 'SRR/InsertSRR',
      rootobject,
      this.httpOptions
    );
  }

  insertContainer(rootobject) {
    return this._http.post<any>(
      this.BASE_URL + 'SRR/InsertContainer',
      rootobject,
      this.httpOptions
    );
  }

  uploadFiles(file) {
    return this._http.post<any>(this.BASE_URL + 'SRR/UploadFiles', file);
  }
}
