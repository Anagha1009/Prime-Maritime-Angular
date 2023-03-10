import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { TDR } from '../models/tdr';

@Injectable({
  providedIn: 'root',
})
export class TdrService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };

  constructor(private http: HttpClient) {}

  InsertTdr(tdr: any) {
    return this.http.post<any>(
      this.BASE_URL + 'TDR/InsertTdr',
      tdr,
      this.httpOptions
    );
  }

  GetTdrList() {
    return this.http.get<any>(
      this.BASE_URL + 'TDR/GetTdrList',
      this.httpOptions
    );
  }

  GetTdrDetails(tdrNo: string) {
    return this.http.get<any>(
      this.BASE_URL + 'TDR/GetTdrDetails?TDR_NO=' + tdrNo,
      this.httpOptions
    );
  }
}
