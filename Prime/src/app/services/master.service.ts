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

  updateCharge(freight: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/UpdateChargeMasterList',
      freight,
      this.httpOptions
    );
  }

  getChargeList() {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetChargeMasterList',
      this.httpOptions
    );
  }

  getChargeDetails(ID: any) {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetChargeMasterDetails?ID=' + ID,
      this.httpOptions
    );
  }

  deleteCharge(ID: any) {
    return this._http.delete<any>(
      this.BASE_URL + 'Master/DeleteChargeMasterList?ID=' + ID,
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

  updateSteve(freight: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/UpdateStevedoringMasterList',
      freight,
      this.httpOptions
    );
  }

  getSteveList() {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetStevedoringMasterList',
      this.httpOptions
    );
  }

  getSteveDetails(ID: any) {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetStevedoringMasterDetails?ID=' + ID,
      this.httpOptions
    );
  }

  deleteSteve(ID: any) {
    return this._http.delete<any>(
      this.BASE_URL + 'Master/DeleteStevedoringMasterList?ID=' + ID,
      this.httpOptions
    );
  }

  insertDetention(detention: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/UploadDetentionTariff',
      detention,
      this.httpOptions
    );
  }

  updateDetention(freight: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/UpdateDetentionMasterList',
      freight,
      this.httpOptions
    );
  }

  getDetentionList() {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetDetentionMasterList',
      this.httpOptions
    );
  }

  getDetentionDetails(ID: any) {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetDetentionMasterDetails?ID=' + ID,
      this.httpOptions
    );
  }

  deleteDetention(ID: any) {
    return this._http.delete<any>(
      this.BASE_URL + 'Master/DeleteDetentionMasterList?ID=' + ID,
      this.httpOptions
    );
  }

  insertMandatory(mandatory: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/UploadMandatoryTariff',
      mandatory,
      this.httpOptions
    );
  }

  updateMandatory(freight: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/UpdateMandatoryMasterList',
      freight,
      this.httpOptions
    );
  }

  getMandatoryList() {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetMandatoryMasterList',
      this.httpOptions
    );
  }

  getMandatoryDetails(ID: any) {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetMandatoryMasterDetails?ID=' + ID,
      this.httpOptions
    );
  }

  deleteMandatory(ID: any) {
    return this._http.delete<any>(
      this.BASE_URL + 'Master/DeleteMandatoryMasterList?ID=' + ID,
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

  GetOrgMasterDetails(orgcode: any, orgloccode: any) {
    return this._http.get<any>(
      this.BASE_URL +
        'Master/GetOrgMasterDetails?ORG_CODE=' +
        orgcode +
        '&ORG_LOC_CODE=' +
        orgloccode,
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

  DeleteOrgMasterList(orgcode: any, orgloccode: any) {
    return this._http.post<any>(
      this.BASE_URL +
        'Master/DeleteOrgMasterList?ORG_CODE=' +
        orgcode +
        '&ORG_LOC_CODE=' +
        orgloccode,
      this.httpOptions
    );
  }

  ValidateOrgCode(orgcode: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/ValidateOrgCode?ORG_CODE=' + orgcode,
      this.httpOptions
    );
  }

  insertSlot(master: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/InsertSlotMaster',
      master,
      this.httpOptions
    );
  }

  GetSlotMasterList(slot: any) {
    return this._http.get<any>(
      this.BASE_URL +
        'Master/GetSlotMasterList?SERVICE=' +
        slot.SERVICE +
        '&PORT=' +
        slot.PORT,
      this.httpOptions
    );
  }

  GetSlotMasterDetails(ID: number) {
    return this._http.get<any>(
      this.BASE_URL + 'Master/GetSlotMasterDetails?ID=' + ID,
      this.httpOptions
    );
  }

  UpdateSlotMasterList(charge: any) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/UpdateSlotMasterList',
      charge,
      this.httpOptions
    );
  }

  DeleteSlotMasterList(ID: number) {
    return this._http.post<any>(
      this.BASE_URL + 'Master/DeleteSlotMasterList?ID=' + ID,
      this.httpOptions
    );
  }
}
