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

  postERDetails(ER:any,isVessel:boolean){
    debugger;
    return this._http.post<any>(
      this.BASE_URL + 'ER/InsertER?isVessel='+
      isVessel,
      ER,
      this.httpOptions
    );
  }

  getERList(agentCode:any,depoCode:any) {
    return this._http.get<any>(
      this.BASE_URL +
        'ER/GetERList?AGENT_CODE=' +
        agentCode+
        '&DEPO_CODE='+
        depoCode,
      this.httpOptions
    );
  }

  getERDetails(erNo:any,agentCode:any,depoCode:any) {
    return this._http.get<any>(
      this.BASE_URL +
        'ER/GetERDetails?REPO_NO=' +
        erNo+
        '&AGENT_CODE='+
        agentCode+
        '&DEPO_CODE='+
        depoCode,
      this.httpOptions
    );
  }

  getERContainerDetails(erNo:any,agentCode:any,depoCode:any) {
    return this._http.get<any>(
      this.BASE_URL +
        'ER/GetERContainerDetails?REPO_NO=' +
        erNo+
        '&AGENT_CODE='+
        agentCode+
        '&DEPO_CODE='+
        depoCode,
      this.httpOptions
    );
  }


  
}
