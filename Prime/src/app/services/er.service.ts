import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ErService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };
  constructor(private _http: HttpClient) {}

  postERDetails(ER:any){
    debugger;
    return this._http.post<any>(
      this.BASE_URL + 'ER/InsertER',
      ER,
      this.httpOptions
    );
  }

  getERList(ER: any) {
    return this._http.get<any>(
      this.BASE_URL +
        'ER/GetERList?AGENT_CODE=' +
        ER.AGENT_CODE,
      this.httpOptions
    );
  }

  getERDetails(ER: any) {
    return this._http.get<any>(
      this.BASE_URL +
        'ER/GetERDetails?ER_NO=' +
        ER.DO_NO+
        '&AGENT_CODE='+
        ER.AGENT_CODE,
      this.httpOptions
    );
  }


  
}
