import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { QuotationService } from 'src/app/services/quotation.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-exc-rate-list',
  templateUrl: './exc-rate-list.component.html',
  styleUrls: ['./exc-rate-list.component.scss'],
})
export class ExcRateListComponent implements OnInit {
  excRateList: any[] = [];
  onUpload: boolean = false;

  constructor(
    private _commonService: CommonService,
    private _quotationService: QuotationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  isSameColumn(arr1: any, arr2: any) {
    return $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0;
  }

  checkNullEmpty(param: any) {
    var x = true;
    param.forEach((element: any) => {
      if (element == null || element == '' || element == undefined) {
        x = false;
      }
    });
    return x;
  }

  onFileChange(ev: any) {
    let workBook: any = null;
    let jsonData = null;
    const reader = new FileReader();
    var file = ev.target.files[0];

    var extension = file.name.split('.').pop();
    var array = ['csv', 'xls', 'xlsx'];

    if (
      ev.target.files[0].type ==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
    } else {
      this._commonService.warnMsg('Please Select Excel Format only');
      return;
    }

    if (file.size > 5000000) {
      this._commonService.warnMsg('Please upload file less than 5 mb..!');
      return;
    } else {
      var el = array.find((a) => a.includes(extension));

      if (el != null && el != '') {
        reader.onload = (event) => {
          const data = reader.result;
          workBook = XLSX.read(data, { type: 'binary', cellDates: true });

          if (workBook.SheetNames[0] != 'Sheet1') {
            this._commonService.warnMsg('Invalid File !');
            return;
          }

          jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
            const sheet = workBook.Sheets[name];
            initial[name] = XLSX.utils.sheet_to_json(sheet);
            return initial;
          }, {});

          var keyArray = ['CURRENCY', 'RATE'];

          var keyXlArray: any = [];

          Object.keys(jsonData['Sheet1'][0]).forEach(function (key) {
            keyXlArray.push(key);
          });

          var result = this.isSameColumn(keyXlArray, keyArray);

          if (result) {
            this.excRateList = [];

            this.excRateList = jsonData['Sheet1'];
            var isValid = true;

            this.excRateList.forEach((element) => {
              if (!this.checkNullEmpty([element.CURRENCY, element.RATE])) {
                isValid = false;
              }
            });

            if (isValid) {
              this.excRateList = this.excRateList.filter(
                (v, i, a) =>
                  a.findIndex(
                    (v2) => JSON.stringify(v2) === JSON.stringify(v)
                  ) === i
              );

              this.onUpload = true;
            } else {
              this._commonService.warnMsg('Incorrect data!');
            }
          } else {
            this._commonService.warnMsg('Invalid file !');
          }
        };
        reader.readAsBinaryString(file);
      } else {
        this._commonService.warnMsg('Only .xlsx or .csv files allowed');
      }
    }
  }

  postExcRateList() {
    if (this.excRateList.length == 0) {
      this._commonService.warnMsg('Please upload Exchange Rates !');
      return;
    }

    this.excRateList.forEach((element) => {
      element.AGENT_CODE = this._commonService.getUserCode();
    });

    this._quotationService
      .postExcRateList(this.excRateList)
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Exchange Rates uploaded sccessfully!'
          );
          this.onUpload = false;
        }
      });
  }

  downloadFile() {
    this.http
      .get('assets/img/ExchangeRate.xlsx', { responseType: 'blob' })
      .subscribe((data) => {
        const blob = new Blob([data], { type: 'application/vnd.ms-excel' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        var path = 'assets/img/ExchangeRate.xlsx';
        link.download = path.replace(/^.*[\\\/]/, '');
        link.click();
      });
  }
}
