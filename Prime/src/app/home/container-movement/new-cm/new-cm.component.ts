import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  CheckboxControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { CONTAINER_MOVEMENT, CONTAINER_TRACKING } from 'src/app/models/cm';
import { CmService } from 'src/app/services/cm.service';
import { ActivityService } from 'src/app/services/activity.service';
import { formatDate } from '@angular/common';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { locale as english } from 'src/app/@core/translate/cm/en';
import { locale as hindi } from 'src/app/@core/translate/cm/hi';
import { locale as arabic } from 'src/app/@core/translate/cm/ar';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-new-cm',
  templateUrl: './new-cm.component.html',
  styleUrls: ['./new-cm.component.scss'],
})
export class NewCmComponent implements OnInit {
  cmForm: FormGroup;
  onUpload: boolean = false;
  submitted: boolean = false;
  manually: boolean = false;
  showTable: boolean = false;
  showFields: boolean = false;
  fromXL: boolean = false;
  previewNoData: boolean = false;
  isAgent: boolean = true;
  cmTable: any[] = [];
  containerList: any[] = [];
  cm = new CONTAINER_MOVEMENT();
  singleCM = new CONTAINER_MOVEMENT();
  maxDate: any = '';
  commonDate: any = '';
  commonLocation: any = '';
  contNo: any = '';
  bkcr: any = '';
  currentUser: any = '';
  roleCode: any = '';
  actBy: any = '';
  selectedActCode: any = '';
  selectedActivity: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings = {};
  contAllChecked: boolean = false;
  literalActivites: any[] = [];

  @ViewChild('myacts') myactsRef: ElementRef;

  agentXLCode: any = '';
  depoXLCode: any = '';
  contTrack = new CONTAINER_TRACKING();
  prevData: any;
  activityList: any[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _cmService: CmService,
    private _cs: CommonService,
    private _actService: ActivityService,
    private _router: Router,
    private _coreTranslationService: CoreTranslationService,
    private ntService: NotificationsService
  ) {
    this._coreTranslationService.translate(english, hindi, arabic);
  }

  ngOnInit(): void {
    this.cmForm = this._formBuilder.group({
      MANUALLY: [''],
      BOOKING_NO: [''],
      CRO: [''],
      BKCR_NO: [''],
      CONTAINER_NO: [''],
      ACTIVITY: ['', Validators.required],
      PREV_ACTIVITY: [''],
      ACTIVITY_DATE: ['', Validators.required],
      LOCATION: ['', Validators.required],
      CURRENT_LOCATION: [''],
      AGENT_CODE: [''],
      DEPO_CODE: [''],
      STATUS: [''],
      CREATED_BY: [''],
      CONTAINER_MOVEMENT_LIST: new FormArray([]),
      CONTAINER_LIST2: new FormArray([]),
      NEXT_ACTIVITY_LIST_SINGLE: new FormArray([]),
    });
    this.maxDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.checkUser();
    this.initializeNextActivityList();
  }

  initializeNextActivityList() {
    this.activityList = [];
    this._actService.getActivityList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.activityList = res.Data;
      }
    });
    this.activityList = this.activityList.filter((s: any) =>
      s.ACTIVITY_BY.includes(this.actBy)
    );
    const add = this.cmForm.get('NEXT_ACTIVITY_LIST_SINGLE') as FormArray;
    add.clear();
    this.activityList.forEach((element) => {
      add.push(
        this._formBuilder.group({
          ID: [element.ID],
          ACT_NAME: [element.ACT_NAME],
          ACT_CODE: [element.ACT_CODE],
          ACT_TYPE: [element.ACT_TYPE],
          ACTIVITY_BY: [element.ACTIVITY_BY],
        })
      );
    });
  }

  checkUser() {
    this.currentUser = this._cs.getUserName();
    this.roleCode = this._cs.getUser().roleCode;

    switch (this.roleCode) {
      case '1':
        this.actBy = 'A';
        break;
      case '2':
        this.actBy = 'P';
        break;
      case '3':
        this.actBy = 'D';
        break;
      default:
        this.actBy = 'A';
        break;
    }

    // if(this.currentUser=='agent'){
    //   this.isAgent=true;
    //   this.cmForm.get('STATUS')?.disable();
    //   this.cmForm.get('PREV_ACTIVITY')?.disable();
    // }
    // else{
    //   this.isAgent=false;
    //   this.cmForm.get('STATUS')?.enable();
    //   this.cmForm.get('PREV_ACTIVITY')?.disable();
    // }
    if (this.roleCode == '1') {
      this.isAgent = true;
      this.cmForm.get('STATUS')?.disable();
      this.cmForm.get('PREV_ACTIVITY')?.disable();
    } else {
      this.isAgent = false;
      this.cmForm.get('STATUS')?.enable();
      this.cmForm.get('PREV_ACTIVITY')?.disable();
    }
  }

  initializeMovementList() {
    const add = this.cmForm.get('CONTAINER_LIST2') as FormArray;
    add.clear();
    if (this.roleCode == '1') {
      this.containerList.forEach((element) => {
        if (element.NEXT_ACTIVITY_LIST[0] == null) {
          this.activityList = [];
          this.literalActivites = [];
          this._actService.getActivityList().subscribe((res: any) => {
            if (res.ResponseCode == 200) {
              this.activityList = res.Data;
              this.activityList = this.activityList.filter((s: any) =>
                s.ACTIVITY_BY.includes(this.actBy)
              );
              this.activityList.forEach((element) => {
                if (this.literalActivites.includes(element.ACT_NAME) == false) {
                  this.literalActivites.push(
                    element.ACT_CODE + '-' + element.ACT_NAME
                  );
                }
              });
              add.push(
                this._formBuilder.group({
                  ID: [element.ID],
                  BOOKING_NO: [element.BOOKING_NO],
                  CRO_NO: [element.CRO_NO],
                  CONTAINER_NO: [element.CONTAINER_NO],
                  ACTIVITY: [element.ACT_CODE],
                  PREV_ACTIVITY: [element.PREV_ACT_CODE],
                  ACTIVITY_DATE: [
                    formatDate(element.ACTIVITY_DATE, 'yyyy-MM-dd', 'en'),
                  ],
                  LOCATION: [element.LOCATION],
                  STATUS: [element.STATUS],
                  AGENT_CODE: [element.AGENT_CODE],
                  DEPO_CODE: [element.DEPO_CODE],
                  CREATED_BY: [element.CREATED_BY],
                  NEXT_ACTIVITY_LIST: [this.literalActivites],
                })
              );
            }
          });
        } else {
          add.push(
            this._formBuilder.group({
              ID: [element.ID],
              BOOKING_NO: [element.BOOKING_NO],
              CRO_NO: [element.CRO_NO],
              CONTAINER_NO: [element.CONTAINER_NO],
              ACTIVITY: [element.ACT_CODE],
              PREV_ACTIVITY: [element.PREV_ACT_CODE],
              ACTIVITY_DATE: [
                formatDate(element.ACTIVITY_DATE, 'yyyy-MM-dd', 'en'),
              ],
              LOCATION: [element.LOCATION],
              STATUS: [element.STATUS],
              AGENT_CODE: [element.AGENT_CODE],
              DEPO_CODE: [element.DEPO_CODE],
              CREATED_BY: [element.CREATED_BY],
              NEXT_ACTIVITY_LIST: [
                element.NEXT_ACTIVITY_LIST.filter((s: string) =>
                  s?.split('-')[2].includes(this.actBy)
                ),
              ],
            })
          );
        }
      });
    } else {
      this.containerList.forEach((element) => {
        if (element.NEXT_ACTIVITY_LIST[0] == null) {
          this.activityList = [];
          this.literalActivites = [];
          this._actService.getActivityList().subscribe((res: any) => {
            if (res.ResponseCode == 200) {
              this.activityList = res.Data;

              this.activityList = this.activityList.filter((s: any) =>
                s.ACTIVITY_BY.includes(this.actBy)
              );

              this.activityList.forEach((element) => {
                if (this.literalActivites.includes(element.ACT_NAME) == false) {
                  this.literalActivites.push(
                    element.ACT_CODE + '-' + element.ACT_NAME
                  );
                }
              });
              add.push(
                this._formBuilder.group({
                  ID: [element.ID],
                  BOOKING_NO: [element.BOOKING_NO],
                  CRO_NO: [element.CRO_NO],
                  CONTAINER_NO: [element.CONTAINER_NO],
                  ACTIVITY: [element.ACT_CODE],
                  PREV_ACTIVITY: [element.PREV_ACT_CODE],
                  ACTIVITY_DATE: [
                    formatDate(element.ACTIVITY_DATE, 'yyyy-MM-dd', 'en'),
                  ],
                  LOCATION: [element.LOCATION],
                  STATUS: [element.STATUS],
                  AGENT_CODE: [element.AGENT_CODE],
                  DEPO_CODE: [element.DEPO_CODE],
                  CREATED_BY: [element.CREATED_BY],
                  NEXT_ACTIVITY_LIST: [this.literalActivites],
                })
              );
            }
          });
        } else {
          add.push(
            this._formBuilder.group({
              ID: [element.ID],
              BOOKING_NO: [element.BOOKING_NO],
              CRO_NO: [element.CRO_NO],
              CONTAINER_NO: [element.CONTAINER_NO],
              ACTIVITY: [element.ACT_CODE],
              PREV_ACTIVITY: [element.PREV_ACT_CODE],
              ACTIVITY_DATE: [
                formatDate(element.ACTIVITY_DATE, 'yyyy-MM-dd', 'en'),
              ],
              LOCATION: [element.LOCATION],
              STATUS: [element.STATUS],
              AGENT_CODE: [element.AGENT_CODE],
              DEPO_CODE: [element.DEPO_CODE],
              CREATED_BY: [element.CREATED_BY],
              NEXT_ACTIVITY_LIST: [
                element.NEXT_ACTIVITY_LIST.filter((s: string) =>
                  s?.split('-')[2].includes(this.actBy)
                ),
              ],
            })
          );
        }
      });
    }
  }

  copyDate() {
    this.commonDate = this.cmForm.value.CONTAINER_LIST2[0].ACTIVITY_DATE;

    this.cmForm.value.CONTAINER_LIST2.forEach(
      (element: { ACTIVITY_DATE: any; STATUS: any }) => {
        element.ACTIVITY_DATE = formatDate(this.commonDate, 'yyyy-MM-dd', 'en');
        element.STATUS = element.STATUS;
      }
    );
    this.cmForm
      .get('CONTAINER_LIST2')
      ?.setValue(this.cmForm.value.CONTAINER_LIST2);
  }

  copyLocation() {
    this.commonLocation = this.cmForm.value.CONTAINER_LIST2[0].LOCATION;
    this.cmForm.value.CONTAINER_LIST2.forEach((element: { LOCATION: any }) => {
      element.LOCATION = this.commonLocation;
    });
    this.cmForm
      .get('CONTAINER_LIST2')
      ?.setValue(this.cmForm.value.CONTAINER_LIST2);
  }

  getSingleContainer() {
    this.resetContainerMovement();
    if (this.cmForm.get('CONTAINER_NO')?.value == '') {
      alert('Please enter Container No.');
      this.showFields = false;
    } else {
      this.contNo = this.cmForm.get('CONTAINER_NO')?.value;
      this._cmService.getSingleCM(this.contNo).subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.singleCM = res.Data;

          this.cmForm.get('BOOKING_NO')?.setValue(this.singleCM?.BOOKING_NO);
          this.cmForm.get('CRO_NO')?.setValue(this.singleCM?.CRO_NO);
          this.cmForm.get('ACTIVITY')?.setValue(this.singleCM?.ACTIVITY);
          this.cmForm
            .get('PREV_ACTIVITY')
            ?.setValue(this.singleCM?.PREV_ACTIVITY);
          this.cmForm
            .get('ACTIVITY_DATE')
            ?.setValue(
              formatDate(this.singleCM?.ACTIVITY_DATE, 'yyyy-MM-dd', 'en')
            );
          this.cmForm.get('LOCATION')?.setValue(this.singleCM?.LOCATION);
          this.cmForm.get('STATUS')?.setValue(this.singleCM?.STATUS);
          this.cmForm.get('AGENT_CODE')?.setValue(this.singleCM?.AGENT_CODE);
          this.cmForm.get('DEPO_CODE')?.setValue(this.singleCM?.DEPO_CODE);

          if (this.singleCM?.PREV_ACTIVITY != '') {
            this._actService
              .getActivityByCode(this.singleCM?.PREV_ACTIVITY)
              .subscribe((res: any) => {
                if (res.ResponseCode == 200) {
                  this.prevData = res.Data;
                  if (this.prevData != null) {
                    this._actService
                      .getMappingById(this.prevData?.ID)
                      .subscribe((res: any) => {
                        this.activityList = [];
                        if (res.ResponseCode == 200) {
                          this.activityList = res.Data.ActivityList;
                          this.activityList = this.activityList.filter(
                            (s: any) => s.ACTIVITY_BY.includes(this.actBy)
                          );
                          const add = this.cmForm.get(
                            'NEXT_ACTIVITY_LIST_SINGLE'
                          ) as FormArray;
                          add.clear();
                          this.activityList.forEach((element) => {
                            add.push(
                              this._formBuilder.group({
                                ID: [element.ID],
                                ACT_NAME: [element.ACT_NAME],
                                ACT_CODE: [element.ACT_CODE],
                                ACT_TYPE: [element.ACT_TYPE],
                                ACTIVITY_BY: [element.ACTIVITY_BY],
                              })
                            );
                          });
                          //this.activityList1 = res.Data;
                        }
                        if (res.ResponseCode == 500) {
                          //alert("It seems like there is no such container, continue with the process to add it's first activity");
                        }
                      });
                  }
                }
                if (res.ResponseCode == 500) {
                  this.activityList = [];
                  this._actService.getActivityList().subscribe((res: any) => {
                    if (res.ResponseCode == 200) {
                      this.activityList = res.Data;
                    }
                  });
                  this.activityList = this.activityList.filter((s: any) =>
                    s.ACTIVITY_BY.includes(this.actBy)
                  );
                  const add = this.cmForm.get(
                    'NEXT_ACTIVITY_LIST_SINGLE'
                  ) as FormArray;
                  add.clear();
                  this.activityList.forEach((element) => {
                    add.push(
                      this._formBuilder.group({
                        ID: [element.ID],
                        ACT_NAME: [element.ACT_NAME],
                        ACT_CODE: [element.ACT_CODE],
                        ACT_TYPE: [element.ACT_TYPE],
                        ACTIVITY_BY: [element.ACTIVITY_BY],
                      })
                    );
                  });
                }
              });
          } else {
            //this.activityList=[];
            this._actService.getActivityList().subscribe((res: any) => {
              if (res.ResponseCode == 200) {
                this.activityList = res.Data;
              }
            });
            this.activityList = this.activityList.filter((s: any) =>
              s.ACTIVITY_BY.includes(this.actBy)
            );
            const add = this.cmForm.get(
              'NEXT_ACTIVITY_LIST_SINGLE'
            ) as FormArray;
            add.clear();
            this.activityList.forEach((element) => {
              add.push(
                this._formBuilder.group({
                  ID: [element.ID],
                  ACT_NAME: [element.ACT_NAME],
                  ACT_CODE: [element.ACT_CODE],
                  ACT_TYPE: [element.ACT_TYPE],
                  ACTIVITY_BY: [element.ACTIVITY_BY],
                })
              );
            });
          }
          this.showFields = true;
        }
        if (res.ResponseCode == 500) {
          // if(this.currentUser=="agent"){
          //   alert("Sorry, you are not authorized to add a new container.Try with existing container number");
          //   this.showFields=false;

          // }
          if (this.roleCode == '1') {
            alert(
              'Sorry, you are not authorized to add a new container.Try with existing container number'
            );
            this.showFields = false;
          } else {
            alert(
              "It seems like there is no such container, continue with the process to add it's first activity"
            );

            this._actService.getActivityList().subscribe((res: any) => {
              if (res.ResponseCode == 200) {
                this.activityList = res.Data;
              }
            });
            this.activityList = this.activityList.filter((s: any) =>
              s.ACTIVITY_BY.includes(this.actBy)
            );
            const add = this.cmForm.get(
              'NEXT_ACTIVITY_LIST_SINGLE'
            ) as FormArray;
            add.clear();
            this.activityList.forEach((element) => {
              add.push(
                this._formBuilder.group({
                  ID: [element.ID],
                  ACT_NAME: [element.ACT_NAME],
                  ACT_CODE: [element.ACT_CODE],
                  ACT_TYPE: [element.ACT_TYPE],
                  ACTIVITY_BY: [element.ACTIVITY_BY],
                })
              );
            });
            this.showFields = true;
          }
        }
      });
    }
  }

  getContainerList() {
    if (this.cmForm.get('BKCR_NO')?.value == '') {
      alert('Please enter Booking/CRO No.');
    } else {
      this.showTable = false;
      this.containerList = [];

      this.bkcr = this.cmForm.get('BKCR_NO')?.value;
      if (this.bkcr.substring(0, 2) == 'BK') {
        this.cm.BOOKING_NO = this.bkcr;
        this._cmService.getContainerMovement(this.cm).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            if (res.Data?.length != 0) {
              this.containerList = res.Data;

              this.initializeMovementList();
              this.showTable = true;
              this.previewNoData = false;
            }

            // this.containerList = res.Data;
            // if(this.containerList?.length!=0){
            //   this.initializeMovementList();
            //   this.showTable=true;
            //   this.previewNoData=false;
            // }
            else if (res.Data?.length == 0) {
              this.showTable = false;
              this.previewNoData = true;
            }
          }
          if (res.ResponseCode == 500) {
            this.showTable = false;
            this.previewNoData = true;
          }
        });
      } else if (this.bkcr.substring(0, 2) == 'CR') {
        this.cm.CRO_NO = this.bkcr;
        this._cmService.getContainerMovement(this.cm).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            if (res.Data?.length != 0) {
              this.containerList = res.Data;

              this.initializeMovementList();
              this.showTable = true;
              this.previewNoData = false;
            }

            // this.containerList = res.Data;
            // if(this.containerList?.length!=0){
            //   this.initializeMovementList();
            //   this.showTable=true;
            //   this.previewNoData=false;
            // }
            else if (res.Data?.length == 0) {
              this.showTable = false;
              this.previewNoData = true;
            }
          }
          if (res.ResponseCode == 500) {
            this.showTable = false;
            this.previewNoData = true;
          }
        });
      } else {
        alert('Incorrect prefix characters!');
      }
    }
  }

  showDynamicFields() {
    this.manually = this.cmForm.get('MANUALLY')?.value;
  }

  saveCMList() {
    this.submitted = true;
    this.cmForm.get('CONTAINER_NO')?.setValue('');
    this.cmForm.get('BOOKING_NO')?.setValue(this.bkcr);
    this.cmForm.get('CRO_NO')?.setValue('');
    this.cmForm.get('ACTIVITY_DATE')?.setValue(new Date());
    if (this.roleCode == '1') {
      this.cmForm.get('AGENT_CODE')?.setValue(this._cs.getUserCode());
      //this.cmForm.get('DEPO_CODE')?.setValue("");
    } else if (this.roleCode == '3') {
      //this.cmForm.get('AGENT_CODE')?.setValue("");
      this.cmForm.get('DEPO_CODE')?.setValue(this._cs.getUserCode());
    }

    this.cmForm.get('CREATED_BY')?.setValue(this._cs.getUserName());
    this.cmForm.get('CURRENT_LOCATION')?.setValue('Dammam');
    if (this.cmForm.get('CONTAINER_MOVEMENT_LIST')?.value == '') {
      alert("Please select atleast one container to update it's movement");
    } else {
      this.contTrack = new CONTAINER_TRACKING();
      this.contTrack.ACTIVITY_DATE = formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.contTrack.CONTAINER_MOVEMENT_LIST = this.cmForm.get(
        'CONTAINER_MOVEMENT_LIST'
      )?.value;
      this._cmService
        .postContainerMovement(
          JSON.stringify(this.cmForm.getRawValue()),
          this.fromXL
        )
        .subscribe((res: any) => {
          if (res.responseCode == 200) {
            //this.onSuccess("Container Movement saved successfully !");
            this._cmService
              .postTrackingHistory(this.contTrack)
              .subscribe((res: any) => {
                if (res.responseCode == 200) {
                  alert('Container Movement saved successfully !');
                  this._router.navigateByUrl('/home/new-track');
                }
                if (res.responseCode == 500) {
                  alert('Container Movement failed !Try Again');
                  //this._router.navigateByUrl('/home/tracking');
                }
              });
          }
        });
    }
  }

  saveContainerMovement() {
    this.submitted = true;
    if (this.roleCode == '1') {
      this.cmForm.get('AGENT_CODE')?.setValue(this._cs.getUserCode());
      //this.cmForm.get('DEPO_CODE')?.setValue("");
    } else if (this.roleCode == '3') {
      //this.cmForm.get('AGENT_CODE')?.setValue("");
      this.cmForm.get('DEPO_CODE')?.setValue(this._cs.getUserCode());
    }

    this.cmForm.get('CREATED_BY')?.setValue(this._cs.getUserName());
    this.cmForm.get('CURRENT_LOCATION')?.setValue('Dammam');

    this.contTrack = new CONTAINER_TRACKING();
    this.contTrack.CONTAINER_NO = this.cmForm.get('CONTAINER_NO')?.value;
    this.contTrack.BOOKING_NO = this.cmForm.get('BOOKING_NO')?.value;
    this.contTrack.CRO_NO = this.cmForm.get('CRO_NO')?.value;
    this.contTrack.ACTIVITY = this.cmForm.get('ACTIVITY')?.value;
    this.contTrack.ACTIVITY_DATE = this.cmForm.get('ACTIVITY_DATE')?.value;
    this.contTrack.PREV_ACTIVITY = this.cmForm.get('PREV_ACTIVITY')?.value;
    this.contTrack.LOCATION = this.cmForm.get('LOCATION')?.value;
    this.contTrack.STATUS = this.cmForm.get('STATUS')?.value;
    this.contTrack.AGENT_CODE = this.cmForm.get('AGENT_CODE')?.value;
    this.contTrack.DEPO_CODE = this.cmForm.get('DEPO_CODE')?.value;
    this.contTrack.CREATED_BY = this.cmForm.get('CREATED_BY')?.value;

    this._cmService
      .postContainerMovement(
        JSON.stringify(this.cmForm.getRawValue()),
        this.fromXL
      )
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          //this.onSuccess("Container Movement saved successfully !");
          this._cmService
            .postTrackingHistory(this.contTrack)
            .subscribe((res: any) => {
              if (res.responseCode == 200) {
                alert('Container Movement saved successfully !');
                this._router.navigateByUrl('/home/new-track');
              }
              if (res.responseCode == 500) {
                alert('Container Movement failed !Try Again');
                //this._router.navigateByUrl('/home/tracking');
              }
            });
        }
      });
  }

  resetContainerMovement() {
    this.submitted = false;
    this.cmForm.get('ACTIVITY')?.setValue('');
    this.cmForm.get('ACTIVITY_DATE')?.setValue('');
    this.cmForm.get('LOCATION')?.setValue('');
    this.cmForm.get('STATUS')?.setValue('');
    this.cmForm.get('AGENT_CODE')?.setValue('');
    this.cmForm.get('DEPO_CODE')?.setValue('');
  }

  get f2() {
    var x = this.cmForm.get('CONTAINER_LIST2') as FormArray;
    return x.controls;
  }

  get f() {
    return this.cmForm.controls;
  }

  f1(i: any) {
    return i;
  }

  get formArr() {
    return this.cmForm.get('CONTAINER_MOVEMENT_LIST') as FormArray;
  }

  selectAll() {
    this.contAllChecked = true;
  }
  postSelectedContainerList(item: any, event: any, index: number) {
    if (item == 1) {
      const add = this.cmForm.get('CONTAINER_LIST2') as FormArray;
      const add1 = this.cmForm.get('CONTAINER_MOVEMENT_LIST') as FormArray;
      if (event.target.checked) {
        add.controls.forEach((control) => {
          add1.push(control);
        });

        for (var i: number = 0; i < add.length; i++) {
          (document.getElementById('chck' + i) as HTMLInputElement).checked =
            true;
        }
      } else {
        add1.clear();
        for (var i: number = 0; i < add.length; i++) {
          (document.getElementById('chck' + i) as HTMLInputElement).checked =
            false;
        }
      }
    } else {
      if (event.target.checked) {
        this.formArr.push(item);
      } else {
        this.formArr.removeAt(
          this.formArr.value.findIndex(
            (m: { CONTAINER_NO: any }) =>
              m.CONTAINER_NO === item.value.CONTAINER_NO
          )
        );
      }
    }
  }

  //FILES LOGIC
  onFileChange(ev: any) {
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
          const dataString = JSON.stringify(jsonData);

          var keyArray = [
            'BOOKING_NO',
            'CRO_NO',
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
            this.containerList = jsonData['CM'];
            var isValid = true;

            this.cmTable.forEach((element) => {
              if (
                !this.checkNullEmpty([
                  element.BOOKING_NO,
                  element.CRO_NO,
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

            this.containerList.forEach((element) => {
              if (
                !this.checkNullEmpty([
                  element.BOOKING_NO,
                  element.CRO_NO,
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

            if (isValid) {
              this.cmTable = this.cmTable.filter(
                (v, i, a) =>
                  a.findIndex(
                    (v2) => JSON.stringify(v2) === JSON.stringify(v)
                  ) === i
              );

              this.containerList = this.containerList.filter(
                (v, i, a) =>
                  a.findIndex(
                    (v2) => JSON.stringify(v2) === JSON.stringify(v)
                  ) === i
              );

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

  checkNullEmpty(param: any) {
    var x = true;
    param.forEach((element: any) => {
      if (element == null || element == '' || element == undefined) {
        x = false;
      }
    });
    return x;
  }

  isSameColumn(arr1: any, arr2: any) {
    return true;
    //return $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0;
  }

  openMyPreview() {
    var fileExist = document.getElementById('file')?.innerHTML;
    if (fileExist != '') {
      var element = document.getElementById('openModalButton') as HTMLElement;
      element.click();
    } else {
      alert('Please upload a file to add container movement');
    }
  }
  getCMForm() {
    if (this.roleCode == '1') {
      this.agentXLCode = this._cs.getUserCode();
    } else if (this.roleCode == '3') {
      this.depoXLCode = this._cs.getUserCode();
    }
    this.fromXL = true;
    const add = this.cmForm.get('CONTAINER_MOVEMENT_LIST') as FormArray;

    add.clear();
    this.containerList.forEach((element) => {
      add.push(
        this._formBuilder.group({
          ID: [0],
          BOOKING_NO: [element.BOOKING_NO],
          CRO_NO: [element.CRO_NO],
          CONTAINER_NO: [element.CONTAINER_NO],
          ACTIVITY: [element.ACTIVITY],
          PREV_ACTIVITY: [''],
          ACTIVITY_DATE: [element.ACTIVITY_DATE],
          LOCATION: [element.LOCATION],
          CURRENT_LOCATION: ['Dammam'],
          STATUS: [element.STATUS],
          AGENT_CODE: [this.agentXLCode],
          DEPO_CODE: [this.depoXLCode],
          CREATED_BY: [this._cs.getUserName()],
        })
      );
    });

    this.cmForm.get('fromXL')?.setValue(true);
    this.cmForm.get('ACTIVITY_DATE')?.setValue(new Date());
    this._cmService
      .postContainerMovement(JSON.stringify(this.cmForm.value), this.fromXL)
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Container Movement saved successfully !');
          this._router.navigateByUrl('/home/new-track');
        }
      });
  }

  onSuccess(message: any) {
    const temp = {
      title: 'Success',
      content: message,
      type: NotificationType.Success,
    };
    this.ntService.create(temp.title, temp.content, temp.type, temp);
    // this.ntService.create('Success','Container Movement saved successfully!','success');

    // this.ntService.success('Success',message,{
    //   position:['bottom','right'],
    //   timeOut:2000,
    //   animate:'fade',
    //   showProgressBar:true
    // });
  }

  onError(message: any) {
    this.ntService.error('Error', message, {
      position: ['bottom', 'right'],
      timeOut: 2000,
      animate: 'fade',
      showProgressBar: true,
    });
  }
}
