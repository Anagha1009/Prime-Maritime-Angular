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
  constructor(private _http: HttpClient) { }

  createContainer(depoContainer: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Depo/InsertContainer',
      depoContainer,
      this.httpOptions
    );
  }

  createMRRequest(mrList: any) {
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
    return this._http.get<any>(
      this.BASE_URL +
      'Depo/GetMRDetails?MR_NO=' +
      mr_details.MR_NO +
      '&OPERATION=' +
      mr_details.OPERATION,
      this.httpOptions
    );
  }

  approveRate(rootobject: any) {
    return this._http.post<any>(this.BASE_URL + 'Depo/ApproveRate', rootobject);
  }

  uploadFiles(file: any, MR_NO: string) {
    return this._http.post<any>(this.BASE_URL + 'Depo/UploadMNRFiles?MR_NO=' + MR_NO, file);
  }

  createNewMRRequest(mrList: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Depo/InsertNewMRRequest',
      mrList,
      this.httpOptions
    );
  }

  DeleteMRRequest(mrNo: string, location: string) {
    return this._http.post<any>(
      this.BASE_URL + 'Depo/DeleteMRequest?MR_NO=' +
      mrNo +
      '&LOCATION=' +
      location,
      this.httpOptions
    );
  }

  GetFiles(mrNo: string) {
    return this._http.get<any>(this.BASE_URL + 'Depo/GetImage?MR_NO=' + mrNo,
    this.httpOptions);
  }

}
