import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, ɵgetDebugNode } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { CONTAINER_MOVEMENT, CONTAINER_TRACKING } from '../models/cm';

@Injectable({
  providedIn: 'root',
})
export class CmService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };

  constructor(private _http: HttpClient) {}

  postContainerMovement(CM: any, fromXL: boolean) {
    return this._http.post<any>(
      this.BASE_URL +
        'ContainerMovement/InsertContainerMovement?fromXL=' +
        fromXL,
      CM,
      this.httpOptions
    );
  }

  //LIST
  getContainerMovement(CM: CONTAINER_MOVEMENT) {
    return this._http.get<any>(
      this.BASE_URL +
        'ContainerMovement/GetContainerMovementList?BOOKING_NO=' +
        CM.BOOKING_NO +
        '&CRO_NO=' +
        CM.CRO_NO,
      this.httpOptions
    );
  }

  // testenc(){
  //  return  this._http.get<any>("http://localhost:44316/WeatherForecast/testenc1");
  // }

  //SINGLE
  getContMov(CM: CONTAINER_MOVEMENT) {
    return this._http.get<any>(
      this.BASE_URL +
        'ContainerMovement/GetContainerMovement?BOOKING_NO=' +
        CM.BOOKING_NO +
        '&CRO_NO=' +
        CM.CRO_NO +
        '&CONTAINER_NO=' +
        CM.CONTAINER_NO,
      this.httpOptions
    );
  }

  updateContMov(CM: any) {
    return this._http.post<any>(
      this.BASE_URL + 'ContainerMovement/UpdateContainerMovement',
      CM,
      this.httpOptions
    );
  }

  uploadContMov(CM: any) {
    return this._http.post<any>(
      this.BASE_URL + 'ContainerMovement/UploadContainerMovement',
      CM,
      this.httpOptions
    );
  }

  isValidContainer(ContainerNo: string) {
    return this._http.post<any>(
      this.BASE_URL +
        'ContainerMovement/ValidContainer?CONTAINER_NO=' +
        ContainerNo,
      this.httpOptions
    );
  }

  //for tracking view
  getContainerMovementBooking(bkNo: any, croNo: any) {
    return this._http.get<any>(
      this.BASE_URL +
        'ContainerMovement/GetContainerMovementBooking?BOOKING_NO=' +
        bkNo +
        '&CRO_NO=' +
        croNo,
      this.httpOptions
    );
  }

  getSingleCM(contNo: any) {
    return this._http.get<any>(
      this.BASE_URL +
        'ContainerMovement/GetSingleContainerMovement?CONTAINER_NO=' +
        contNo,
      this.httpOptions
    );
  }

  //for empty repo
  getCMAvailable(status: any, currentLocation: any) {
    return this._http.get<any>(
      this.BASE_URL +
        'ContainerMovement/GetCMAvailable?STATUS=' +
        status +
        '&CURRENT_LOCATION=' +
        currentLocation,
      this.httpOptions
    );
  }

  getTrackingHistory(contNo: any) {
    return this._http.get<any>(
      this.BASE_URL +
        'ContainerMovement/GetContainerTrackingList?CONTAINER_NO=' +
        contNo,
      this.httpOptions
    );
  }

  postTrackingHistory(ct: CONTAINER_TRACKING) {
    return this._http.post<any>(
      this.BASE_URL + 'ContainerMovement/InsertContainerTracking',
      ct,
      this.httpOptions
    );
  }
}
