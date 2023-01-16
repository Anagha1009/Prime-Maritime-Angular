import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { LINER } from '../models/liner';
import { LINERSERVICE } from '../models/linerservice';

@Injectable({
  providedIn: 'root'
})
export class LinerService {
  BASE_URL=environment.BASE_URL

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };

  constructor(private _http:HttpClient) { }

  getLinerList() {
    return this._http.get<any>(
      this.BASE_URL +
    'Master/GetLinerList' ,
      this.httpOptions
    );
  }

  GetLinerDetails(liner:LINER) {

    return this._http.get<any>(
      this.BASE_URL +
        'Master/GetLinerDetails?ID=' +
        liner.ID +
        '&ID=' +
        liner.ID,
      this.httpOptions
    );
  }
  deleteLiner(liner:LINER){
  
    return this._http.delete<any>(
      this.BASE_URL+
      'Master/DeleteLinerList?ID=' +
      liner.ID ,
      this.httpOptions
    );
  }




  postLiner(liner: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/InsertLiner',
      liner,
      this.httpOptions
    );
  }

  // updateContainerMaster(container: any) {

  //   return this._http.post<any>(
  //     this.BASE_URL + 'Master/UpdateContainerMasterList',
  //     container,
  //     this.httpOptions
  //   );
  // }
  updateliner(liner:any){
    return this._http.post<any>(
      this.BASE_URL+
      'Master/UpdateLinerList',
      liner,
      this.httpOptions
    );
  }

  getServiceList() {
    return this._http.get<any>(
      this.BASE_URL +
    'Master/GetServiceList' ,
      this.httpOptions
    );
  }

  postService(linerService: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/InsertService',
      linerService,
      this.httpOptions
    );
  }

  GetServiceDetails(linerService:LINERSERVICE) {

    return this._http.get<any>(
      this.BASE_URL +
        'Master/GetServiceDetails?ID=' +
        linerService.ID +
        '&ID=' +
        linerService.ID,
      this.httpOptions
    );
  }


  updateService(linerService:any){
    return this._http.post<any>(
      this.BASE_URL+
      'Master/UpdateService',
      linerService,
      this.httpOptions
    );
  }

  deleteService(linerService:LINERSERVICE){
  
    return this._http.delete<any>(
      this.BASE_URL+
      'Master/DeleteService?ID=' +
      linerService.ID ,
      this.httpOptions
    );
  }


}
