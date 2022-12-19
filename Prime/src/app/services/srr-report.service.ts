import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SrrReportService {

  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };
  
  constructor(private _http: HttpClient) { }


  getSRRCountList() {
    return this._http.get<any>(
      this.BASE_URL + 'SRRReport/GetSRRCountList',
      this.httpOptions
    );
  }

}
