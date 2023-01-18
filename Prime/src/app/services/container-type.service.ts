import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { TYPE } from '../models/type';

@Injectable({
  providedIn: 'root',
})
export class ContainerTypeService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };
  constructor(private _http: HttpClient) {}

  GetContainerTypeMasterList(typemaster: TYPE) {
    return this._http.get<any>(
      this.BASE_URL +
        'Master/GetContainerTypeMasterList?CREATED_BY=' +
        typemaster.CREATED_BY,
      this.httpOptions
    );
  }

  postContainerType(type: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/InsertContainerTypeMaster',
      type,
      this.httpOptions
    );
  }

  GetContainerTypeDetails(ID: number) {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetContainerTypeMasterDetails?ID=' + ID,
      this.httpOptions
    );
  }

  updateContainerType(type: any) {
    debugger;
    return this._http.post<any>(
      this.BASE_URL + 'Master/UpdateConatinerTypeMaster',
      type,
      this.httpOptions
    );
  }
  DeleteContainerType(ID: number) {
    debugger;
    return this._http.delete<any>(
      this.BASE_URL + 'Master/DeleteContainerTypeMaster?ID=' + ID,
      this.httpOptions
    );
  }
}
