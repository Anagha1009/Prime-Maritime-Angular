import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { QUOTATION } from '../models/quotation';

@Injectable({
  providedIn: 'root',
})
export class QuotationService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };

  constructor(private _http: HttpClient) { }

  getData() {
    return this._http.get('https://www.testjsonapi.com/users/');
  }

  getSRRList(quotation: QUOTATION) {
    return this._http.get<any>(
      this.BASE_URL +
      'SRR/GetSRRList?SRR_NO=' +
      quotation.SRR_NO +
      '&CUSTOMER_NAME=' +
      quotation.CUSTOMER_NAME +
      '&STATUS=' +
      quotation.STATUS +
      '&FROMDATE=' +
      quotation.FROMDATE +
      '&TODATE=' +
      quotation.TODATE +
      '&AGENT_CODE=' +
      quotation.AGENT_CODE +
      '&OPERATION=' +
      quotation.OPERATION,
      this.httpOptions
    );
  }

  getSRRDetails(srr: QUOTATION) {
    return this._http.get<any>(
      this.BASE_URL +
      'SRR/GetSRRBySRRNO?SRR_NO=' +
      srr.SRR_NO +
      '&AGENT_CODE=' +
      srr.AGENT_CODE,
      this.httpOptions
    );
  }

  insertSRR(rootobject: any) {
    return this._http.post<any>(
      this.BASE_URL + 'SRR/InsertSRR',
      rootobject,
      this.httpOptions
    );
  }

  insertContainer(rootobject: any) {
    return this._http.post<any>(
      this.BASE_URL + 'SRR/InsertContainer',
      rootobject,
      this.httpOptions
    );
  }

  booking(rootobject: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Booking/InsertBooking',
      rootobject,
      this.httpOptions
    );
  }

  uploadFiles(file: any, srrNo: string) {
    return this._http.post<any>(this.BASE_URL + 'SRR/UploadFiles?SRR_NO=' + srrNo, file);
  }

  approveRate(rootobject: any) {
    return this._http.post<any>(this.BASE_URL + 'SRR/ApproveRate', rootobject);
  }

  counterRate(rootobject: any) {
    return this._http.post<any>(this.BASE_URL + 'SRR/CounterRate', rootobject);
  }

  GetFiles(SRR_NO:string, COMM_TYPE: any) {
    return this._http.get<any>(this.BASE_URL + 'SRR/GetSRRFiles?SRR_NO=' + SRR_NO + '&COMM_TYPE='+ COMM_TYPE);
  }
}
