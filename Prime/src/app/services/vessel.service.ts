import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { SCHEDULE, VESSEL } from '../models/vessel';

@Injectable({
  providedIn: 'root',
})
export class VesselService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };

  constructor(private _http: HttpClient) {}

  getVesselList(vessel: VESSEL) {
    return this._http.get<any>(
      this.BASE_URL +
        'Master/GetVesselMasterList?VESSEL_NAME=' +
        vessel.VESSEL_NAME +
        '&IMO_NO=' +
        vessel.IMO_NO +
        '&STATUS=' +
        vessel.STATUS +
        '&FROM_DATE=' +
        vessel.FROM_DATE +
        '&TO_DATE=' +
        vessel.TO_DATE,
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

  getVesselDetails(ID: number) {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetVesselMasterDetails?ID=' + ID,
      this.httpOptions
    );
  }

  UpdateVesselMaster(vessel: any) {
    debugger;
    return this._http.post<any>(
      this.BASE_URL + 'Master/UpdateVesselMasterList',
      vessel,
      this.httpOptions
    );
  }

  DeleteVesselMaster(ID: number) {
    return this._http.delete<any>(
      this.BASE_URL + 'Master/DeleteVesselMasterList?ID=' + ID,
      this.httpOptions
    );
  }

  getScheduleList(schedule: SCHEDULE) {
    return this._http.get<any>(
      this.BASE_URL +
        'Master/GetScheduleList?VESSEL_NAME=' +
        schedule.VESSEL_NAME +
        '&PORT_CODE=' +
        schedule.PORT_CODE +
        '&ETA=' +
        schedule.ETA +
        '&ETD=' +
        schedule.ETD +
        (schedule.STATUS != '' ? '&STATUS=' + schedule.STATUS : ''),
      this.httpOptions
    );
  }

  GetScheduleDetails(ID: number) {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetScheduleDetails?ID=' + ID,
      this.httpOptions
    );
  }

  postSchedule(schedule: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/InsertSchedule',
      schedule,
      this.httpOptions
    );
  }
  updateSchedule(schedule: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/UpdateSchedule',
      schedule,
      this.httpOptions
    );
  }
  deleteSchedule(ID: number) {
    return this._http.delete<any>(
      this.BASE_URL + 'Master/DeleteSchedule?ID=' + ID,
      this.httpOptions
    );
  }
}
