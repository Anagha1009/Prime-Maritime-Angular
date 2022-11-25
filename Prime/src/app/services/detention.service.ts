import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { DETENTION } from '../models/detention';

@Injectable({
  providedIn: 'root'
})
export class DetentionService {

  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };
  constructor(private _http: HttpClient) {}

  getDetentionList(DET: DETENTION) {
    return this._http.get<any>(
      this.BASE_URL +
        'Detention/GetDetentionList?AGENT_CODE=' +
        DET.AGENT_CODE ,
      this.httpOptions
    );
  }
}
