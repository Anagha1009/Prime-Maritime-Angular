import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Location } from '../models/location';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };

  constructor(private _http: HttpClient) {}

  postLocation(location: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/InsertLocationMaster',
      location,
      this.httpOptions
    );
  }

  GetLocationMasterList(loc: Location) {
    return this._http.get<any>(
      this.BASE_URL +
        'Master/GetLocationMasterList?LOC_NAME=' +
        loc.LOC_NAME +
        '&LOC_TYPE=' +
        loc.LOC_TYPE +
        '&FROM_DATE=' +
        loc.FROM_DATE +
        '&TO_DATE=' +
        loc.TO_DATE +
        (loc.STATUS != '' ? '&STATUS=' + loc.STATUS : ''),
      this.httpOptions
    );
  }

  GetLocationMasterDetails(LOC_CODE: string) {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetLocationMasterDetails?LOC_CODE=' + LOC_CODE,
      this.httpOptions
    );
  }

  updateLocationMaster(loc: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/UpdateLocationMasterList',
      loc,
      this.httpOptions
    );
  }

  deletelocationMaster(LOC_CODE: string) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/DeleteLocationMasterList?LOC_CODE=' + LOC_CODE,
      this.httpOptions
    );
  }
}
