import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { CRO } from '../models/cro';

@Injectable({
  providedIn: 'root',
})
export class CroService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };

  constructor(private _http: HttpClient) {}

  insertCRO(rootobject: any) {
    return this._http.post<any>(
      this.BASE_URL + 'CRO/InsertCRO',
      rootobject,
      this.httpOptions
    );
  }

  getCROList(cro: CRO) {
    return this._http.get<any>(
      this.BASE_URL +
        'CRO/GetCROList?AGENT_CODE=' +
        cro.AGENT_CODE +
        '&FROM_DATE=' +
        cro.FROM_DATE +
        '&TO_DATE=' +
        cro.TO_DATE +
        '&CRO_NO=' +
        cro.CRO_NO,
      this.httpOptions
    );
  }

  getCROListPM(cro: CRO) {
    return this._http.get<any>(
      this.BASE_URL +
        'CRO/GetCROListPM?FROM_DATE=' +
        cro.FROM_DATE +
        '&TO_DATE=' +
        cro.TO_DATE +
        '&CRO_NO=' +
        cro.CRO_NO,
      this.httpOptions
    );
  }

  getCRODetails(cro: CRO) {
    return this._http.get<any>(
      this.BASE_URL +
        'CRO/GetCRODetails?AGENT_CODE=' +
        cro.AGENT_CODE +
        '&CRO_NO=' +
        cro.CRO_NO,
      this.httpOptions
    );
  }
}
