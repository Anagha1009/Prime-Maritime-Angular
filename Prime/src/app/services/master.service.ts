import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { MASTER } from '../models/master';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };

  constructor(private _http: HttpClient) { }

  GetMasterList(master:MASTER){
    return this._http.get<any>(
      this.BASE_URL +
      'Common/GetDropdownData?KEY_NAME=' +
        master.KEY_NAME,
      this.httpOptions
    );
  }

  InsertMaster(type: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/InsertServiceTypeMaster',
      type,
      this.httpOptions
    );
  }

  GetMasterDetails(master: MASTER) {
    return this._http.get<any>(
      this.BASE_URL +
        'Master/GetServiceTypeMasterDetails?CREATED_BY=' +
        master.CREATED_BY +
        '&CODE=' +
        master.CODE,
      this.httpOptions
    );
  }

  UpdateMaster(master:any){
    debugger
    return this._http.post<any>(
      this.BASE_URL+ 'Master/UpdateServiceTypeMaster',
      master,
      this.httpOptions
    );
  }

  DeleteMaster(master:MASTER){
    debugger
    return this._http.delete<any>(
      this.BASE_URL+
      'Master/DeleteServiceTypeMaster?CODE='+ master.CODE,this.httpOptions
    );
  }
}
