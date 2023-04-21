import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { isNumber } from 'igniteui-angular-core';
import { CommonService } from 'src/app/services/common.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-tariff',
  templateUrl: './tariff.component.html',
  styleUrls: ['./tariff.component.scss'],
})
export class TariffComponent implements OnInit {
  files: any[] = [];
  freightTable: any[];
  onUpload: boolean = false;

  constructor(
    private http: HttpClient,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {}

  downloadFile() {
    this.http
      .get('assets/img/Freight Tariff.xlsx', { responseType: 'blob' })
      .subscribe((data) => {
        const blob = new Blob([data], { type: 'application/vnd.ms-excel' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        var path = 'assets/img/Freight Tariff.xlsx';
        link.download = path.replace(/^.*[\\\/]/, '');
        link.click();
      });
  }

  onFileChange(ev: any) {
    this.files = ev.target.files;
    let workBook: any = null;
    let jsonData = null;
    const reader = new FileReader();
    var file = ev.target.files[0];

    var extension = file.name.split('.').pop();
    var array = ['csv', 'xls', 'xlsx'];

    if (file.size > 5000000) {
      alert('Please upload file less than 5 mb..!');
      return;
    } else {
      var el = array.find((a) => a.includes(extension));

      if (el != null && el != '') {
        reader.onload = (event) => {
          const data = reader.result;
          workBook = XLSX.read(data, { type: 'binary', cellDates: true });

          jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
            const sheet = workBook.Sheets[name];
            initial[name] = XLSX.utils.sheet_to_json(sheet, { defval: '' });
            return initial;
          }, {});

          var keyArray = [
            'POL',
            'POD',
            'Charge',
            'Currency',
            'Laden Status',
            'Service Mode',
            'DRY20',
            'DRY40',
            'DRY40HC',
            'DRY45',
            'RF20',
            'RF40',
            'RF40HC',
            'RF45',
            'HAZ20',
            'HAZ40',
            'HAZ40HC',
            'HAZ45',
            'SEQ20',
            'SEQ40',
          ];

          var keyXlArray: any = [];

          if (jsonData.hasOwnProperty('FREIGHT')) {
            if (jsonData.FREIGHT.length > 0) {
              Object.keys(jsonData['FREIGHT'][0]).forEach(function (key) {
                keyXlArray.push(key);
              });

              var result = this.isSameColumn(keyXlArray, keyArray);

              if (result) {
                this.freightTable = [];

                this.freightTable = jsonData['FREIGHT'];
                var isValid = true;

                this.freightTable.forEach((element) => {
                  if (
                    !this.checkNullEmpty([
                      element.POL,
                      element.POD,
                      element.Charge,
                      element.Currency,
                      element['Laden Status'],
                      element['Service Mode'],
                    ])
                  ) {
                    isValid = false;
                  }

                  if (
                    !this.checkZero([
                      element.DRY20,
                      element.DRY40,
                      element.DRY40HC,
                      element.DRY45,
                      element.RF20,
                      element.RF40,
                      element.RF40HC,
                      element.RF45,
                      element.HAZ20,
                      element.HAZ40,
                      element.HAZ40HC,
                      element.HAZ45,
                      element.SEQ20,
                      element.SEQ40,
                    ])
                  ) {
                    isValid = false;
                  }
                });

                this._commonService.destroyDT();
                if (isValid) {
                  this.freightTable = this.freightTable.filter(
                    (v, i, a) =>
                      a.findIndex(
                        (v2) => JSON.stringify(v2) === JSON.stringify(v)
                      ) === i
                  );
                  this.onUpload = true;
                  this._commonService.getDT();
                } else {
                  this.files = [];
                  alert('Incorrect data!');
                }
              } else {
                this.files = [];
                alert('Invalid file !');
              }
            } else {
              this.files = [];
              alert('Empty File !');
            }
          } else {
            this.files = [];
            alert('Invalid file !');
          }
        };
        reader.readAsBinaryString(file);
      } else {
        this.files = [];
        alert('Only .xlsx or .csv files allowed');
      }
    }
  }

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

  checkZero(param: any) {
    var x = true;
    param.forEach((element: any) => {
      if (isNaN(element) && element == '') {
        x = false;
      }
    });
    return x;
  }
}
