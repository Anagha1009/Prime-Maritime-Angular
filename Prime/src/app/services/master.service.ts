import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { MASTER } from '../models/master';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };

  constructor(private _http: HttpClient) {}

  GetMasterList(master: MASTER) {
    return this._http.get<any>(
      this.BASE_URL +
        'Master/GetMasterList?key=' +
        master.KEY_NAME +
        '&FROM_DATE=' +
        master.FROM_DATE +
        '&TO_DATE=' +
        master.TO_DATE +
        '&STATUS=' +
        master.STATUS,
      this.httpOptions
    );
  }

  InsertMaster(type: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/InsertMaster',
      type,
      this.httpOptions
    );
  }

  GetMasterDetails(ID: number) {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetMasterDetails?ID=' + ID,
      this.httpOptions
    );
  }

  UpdateMaster(master: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/UpdateMaster',
      master,
      this.httpOptions
    );
  }

  DeleteMaster(ID: number) {
    return this._http.delete<any>(
      this.BASE_URL + 'Master/DeleteMaster?ID=' + ID,
      this.httpOptions
    );
  }

  getMstICD() {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetMstICD',
      this.httpOptions
    );
  }

  getMstDEPO() {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetMstDEPO',
      this.httpOptions
    );
  }

  getCP() {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetClearingPartyList',
      this.httpOptions
    );
  }

  postCP(cp: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/InsertCP',
      cp,
      this.httpOptions
    );
  }

  insertFreight(freight: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/UploadFreightTariff',
      freight,
      this.httpOptions
    );
  }

  updateFreight(freight: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/UpdateFreightMasterList',
      freight,
      this.httpOptions
    );
  }

  getFreightList() {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetFreightMasterList',
      this.httpOptions
    );
  }

  getFreightDetails(ID: any) {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetFreightMasterDetails?ID=' + ID,
      this.httpOptions
    );
  }

  deleteFreight(ID: any) {
    return this._http.delete<any>(
      this.BASE_URL + 'Master/DeleteFreightMasterList?ID=' + ID,
      this.httpOptions
    );
  }

  insertCharge(charge: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/UploadChargeTariff',
      charge,
      this.httpOptions
    );
  }

  insertStev(charge: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/UploadStevTariff',
      charge,
      this.httpOptions
    );
  }

  insertOrg(charge: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/InsertOrgMaster',
      charge,
      this.httpOptions
    );
  }

  GetOrgMasterList() {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetOrgMasterList',
      this.httpOptions
    );
  }

  GetOrgMasterDetails(orgcode: any) {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetOrgMasterDetails?ORG_CODE=' + orgcode,
      this.httpOptions
    );
  }

  UpdateOrgMasterList(charge: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/UpdateOrgMasterList',
      charge,
      this.httpOptions
    );
  }

  DeleteOrgMasterList(orgcode: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/DeleteOrgMasterList?ORG_CODE=' + orgcode,
      this.httpOptions
    );
  }

  ValidateOrgCode(orgcode: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/ValidateOrgCode?ORG_CODE=' + orgcode,
      this.httpOptions
    );
  }
}
