import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { CONTAINER } from '../models/container';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };

  constructor(private _http: HttpClient) { }

  GetContainerMasterList(containermaster: CONTAINER) {
    return this._http.get<any>(
      this.BASE_URL +
      'Master/GetContainerMasterList?CONTAINER_NO=' +
      containermaster.CONTAINER_NO,
      this.httpOptions
    );
  }
  postContainer(container: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/InsertContainerMaster',
      container,
      this.httpOptions
    );
  }

  GetContainerMasterDetails(container: CONTAINER) {
    debugger
    return this._http.get<any>(
      this.BASE_URL +
      'Master/GetContainerMasterDetails?&ID=' +
      container.ID +
      '&CONTAINER_NO=' +
      container.CONTAINER_NO,
      this.httpOptions
    );
  }

  updateContainerMaster(container: any) {

    return this._http.post<any>(
      this.BASE_URL + 'Master/UpdateContainerMasterList',
      container,
      this.httpOptions
    );
  }

  deleteContainerMaster(ID: number) {
    debugger
    return this._http.delete<any>(
      this.BASE_URL +
      'Master/DeleteContainerMasterList?ID=' +
       ID, 
       this.httpOptions
    );
  }
}
