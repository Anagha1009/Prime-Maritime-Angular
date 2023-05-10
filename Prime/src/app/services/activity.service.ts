import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };

  constructor(private _http: HttpClient) {}

  getActivityList() {
    return this._http.get<any>(
      this.BASE_URL + 'Activity/GetActivityList',
      this.httpOptions
    );
  }

  postActivityMapping(activityMapping: any) {
    return this._http.post<any>(
      this.BASE_URL + 'ActivityMapping/InsertActivityMapping',
      activityMapping,
      this.httpOptions
    );
  }

  getActivityByCode(actCode: any) {
    return this._http.get<any>(
      this.BASE_URL + 'Activity/GetActivityDetailsByCode?ACT_CODE=' + actCode,
      this.httpOptions
    );
  }

  getMappingById(actId: any) {
    return this._http.get<any>(
      this.BASE_URL + 'Activity/GetActivityMappingDetailsByID?ACT_ID=' + actId,
      this.httpOptions
    );
  }
}
