import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { LOADLIST } from '../models/loadlist';

@Injectable({
  providedIn: 'root'
})
export class LoadListService {
  BASE_URL=environment.BASE_URL;
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };
  constructor(private _http:HttpClient) { }

  GetLoadList(loadlistmaster:LOADLIST) {
    return this._http.get<any>(
      this.BASE_URL +
        'Loadlist/GetLoadList?VESSEL_NAME=' +
        loadlistmaster.VESSEL_NAME +
        '&VOYAGE_NO='+
        loadlistmaster.VOYAGE_NO ,
      this.httpOptions
    );
  }
}
