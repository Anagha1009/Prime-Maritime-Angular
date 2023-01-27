import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CONTAINER_MOVEMENT } from 'src/app/models/cm';
import { CmService } from 'src/app/services/cm.service';
import { CommonService } from 'src/app/services/common.service';

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
  cmForm: FormGroup;

  @ViewChild('openModalPopup') openModalPopup: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;

  constructor(
    private _CMService: CmService,
    private _commonService: CommonService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cmForm = this._formBuilder.group({
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
      CURR_ACT_CODE: [''],
      CURR_ACT_CODE2: [''],
      ACTIVITY_DATE: [''],
      LOCATION: [''],
      STATUS: [''],
      NEXT_ACTIVITY_LIST: new FormArray([]),
    });
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
      }
    });

    this.openModalPopup.nativeElement.click();
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

  updateMovement() {
    this._CMService
      .updateContMov(JSON.stringify(this.containerMovementForm.value))
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.closeBtn.nativeElement.click();
          this._commonService.successMsg(
            'Container Movement has been updated successfully !'
          );
          this.getCMList();
        }
      });
  }

  switchToggle(event: any) {
    this.ismanually = event.target.checked;
  }
}
