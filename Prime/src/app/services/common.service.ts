import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import * as jquery from 'jquery';

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

  UpdateMaster(type: any) {
    debugger;
    return this._http.post<any>(
      this.BASE_URL + 'Master/UpdateMaster',
      type,
      this.httpOptions
    );
  }

  /* Data table configuration */
  destroyTableData() {
    setTimeout(() => {
      $('.destroydatatable').DataTable().clear().destroy();
    }, 1);
  }

  getDTConfig(fileName: any) {
    setTimeout(() => {
      $('#data-table-config').DataTable(this.getDataTableConfig(fileName));
      $('#data-table-config_filter input').attr('maxlength', 100);
    }, 1);
  }

  getDataTableConfig(fileName: any): any {
    return {
      pagingType: 'full_numbers',
      pageLength: 25,
      lengthMenu: [25, 50, 75],
      scrollX: false,
      scrollY: 300,
      order: [],
      columnDef: [{ orderable: false, targets: [0] }],
      processing: true,
      //"sDom": 't',
      dom: 'Bfrtip',
      destroy: true,
      // orders: [[1, 'desc']],
      // buttons: [
      //       'csv'
      //   ],
      language: {
        // "lengthMenu": '_MENU_ bản ghi trên trang',
        search: '<i class="fa fa-search"></i>',
        // "searchPlaceholder":'<i class="fa fa-search"></i>',
        // placeholder:"<i class='icon-search'></i>",
        // search: "_INPUT_",
        searchPlaceholder: 'Search',
      },
      buttons: [
        'pageLength',
        {
          extend: 'csv',
          text: 'Export',
          filename: fileName,
          className: 'form-btn float-right mt-1 ms-5 py-1',
        },
      ],
      //  lengthMenu: [ 10, 20, 50],
      //  lengthChange:true
    };
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
}
