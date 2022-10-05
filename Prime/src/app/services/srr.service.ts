import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

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

  getSRRList(SRR_NO, CUSTOMER_NAME, STATUS) {
    return this._http.get<any>(
      this.BASE_URL +
        'SRR/GetSRRList?SRR_NO=' +
        SRR_NO +
        '&CUSTOMER_NAME=' +
        CUSTOMER_NAME +
        '&STATUS=' +
        STATUS,
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
      this.BASE_URL + 'SRR/InsertSRR',
      rootobject,
      this.httpOptions
    );
  }

  uploadFiles(file) {
    return this._http.post<any>(this.BASE_URL + 'SRR/UploadFiles', file);
  }
}
