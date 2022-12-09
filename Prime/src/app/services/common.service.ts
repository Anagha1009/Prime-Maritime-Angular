import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  BASE_URL = environment.BASE_URL;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  };

  constructor(private _http: HttpClient) {}

  getDropdownData(key: string, port:string = '') {
    return this._http.get<any>(
      this.BASE_URL + 'Common/GetDropdownData?key=' + key,
      this.httpOptions
    );
  }

  sendEmail(form: FormData) {
    return this._http.post<any>(this.BASE_URL + 'Common/SendEmail', form);
  }

  getBase64ImageFromURL(url: any) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = url;
    });
  }

  UpdateMaster(type:any){
    debugger
    return this._http.post<any>(
      this.BASE_URL+ 'Master/UpdateMaster',
      type,
      this.httpOptions
    );
  }
}
