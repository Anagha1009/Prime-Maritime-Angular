import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { VESSEL } from '../models/vessel';

@Injectable({
  providedIn: 'root'
})
export class VesselService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };

  constructor(private _http: HttpClient) { }

  getVesselList(vesselmaster:VESSEL) {
    return this._http.get<any>(
      this.BASE_URL +
        'Master/GetVesselMasterList?CREATED_BY=' +
        vesselmaster.CREATED_BY,
      this.httpOptions
    );
  }

  postVessel(vessel: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/InsertVesselMaster',
      vessel,
      this.httpOptions
    );
  }

  
  getVesselDetails(vessel:VESSEL) {
    return this._http.get<any>(
      this.BASE_URL +
        'Master/GetVesselMasterDetails?CREATED_BY=' +
        vessel.CREATED_BY +
        '&ID=' +
        vessel.ID,
      this.httpOptions
    );
  }
  UpdateVesselMaster(vessel:any){
    debugger
    return this._http.post<any>(
      this.BASE_URL+ 'Master/UpdateVesselMasterList',
      vessel,
      this.httpOptions
    );
  }

  DeleteVesselMaster(vessel:VESSEL){
    debugger
    return this._http.delete<any>(
      this.BASE_URL+
      'Master/DeleteVesselMasterList?CREATED_BY=' +
      vessel.CREATED_BY +
      '&ID=' +
      vessel.ID,
      this.httpOptions
    );
  }

}
