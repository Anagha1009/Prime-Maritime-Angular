import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-tariff',
  templateUrl: './tariff.component.html',
  styleUrls: ['./tariff.component.scss'],
})
export class TariffComponent implements OnInit {
  files: any[] = [];
  files1: any[] = [];
  files2: any[] = [];
  files3: any[] = [];
  freightTable: any[];
  chargeTable: any[];
  stevTable: any[];
  onUpload: boolean = false;
  onUpload1: boolean = false;
  onUpload2: boolean = false;

  @ViewChild('openModalPopup1') openModalPopup1: ElementRef;
  @ViewChild('closeBtn2') closeBtn2: ElementRef;

  constructor(
    private http: HttpClient,
    private _commonService: CommonService,
    private _masterService: MasterService
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

  downloadFile2() {
    this.http
      .get('assets/img/Stevedoring Tariff.xlsx', { responseType: 'blob' })
      .subscribe((data) => {
        const blob = new Blob([data], { type: 'application/vnd.ms-excel' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        var path = 'assets/img/Stevedoring Tariff.xlsx';
        link.download = path.replace(/^.*[\\\/]/, '');
        link.click();
      });
  }

  downloadFile1() {
    this.http
      .get('assets/img/Charge Tariff.xlsx', { responseType: 'blob' })
      .subscribe((data) => {
        const blob = new Blob([data], { type: 'application/vnd.ms-excel' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        var path = 'assets/img/Charge Tariff.xlsx';
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
            'LadenStatus',
            'ServiceMode',
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
                      element.LadenStatus,
                      element.ServiceMode,
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
                  this.freightTable.forEach((element) => {
                    Object.keys(element).forEach(function (key) {
                      if (
                        key == 'DRY20' ||
                        key == 'DRY40' ||
                        key == 'DRY40HC' ||
                        key == 'DRY45' ||
                        key == 'RF20' ||
                        key == 'RF40' ||
                        key == 'RF40HC' ||
                        key == 'RF45' ||
                        key == 'HAZ20' ||
                        key == 'HAZ40' ||
                        key == 'HAZ40HC' ||
                        key == 'HAZ45' ||
                        key == 'SEQ20' ||
                        key == 'SEQ40'
                      ) {
                        if (element[key] == '') {
                          element[key] = 0;
                        }
                      }
                    });
                  });

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

  onFileChange1(ev: any) {
    this.files1 = ev.target.files;
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
            'CHARGE_CODE',
            'CURRENCY',
            'IMPCOST20',
            'IMPCOST40',
            'IMPINCOME20',
            'IMPINCOME40',
            'EXPCOST20',
            'EXPCOST40',
            'EXPINCOME20',
            'EXPINCOME40',
            'FROM_VAL',
            'TO_VAL',
          ];

          var keyXlArray: any = [];

          if (jsonData.hasOwnProperty('CHARGE')) {
            if (jsonData.CHARGE.length > 0) {
              Object.keys(jsonData['CHARGE'][0]).forEach(function (key) {
                keyXlArray.push(key);
              });

              var result = this.isSameColumn(keyXlArray, keyArray);

              if (result) {
                this.chargeTable = [];

                this.chargeTable = jsonData['CHARGE'];
                var isValid = true;

                this.chargeTable.forEach((element) => {
                  if (
                    !this.checkNullEmpty([
                      element.POL,
                      element.CHARGE_CODE,
                      element.CURRENCY,
                    ])
                  ) {
                    isValid = false;
                  }

                  if (
                    !this.checkZero([
                      element.IMPCOST20,
                      element.IMPCOST40,
                      element.IMPINCOME20,
                      element.IMPINCOME40,
                      element.EXPCOST20,
                      element.EXPCOST40,
                      element.EXPINCOME20,
                      element.EXPINCOME40,
                      element.FROM_VAL,
                      element.TO_VAL,
                    ])
                  ) {
                    isValid = false;
                  }
                });

                this._commonService.destroyDT1();
                if (isValid) {
                  this.chargeTable.forEach((element) => {
                    Object.keys(element).forEach(function (key) {
                      if (
                        key == 'IMPCOST20' ||
                        key == 'IMPCOST40' ||
                        key == 'IMPINCOME20' ||
                        key == 'IMPINCOME40' ||
                        key == 'EXPCOST20' ||
                        key == 'EXPCOST40' ||
                        key == 'EXPINCOME20' ||
                        key == 'EXPINCOME40' ||
                        key == 'FROM_VAL' ||
                        key == 'TO_VAL'
                      ) {
                        if (element[key] == '') {
                          element[key] = 0;
                        }
                      }
                    });
                  });

                  this.chargeTable = this.chargeTable.filter(
                    (v, i, a) =>
                      a.findIndex(
                        (v2) => JSON.stringify(v2) === JSON.stringify(v)
                      ) === i
                  );

                  this.onUpload1 = true;
                  this._commonService.getDT1();
                } else {
                  this.files1 = [];
                  alert('Incorrect data!');
                }
              } else {
                this.files1 = [];
                alert('Invalid file !');
              }
            } else {
              this.files1 = [];
              alert('Empty File !');
            }
          } else {
            this.files1 = [];
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

  onFileChange2(ev: any) {
    this.files2 = ev.target.files;
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
            'IE_TYPE',
            'POL',
            'TERMINAL',
            'CHARGE_CODE',
            'CURRENCY',
            'LADEN_STATUS',
            'SERVICE_MODE',
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

          if (jsonData.hasOwnProperty('STEVEDORING')) {
            if (jsonData.STEVEDORING.length > 0) {
              Object.keys(jsonData['STEVEDORING'][0]).forEach(function (key) {
                keyXlArray.push(key);
              });

              var result = this.isSameColumn(keyXlArray, keyArray);

              if (result) {
                this.stevTable = [];

                this.stevTable = jsonData['STEVEDORING'];
                var isValid = true;

                this.stevTable.forEach((element) => {
                  if (
                    !this.checkNullEmpty([
                      element.IE_TYPE,
                      element.POL,
                      element.TERMINAL,
                      element.CHARGE_CODE,
                      element.CURRENCY,
                      element.LADEN_STATUS,
                      element.SERVICE_MODE,
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

                this._commonService.destroyDT3();
                if (isValid) {
                  this.stevTable.forEach((element) => {
                    Object.keys(element).forEach(function (key) {
                      if (
                        key == 'DRY20' ||
                        key == 'DRY40' ||
                        key == 'DRY40HC' ||
                        key == 'DRY45' ||
                        key == 'RF20' ||
                        key == 'RF40' ||
                        key == 'RF40HC' ||
                        key == 'RF45' ||
                        key == 'HAZ20' ||
                        key == 'HAZ40' ||
                        key == 'HAZ40HC' ||
                        key == 'HAZ45' ||
                        key == 'SEQ20' ||
                        key == 'SEQ40'
                      ) {
                        if (element[key] == '') {
                          element[key] = 0;
                        }
                      }
                    });
                  });

                  this.stevTable = this.stevTable.filter(
                    (v, i, a) =>
                      a.findIndex(
                        (v2) => JSON.stringify(v2) === JSON.stringify(v)
                      ) === i
                  );

                  this.onUpload2 = true;
                  this._commonService.getDT3();
                } else {
                  this.files2 = [];
                  alert('Incorrect data!');
                }
              } else {
                this.files2 = [];
                alert('Invalid file !');
              }
            } else {
              this.files2 = [];
              alert('Empty File !');
            }
          } else {
            this.files2 = [];
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

  openPreviewModal(value: any) {
    if (
      value == 'F'
        ? this.files.length == 0
        : value == 'C'
        ? this.files1.length == 0
        : this.files2.length == 0
    ) {
      alert('Please add file !');
      return;
    }

    if (value == 'F') {
      this.chargeTable = [];
      this.stevTable = [];
    } else if (value == 'C') {
      this.freightTable = [];
      this.stevTable = [];
    } else if (value == 'S') {
      this.freightTable = [];
      this.chargeTable = [];
    }
    this.openModalPopup1.nativeElement.click();
  }

  upload(value: any) {
    if (value == 'F') {
      this._masterService
        .insertFreight(JSON.stringify(this.freightTable))
        .subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            this._commonService.successMsg(
              'Freight is been uploaded successfully !'
            );
            this.onUpload = false;
            this.files = [];
            this.closeBtn2.nativeElement.click();
          }
        });
    } else if (value == 'C') {
      this._masterService
        .insertCharge(JSON.stringify(this.chargeTable))
        .subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            this._commonService.successMsg(
              'Charge is been uploaded successfully !'
            );
            this.onUpload1 = false;
            this.files1 = [];
            this.closeBtn2.nativeElement.click();
          }
        });
    } else if (value == 'S') {
      this._masterService
        .insertStev(JSON.stringify(this.stevTable))
        .subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            this._commonService.successMsg(
              'Stevedoring / THC is been uploaded successfully !'
            );
            this.onUpload2 = false;
            this.files2 = [];
            this.closeBtn2.nativeElement.click();
          }
        });
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
      if (isNaN(element)) {
        x = false;
      }
    });
    return x;
  }
}
