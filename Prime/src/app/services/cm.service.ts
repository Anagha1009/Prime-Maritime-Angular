import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, ɵgetDebugNode } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { CONTAINER_MOVEMENT } from '../models/cm';

@Injectable({
  providedIn: 'root'
})
export class CmService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };
  constructor(private _http: HttpClient) {}

  postContainerMovement(CM:any,fromXL:boolean){
    debugger;
    return this._http.post<any>(
      this.BASE_URL + 'ContainerMovement/InsertContainerMovement?fromXL='+
      fromXL,
      CM,
      this.httpOptions
    );
  }

  getContainerMovement(CM:CONTAINER_MOVEMENT){
    debugger;
    return this._http.get<any>(
      this.BASE_URL +
        'ContainerMovement/GetContainerMovementList?AGENT_CODE=' +
        CM.AGENT_CODE +
        '&DEPO_CODE=' +
        CM.DEPO_CODE +
        '&BOOKING_NO=' +
        CM.BOOKING_NO +
        '&CRO_NO='+
        CM.CRO_NO+
        '&CONTAINER_NO='+
        CM.CONTAINER_NO,
      this.httpOptions
    );
  
  }

  //for tracking view
  getContainerMovementBooking(bkNo:any,croNo:any){
    debugger;
    return this._http.get<any>(
      this.BASE_URL +
        'ContainerMovement/GetContainerMovementBooking?BOOKING_NO=' +
        bkNo +
        '&CRO_NO='+
        croNo,
      this.httpOptions
    );
  
  }

  getSingleCM(contNo:any){
    debugger;
    return this._http.get<any>(
      this.BASE_URL+
      'ContainerMovement/GetSingleContainerMovement?CONTAINER_NO='+
      contNo,
      this.httpOptions
    );
  }

  getTrackingHistory(contNo:any){
    return this._http.get<any>(
      this.BASE_URL+
      'ContainerMovement/GetContainerTrackingList?CONTAINER_NO='+
      contNo,
      this.httpOptions
    );
  }


}
