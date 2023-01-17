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

  constructor(private _http: HttpClient) {}

  getPartyList(partymaster: PARTY) {
    return this._http.get<any>(
      this.BASE_URL +
        'Master/GetPartyMasterList?AGENT_CODE=' +
        partymaster.AGENT_CODE +
        '&CUST_NAME=' +
        partymaster.CUST_NAME +
        '&CUST_TYPE=' +
        partymaster.CUST_TYPE +
        '&FROM_DATE=' +
        partymaster.FROM_DATE +
        '&TO_DATE=' +
        partymaster.TO_DATE +
        (partymaster.STATUS != '' ? '&STATUS=' + partymaster.STATUS : ''),
      this.httpOptions
    );
  }

  getPartyDetails(party: PARTY) {
    return this._http.get<any>(
      this.BASE_URL +
        'Master/GetPartyMasterDetails?AGENT_CODE=' +
        party.AGENT_CODE +
        '&CUSTOMER_ID=' +
        party.CUST_ID,
      this.httpOptions
    );
  }

  postParty(party: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/InsertPartyMaster',
      party,
      this.httpOptions
    );
  }

  deleteParty(party: PARTY) {
    return this._http.delete<any>(
      this.BASE_URL +
        'Master/DeletePartyMasterDetails?CUSTOMER_ID=' +
        party.CUST_ID,
      this.httpOptions
    );
  }

  updateParty(party: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/UpdatePartyMasterDetails',
      party,
      this.httpOptions
    );
  }
}
