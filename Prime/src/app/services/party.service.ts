import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { PARTY } from '../models/party';

@Injectable({
  providedIn: 'root',
})
export class PartyService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };

  constructor(private _http: HttpClient) { }

  getPartyList(party: PARTY) {
    return this._http.get<any>(
      this.BASE_URL +
        'Master/GetMasterList?AGENT_CODE=' +
        party.AGENT_CODE,
      this.httpOptions
    );
  }
 
  postParty(party: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/InsertMaster',
      party,
      this.httpOptions
    );
  }
 
  }

