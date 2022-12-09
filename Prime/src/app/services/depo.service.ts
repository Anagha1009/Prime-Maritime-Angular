import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Mr, MR_DETAILS } from '../models/mr';

@Injectable({
  providedIn: 'root',
})
export class DepoService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };
  constructor(private _http: HttpClient) {}

  createContainer(depoContainer: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Depo/InsertContainer',
      depoContainer,
      this.httpOptions
    );
  }

  createMRRequest(mrList: any) {
    debugger;
    return this._http.post<any>(
      this.BASE_URL + 'Depo/InsertMRRequest',
      mrList,
      this.httpOptions
    );
  }

  getMRList(mr: Mr) {
    return this._http.get<any>(
      this.BASE_URL + 'Depo/GetMNRList?&OPERATION=' +
      mr.OPERATION +
      '&DEPO_CODE=' + 
      mr.DEPO_CODE,
      this.httpOptions
    );
  }

  getMRDetails(mr_details: MR_DETAILS) {
    debugger;
    return this._http.get<any>(
      this.BASE_URL +
      'Depo/GetMRDetails?MR_NO=' +
      mr_details.MR_NO,
      this.httpOptions
    );
  }

  approveRate(rootobject: any) {
    return this._http.post<any>(this.BASE_URL + 'Depo/ApproveRate', rootobject);
  }

  uploadFiles(file: any, MR_NO:string) {
    debugger
    return this._http.post<any>(this.BASE_URL + 'Depo/UploadMNRFiles?MR_NO=' + MR_NO, file);
  }


}
