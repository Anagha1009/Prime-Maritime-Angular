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
  cmForm: FormGroup;
  onUpload: boolean = false;
  cmTable: any[] = [];
  files: any[] = [];
  submitted: boolean = false;
  submitted1: boolean = false;
  isData: boolean = false;
  depoList: any[] = [];
  currentDate: string = '';
  updateSubmitted: boolean = false;

  @ViewChild('openBtn') openBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;
  @ViewChild('openModalPopup1') openModalPopup1: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeBtn1') closeBtn1: ElementRef;
  @ViewChild('closeBtn2') closeBtn2: ElementRef;
  @ViewChild('chck') chck: ElementRef;

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
      ACTIVITY_DATE: ['', Validators.required],
      ACTIVITY_DATE1: [''],
      LOCATION: ['', Validators.required],
      LOCATION1: [''],
      STATUS: ['', Validators.required],
      STATUS1: [''],
      NEXT_ACTIVITY_LIST: new FormArray([]),
    });

    this.getDropdown();

    this.currentDate = this._commonService.getcurrentDate(new Date());
  }

  getCM(CM: any) {
    this.updateSubmitted = false;
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
        if (this.ismanually) {
          this.isData = true;
        }
        this.containerMovementForm.patchValue(res.Data);
        this.containerMovementForm
          .get('PREV_ACTIVITY')
          ?.setValue(res.Data.CURR_ACT_CODE);

        this.containerMovementForm
          .get('CURR_ACT_CODE2')
          ?.setValue(res.Data.CURR_ACT_CODE);
        this.containerMovementForm.get('CURR_ACT_CODE')?.setValue('');

        this.containerMovementForm.get('STATUS1')?.setValue(res.Data.STATUS);
        this.containerMovementForm.get('STATUS')?.setValue('');
        this.containerMovementForm
          .get('LOCATION1')
          ?.setValue(res.Data.LOCATION);
        this.containerMovementForm.get('LOCATION')?.setValue('');

        res.Data.NEXT_ACTIVITY_LIST.forEach((element: any) => {
          add.push(this._formBuilder.group(element));
        });

        this.containerMovementForm
          .get('ACTIVITY_DATE1')
          ?.setValue(formatDate(res.Data.ACTIVITY_DATE, 'dd-MM-yyyy', 'en'));
        this.containerMovementForm.get('ACTIVITY_DATE')?.setValue('');
      } else {
        if (this.ismanually) {
          this.isData = false;
        }
      }
    });

    if (!this.ismanually) {
      this.openModalPopup.nativeElement.click();
    }
  }

  getCMList() {
    this.submitted = true;
    var value = this.cmForm.get('BKCR_NO')?.value.substring(0, 2);

    var cm = new CONTAINER_MOVEMENT();
    cm.BOOKING_NO = '';
    cm.CRO_NO = value == 'CR' ? this.cmForm.get('BKCR_NO')?.value : '';

    if (value == 'CR') {
    } else {
      alert('Please enter correct CRO No');
      this.submitted = false;
      return;
    }

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
    this.updateSubmitted = true;
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
            this.cmForm.reset();
            this.backTo();
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
    var locationList: any = [];
    this._commonService.getDropdownData('CM_LOCATION').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        locationList = res.Data;

        this.cmTable.forEach((element) => {
          debugger;
          var loccode = locationList.find(
            (x: any) => x.CODE_DESC === element.LOCATION
          );
          var value = element['CRO_NO'].substring(0, 2);

          containerList.push({
            BOOKING_NO: '',
            CRO_NO: value == 'CR' ? element['CRO_NO'] : '',
            CONTAINER_NO: element.CONTAINER_NO,
            CURR_ACT_CODE: element.ACTIVITY,
            ACTIVITY_DATE: element.ACTIVITY_DATE,
            LOCATION: loccode?.CODE,
            STATUS: element.STATUS,
          });
        });

        this._CMService
          .uploadContMov(JSON.stringify(containerList))
          .subscribe((res: any) => {
            if (res.ResponseCode == 200) {
              this.closeBtn2.nativeElement.click();
              this._commonService.successMsg(
                'Records are uploaded successfully !'
              );
            }
          });
      }
    });
  }

  openUploadModal() {
    this.onUpload = false;
    this.openBtn.nativeElement.click();
  }

  getDropdown() {
    this._commonService.getDropdownData('CM_LOCATION').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.depoList = res.Data;
      }
    });
  }

  onchangeNextAct(event: any) {
    if (
      event.target.value == 'LODF' ||
      event.target.value == 'LODE' ||
      event.target.value == 'DCHF' ||
      event.target.value == 'DCHE'
    ) {
      this.depoList = [];
      this.containerMovementForm.get('LOCATION').setValue('');
      this._commonService
        .getDropdownData('CM_LOCATION_WITHPORT')
        .subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            this.depoList = res.Data;
          }
        });
    } else {
      this.depoList = [];
      this.containerMovementForm.get('LOCATION').setValue('');
      this._commonService
        .getDropdownData('CM_LOCATION')
        .subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            this.depoList = res.Data;
          }
        });
    }
  }

  getContainerData() {
    this.submitted1 = true;
    var CM = new CONTAINER_MOVEMENT();
    CM.CONTAINER_NO = this.cmForm.get('CONTAINER_NO')?.value;

    this.getCM(CM);
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
            'CRO_NO',
            'CONTAINER_NO',
            'ACTIVITY',
            'ACTIVITY_DATE',
            'LOCATION',
            'STATUS',
          ];

          var keyXlArray: any = [];

          if (jsonData.hasOwnProperty('CM')) {
            if (jsonData.CM.length > 0) {
              Object.keys(jsonData['CM'][0]).forEach(function (key) {
                keyXlArray.push(key);
              });

              var result = this.isSameColumn(keyXlArray, keyArray);

              if (result) {
                this.cmTable = [];

                this.cmTable = jsonData['CM'];
                var isValid = true;
                var isValidBKCRO = true;

                this.cmTable.forEach((element) => {
                  if (
                    !this.checkNullEmpty([
                      element.CONTAINER_NO,
                      element.ACTIVITY,
                      element.ACTIVITY_DATE,
                      element.LOCATION,
                      element.STATUS,
                    ])
                  ) {
                    isValid = false;
                  }

                  if (element['CRO_NO'] != '') {
                    var val = element['CRO_NO'].substring(0, 2);
                    if (val == 'CR') {
                      isValidBKCRO = true;
                    } else {
                      isValidBKCRO = false;
                    }
                  }
                });

                this._commonService.destroyDT();
                if (isValid) {
                  if (isValidBKCRO) {
                    this.cmTable = this.cmTable.filter(
                      (v, i, a) =>
                        a.findIndex(
                          (v2) => JSON.stringify(v2) === JSON.stringify(v)
                        ) === i
                    );

                    var isValidNxt = true;
                    this.cmTable.forEach((el: any) => {
                      this._CMService
                        .getNxtActivityList(el.CONTAINER_NO)
                        .subscribe((r: any) => {
                          if (r.ResponseCode == 200) {
                            var nxtactList = r.Data;
                            var findactivity = nxtactList.find(
                              (x: any) => x.NEXT_ACT_CODE === el.ACTIVITY
                            );
                            if (!findactivity) {
                              this._commonService.warnMsg(
                                el.CONTAINER_NO +
                                  ' Container Activity is invalid <br> As it does not match to its Next Actvity'
                              );
                              this.onUpload = false;
                              this.files = [];
                              isValidNxt = false;
                              return;
                            }

                            if (isValidNxt) {
                              this._CMService
                                .isvalidCROforContainer(el.CONTAINER_NO)
                                .subscribe((r1: any) => {
                                  if (
                                    r1.responseCode == 200 &&
                                    el.CRO_NO != ''
                                  ) {
                                    if (el.CRO_NO != r1.data) {
                                      this._commonService.warnMsg(
                                        el.CONTAINER_NO +
                                          " Container's CRO No is invalid <br> Please enter valid CRO No"
                                      );
                                      this.onUpload = false;
                                      this.files = [];
                                      return;
                                    }
                                  } else if (
                                    r1.responseCode == 500 &&
                                    el.CRO_NO != ''
                                  ) {
                                    this._commonService.warnMsg(
                                      el.CONTAINER_NO +
                                        ' Container is not mapped to any CRO No, Please allot the Container to map it to the CRO No'
                                    );
                                    this.onUpload = false;
                                    this.files = [];
                                    return;
                                  }
                                });
                            }
                          }
                        });
                    });

                    this.onUpload = true;
                    this._commonService.getDT();
                  } else {
                    this.files = [];
                    alert('CRO No is invalid !');
                  }
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

  switchToggle(value: any) {
    this.cmForm.reset();
    this.ismanually = value;
    if (!value) {
      this.containerMovementList = [];
      this.submitted = false;
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

  backTo() {
    this.ismanually = true;
    this.isData = false;
    this.submitted1 = false;
    this.cmForm.get('CONTAINER_NO').setValue('');
  }
}
