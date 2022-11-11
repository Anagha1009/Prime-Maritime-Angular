import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { DO } from '../models/do';

@Injectable({
  providedIn: 'root'
})
export class DoService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };
  constructor(private _http: HttpClient) {}

  postDODetails(dO:any){
    debugger;
    return this._http.post<any>(
      this.BASE_URL + 'DO/InsertDO',
      dO,
      this.httpOptions
    );
  }

  getDOList(dO: DO) {
    return this._http.get<any>(
      this.BASE_URL +
        'DO/GetDOList?OPERATION=' +
        dO.OPERATION +
        '&DO_NO='+
        dO.DO_NO+
        '&DO_DATE='+
        dO.DO_DATE+
        '&DO_VALIDITY='+
        dO.DO_VALIDITY+
        '&AGENT_CODE='+
        dO.AGENT_CODE,
      this.httpOptions
    );
  }

  getDODetails(dO: any) {
    return this._http.get<any>(
      this.BASE_URL +
        'DO/GetDODetails?DO_NO=' +
        dO.DO_NO+
        '&AGENT_CODE='+
        dO.AGENT_CODE,
      this.httpOptions
    );
  }

}