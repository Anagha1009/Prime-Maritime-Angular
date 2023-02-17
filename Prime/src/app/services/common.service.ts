import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import * as jquery from 'jquery';
import Swal from 'sweetalert2';

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

  getDropdownData(
    key: string,
    port: string = '',
    value: string = '',
    value1: number = 0
  ) {
    return this._http.get<any>(
      this.BASE_URL +
        'Common/GetDropdownData?key=' +
        key +
        '&value=' +
        value +
        '&port=' +
        port +
        '&value1=' +
        value1,
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

  /* Data table configuration */
  destroyDT() {
    $('#data-table-config').DataTable().clear().destroy();
  }

  getDT() {
    setTimeout(() => {
      $('#data-table-config').DataTable({
        pagingType: 'full_numbers',
        pageLength: 10,
        processing: true,
        lengthMenu: [5, 10, 25],
      });
    }, 1);
  }

  getcurrentDate(date: any) {
    var todate: any = date.getDate();
    if (todate < 10) {
      todate = '0' + todate;
    }

    var month = date.getMonth() + 1;

    if (month < 10) {
      month = '0' + month;
    }

    var year = date.getFullYear();
    return year + '-' + month + '-' + todate;
  }

  successMsg(msg: string) {
    Swal.fire('Success!', msg, 'success');
  }

  warnMsg(msg: string) {
    Swal.fire('Oops!', msg, 'warning');
  }

  errorMsg(msg: string) {
    Swal.fire('Error!', msg, 'error');
  }

  getRandomNumber(prefix: string) {
    var d: any = new Date();

    var month = d.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }

    var date = d.getDate();
    if (date < 10) {
      date = '0' + date;
    }

    var num =
      d.getFullYear() +
      '' +
      month +
      '' +
      date +
      '' +
      d.getHours() +
      '' +
      d.getMinutes() +
      '' +
      d.getSeconds() +
      '' +
      d.getMilliseconds();
    return prefix + num;
  }

  CheckRandomNo(RandomNo: string) {
    return this._http.get<any>(
      this.BASE_URL + 'Common/CheckRandomNuber?RANDOM_NO=' + RandomNo,
      this.httpOptions
    );
  }

  getUserCode() {
    var user = JSON.parse(localStorage.getItem('user'));
    return user.userCode;
  }

  getUserName() {
    var user = JSON.parse(localStorage.getItem('user'));
    return user.userName;
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  numericOnly(event: any): boolean {
    // restrict e,+,-,E characters in  input type number
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode == 101 || charCode == 69 || charCode == 45 || charCode == 43) {
      return false;
    }
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
    return true;
  }
}
