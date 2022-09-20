import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class SrrService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    }),
  };

  constructor(private _http: HttpClient) {}

  getSRRList() {
    return this._http.get<any>(
      this.BASE_URL + 'SRR/GetSRRList',
      this.httpOptions
    );
  }

  getSRRDetails(SRR_NO) {
    return this._http.get<any>(
      this.BASE_URL + 'SRR?SRR_NO=' + SRR_NO,
      this.httpOptions
    );
  }
}
