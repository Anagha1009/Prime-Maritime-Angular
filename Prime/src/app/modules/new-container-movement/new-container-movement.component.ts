import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CONTAINER_MOVEMENT } from 'src/app/models/cm';
import { CmService } from 'src/app/services/cm.service';
import { CommonService } from 'src/app/services/common.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-new-container-movement',
  templateUrl: './new-container-movement.component.html',
  styleUrls: ['./new-container-movement.component.scss'],
})
export class NewContainerMovementComponent implements OnInit {
  containerMovementList: any[] = [];
  containerMovementForm: FormGroup;
  ismanually: boolean = false;
  isGetContainer: boolean = false;
  isGetContainer1: boolean = false;
  isnoRecord: boolean = false;
  cmForm: FormGroup;
  onUpload: boolean = false;
  cmTable: any[] = [];
  files: any[] = [];
  submitted: boolean;
  depoList: any[] = [];

  @ViewChild('openBtn') openBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;
  @ViewChild('openModalPopup1') openModalPopup1: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeBtn1') closeBtn1: ElementRef;
  @ViewChild('closeBtn2') closeBtn2: ElementRef;

  constructor(
    private _CMService: CmService,
    private _commonService: CommonService,
    private _formBuilder: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cmForm = this._formBuilder.group({
      CONTAINER_NO: [''],
      BKCR_NO: [''],
    });

    this.containerMovementForm = this._formBuilder.group({
      BOOKING_NO: [''],
      CRO_NO: [''],
      CONTAINER_NO: [''],
      PREV_ACT_NAME: [''],
      PREV_ACT_CODE: [''],
      PREV_ACTIVITY: [''],
      CURR_ACT_NAME: [''],
      CURR_ACT_CODE: ['', Validators.required],
      CURR_ACT_CODE2: [''],
      ACTIVITY_DATE: [''],
      LOCATION: [''],
      STATUS: ['', Validators.required],
      NEXT_ACTIVITY_LIST: new FormArray([]),
    });

    this.getDropdown();
  }

  getCM(CM: any) {
    var cm = new CONTAINER_MOVEMENT();
    cm.BOOKING_NO = CM.BOOKING_NO;
    cm.CRO_NO = CM.CRO_NO;
    cm.CONTAINER_NO = CM.CONTAINER_NO;

    const add = this.containerMovementForm.get(
      'NEXT_ACTIVITY_LIST'
    ) as FormArray;

    add.clear();
    this._CMService.getContMov(cm).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.isnoRecord = false;
        this.containerMovementForm.patchValue(res.Data);
        this.containerMovementForm
          .get('PREV_ACTIVITY')
          ?.setValue(res.Data.CURR_ACT_CODE);

        this.containerMovementForm
          .get('CURR_ACT_CODE2')
          ?.setValue(res.Data.CURR_ACT_CODE);
        this.containerMovementForm.get('CURR_ACT_CODE')?.setValue('');

        res.Data.NEXT_ACTIVITY_LIST.forEach((element: any) => {
          add.push(this._formBuilder.group(element));
        });

        this.containerMovementForm
          .get('ACTIVITY_DATE')
          ?.setValue(formatDate(res.Data.ACTIVITY_DATE, 'yyyy-MM-dd', 'en'));
      } else {
        this.isnoRecord = true;
        this.isGetContainer1 = true;
      }
    });

    if (!this.ismanually) {
      this.openModalPopup.nativeElement.click();
    }
  }

  getCMList() {
    var value = this.cmForm.get('BKCR_NO')?.value.substring(0, 2);

    var cm = new CONTAINER_MOVEMENT();
    cm.BOOKING_NO = value == 'BK' ? this.cmForm.get('BKCR_NO')?.value : '';
    cm.CRO_NO = value == 'CR' ? this.cmForm.get('BKCR_NO')?.value : '';

    if (value == 'BK' || value == 'CR') {
    } else {
      alert('Please enter correct Booking No / CRO No');
      return;
    }

    this.isGetContainer = true;

    this._commonService.destroyDT();
    this._CMService.getContainerMovement(cm).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.containerMovementList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  get f() {
    return this.containerMovementForm.controls;
  }

  updateMovement() {
    this.submitted = true;
    if (this.containerMovementForm.invalid) {
      return;
    }

    this._CMService
      .updateContMov(JSON.stringify(this.containerMovementForm.value))
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.closeBtn.nativeElement.click();
          this._commonService.successMsg(
            'Container Movement has been updated successfully !'
          );
          if (this.ismanually) {
            this.containerMovementForm.reset();
            this.isGetContainer1 = false;
            this.cmForm.reset();
          } else {
            this.getCMList();
          }
        }
      });
  }

  downloadFile() {
    this.http
      .get('assets/img/Container-Movement.xlsx', { responseType: 'blob' })
      .subscribe((data) => {
        const blob = new Blob([data], { type: 'application/vnd.ms-excel' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        var path = 'assets/img/Container-Movement.xlsx';
        link.download = path.replace(/^.*[\\\/]/, '');
        link.click();
      });
  }

  openPreviewModal() {
    if (this.files.length == 0) {
      alert('Please add file !');
      return;
    }
    this.closeBtn1.nativeElement.click();
    this.openModalPopup1.nativeElement.click();
  }

  upload() {
    var containerList: any = [];
    this.cmTable.forEach((element) => {
      var value = element['BOOKING_NO / CRO_NO'].substring(0, 2);
      containerList.push({
        BOOKING_NO: value == 'BK' ? element['BOOKING_NO / CRO_NO'] : '',
        CRO_NO: value == 'CR' ? element['BOOKING_NO / CRO_NO'] : '',
        CONTAINER_NO: element.CONTAINER_NO,
        CURR_ACT_CODE: element.ACTIVITY,
        ACTIVITY_DATE: element.ACTIVITY_DATE,
        LOCATION: element.LOCATION,
        STATUS: element.STATUS,
      });
    });

    this._CMService
      .uploadContMov(JSON.stringify(containerList))
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.closeBtn2.nativeElement.click();
          this._commonService.successMsg('Records are uploaded successfully !');
        }
      });
  }

  openUploadModal() {
    this.onUpload = false;
    this.openBtn.nativeElement.click();
  }

  getDropdown() {
    this._commonService.getDropdownData('DEPO').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.depoList = res.Data;
      }
    });
  }

  getContainerData() {
    this.submitted = false;
    var CM = new CONTAINER_MOVEMENT();
    CM.CONTAINER_NO = this.cmForm.get('CONTAINER_NO')?.value;

    this.getCM(CM);

    this.isGetContainer1 = true;
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
            initial[name] = XLSX.utils.sheet_to_json(sheet);
            return initial;
          }, {});

          var keyArray = [
            'BOOKING_NO / CRO_NO',
            'CONTAINER_NO',
            'ACTIVITY',
            'ACTIVITY_DATE',
            'LOCATION',
            'STATUS',
          ];

          var keyXlArray: any = [];

          Object.keys(jsonData['CM'][0]).forEach(function (key) {
            keyXlArray.push(key);
          });

          var result = this.isSameColumn(keyXlArray, keyArray);

          if (result) {
            this.cmTable = [];

            this.cmTable = jsonData['CM'];
            var isValid = true;

            this.cmTable.forEach((element) => {
              if (
                !this.checkNullEmpty([
                  element['BOOKING_NO / CRO_NO'],
                  element.CONTAINER_NO,
                  element.ACTIVITY,
                  element.ACTIVITY_DATE,
                  element.LOCATION,
                  element.STATUS,
                ])
              ) {
                isValid = false;
              }
            });

            this._commonService.destroyDT();
            if (isValid) {
              this.cmTable = this.cmTable.filter(
                (v, i, a) =>
                  a.findIndex(
                    (v2) => JSON.stringify(v2) === JSON.stringify(v)
                  ) === i
              );

              this._commonService.getDT();

              this.onUpload = true;
            } else {
              alert('Incorrect data!');
            }
          } else {
            alert('Invalid file !');
          }
        };
        reader.readAsBinaryString(file);
      } else {
        alert('Only .xlsx or .csv files allowed');
      }
    }
  }

  switchToggle(event: any) {
    this.cmForm.reset();
    this.isGetContainer = false;
    this.isGetContainer1 = false;
    this.ismanually = event.target.checked;
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
}
