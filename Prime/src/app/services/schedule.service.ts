import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { SCHEDULE } from '../models/schedule';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  BASE_URL=environment.BASE_URL

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };

  constructor(private _http:HttpClient) { }


  getScheduleList() {
    return this._http.get<any>(
      this.BASE_URL +
    'Master/GetScheduleList' ,
      this.httpOptions
    );
  }

  GetScheduleDetails(schedule:SCHEDULE) {

    return this._http.get<any>(
      this.BASE_URL +
        'Master/GetScheduleDetails?ID=' +
        schedule.ID +
        '&ID=' +
        schedule.ID,
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
  updateSchedule(schedule:any){
    return this._http.post<any>(
      this.BASE_URL+
      'Master/UpdateLinerList',
      schedule,
      this.httpOptions
    );
  }
  deleteSchedule(ID:number){
  
    return this._http.delete<any>(
      this.BASE_URL+
      'Master/DeleteSchedule?ID=' +
      ID ,
      this.httpOptions
    );
  }

}
