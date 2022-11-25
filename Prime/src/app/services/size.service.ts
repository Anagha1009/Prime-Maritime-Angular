import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { CONTAINER } from '../models/container';
import { SIZE } from '../models/size';

@Injectable({
  providedIn: 'root'
})
export class SizeService {
 
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };
  
  constructor(private _http: HttpClient) { }


  GetcontainerSizeList(containersizemaster:SIZE) {
    return this._http.get<any>(
      this.BASE_URL +
        'Master/GetContainerSizeList?ID=' +
        containersizemaster.ID,
      this.httpOptions
    );
  }

  postContainerSize(containerSize: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/InsertContainerSize',
      containerSize,
      this.httpOptions
    );
  }

  GetContainerSizeDetails(size:SIZE) {
    return this._http.get<any>(
      this.BASE_URL +
        'Master/GetContainerSizeDetails?CREATED_BY=' +
        size.CREATED_BY +
        '&ID=' +
        size.ID,
      this.httpOptions
    );
  }

  UpdateContainerSize(size:any){
    
    return this._http.post<any>(
      this.BASE_URL+ 'Master/UpdateContainerSizeList',
      size,
      this.httpOptions
    );
  }

  DeleteContainerSize(size:SIZE){
    debugger
    return this._http.delete<any>(
      this.BASE_URL+
      'Master/DeleteContainerSizeList?ID='+ size.ID,this.httpOptions
    );
  }


}
