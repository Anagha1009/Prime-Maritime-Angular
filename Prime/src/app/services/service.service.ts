import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { SERVICEMASTER } from '../models/servicemaster';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };

  constructor(private _http: HttpClient) {}

  InsertMaster(type: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/InsertServiceMaster',
      type,
      this.httpOptions
    );
  }

  GetAllServiceList() {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetServiceMasterList',
      this.httpOptions
    );
  }

  GetMasterDetails(ID: any) {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetServiceMasterDetails?ID=' + ID,
      this.httpOptions
    );
  }

  UpdateServiceMaster(service: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/UpdateServiceMasterList',
      service,
      this.httpOptions
    );
  }

  DeleteMaster(ID: number) {
    return this._http.delete<any>(
      this.BASE_URL + 'Master/DeleteServiceMasterList?ID=' + ID,
      this.httpOptions
    );
  }
}
