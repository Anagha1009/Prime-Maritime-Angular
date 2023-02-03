import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { MASTER } from '../models/master';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };

  constructor(private _http: HttpClient) {}

  GetMasterList(master: MASTER) {
    return this._http.get<any>(
      this.BASE_URL +
        'Master/GetMasterList?key=' +
        master.KEY_NAME +
        '&FROM_DATE=' +
        master.FROM_DATE +
        '&TO_DATE=' +
        master.TO_DATE +
        '&STATUS=' +
        master.STATUS,
      this.httpOptions
    );
  }

  InsertMaster(type: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/InsertMaster',
      type,
      this.httpOptions
    );
  }

  GetMasterDetails(ID: number) {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetMasterDetails?ID=' + ID,
      this.httpOptions
    );
  }

  UpdateMaster(master: any) {
    debugger;
    return this._http.post<any>(
      this.BASE_URL + 'Master/UpdateMaster',
      master,
      this.httpOptions
    );
  }

  DeleteMaster(ID: number) {
    debugger;
    return this._http.delete<any>(
      this.BASE_URL + 'Master/DeleteMaster?ID=' + ID,
      this.httpOptions
    );
  }

  getMstICD() {
    debugger;
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetMstICD',
      this.httpOptions
    );
  }

  getMstDEPO() {
    debugger;
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetMstDEPO',
      this.httpOptions
    );
  }

  getCP() {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetClearingPartyList',
      this.httpOptions
    );
  }

  postCP(cp: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/InsertCP',
      cp,
      this.httpOptions
    );
  }
}
