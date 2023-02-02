import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { LINER } from '../models/liner';

@Injectable({
  providedIn: 'root',
})
export class LinerService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };

  constructor(private _http: HttpClient) {}

  getLinerList(Liner: LINER) {
    return this._http.get<any>(
      this.BASE_URL +
        'Master/GetLinerList?FROM_DATE=' +
        Liner.FROM_DATE +
        '&TO_DATE=' +
        Liner.TO_DATE +
        (Liner.STATUS != '' ? '&STATUS=' + Liner.STATUS : ''),
      this.httpOptions
    );
  }

  GetLinerDetails(linerID: number) {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetLinerDetails?ID=' + linerID,
      this.httpOptions
    );
  }

  deleteLiner(linerID: number) {
    return this._http.delete<any>(
      this.BASE_URL + 'Master/DeleteLinerList?ID=' + linerID,
      this.httpOptions
    );
  }

  postLiner(liner: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/InsertLiner',
      liner,
      this.httpOptions
    );
  }

  updateliner(liner: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/UpdateLinerList',
      liner,
      this.httpOptions
    );
  }

  getServiceList(liner: LINER) {
    return this._http.get<any>(
      this.BASE_URL +
        'Master/GetServiceList?FROM_DATE=' +
        liner.FROM_DATE +
        '&TO_DATE=' +
        liner.TO_DATE +
        (liner.STATUS != '' ? '&STATUS=' + liner.STATUS : ''),
      this.httpOptions
    );
  }

  postService(linerService: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/InsertService',
      linerService,
      this.httpOptions
    );
  }

  GetServiceDetails(ID: number) {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetServiceDetails?ID=' + ID,
      this.httpOptions
    );
  }

  updateService(linerService: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/UpdateService',
      linerService,
      this.httpOptions
    );
  }

  deleteService(ID: number) {
    return this._http.delete<any>(
      this.BASE_URL + 'Master/DeleteService?ID=' + ID,
      this.httpOptions
    );
  }
}
