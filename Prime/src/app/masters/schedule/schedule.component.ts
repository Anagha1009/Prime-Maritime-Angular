import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SCHEDULE } from 'src/app/models/vessel';
import { CommonService } from 'src/app/services/common.service';
import { VesselService } from 'src/app/services/vessel.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  ScheduleForm: FormGroup;
  ScheduleForm1: FormGroup;
  servicenameList: any[] = [];
  ScheduleList: any[] = [];
  portList: any[] = [];
  vesselList: any[] = [];
  vesselList1: any[] = [];
  submitted: boolean;
  isUpdate: boolean = false;
  servicenameList1: any[] = [];
  slotDetailsForm: FormGroup;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  schedule: SCHEDULE = new SCHEDULE();

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _scheduleService: VesselService
  ) {}

  ngOnInit(): void {
    this.ScheduleForm = this._formBuilder.group({
      ID: [0],
      VESSEL_NAME: ['', Validators.required],
      SERVICE_NAME: ['', Validators.required],
      PORT_CODE: ['', Validators.required],
      VIA_NO: ['', Validators.required],
      ETA: ['', Validators.required],
      ETD: ['', Validators.required],
      STATUS: ['', Validators.required],
      CREATED_BY: [''],
    });

    this.ScheduleForm1 = this._formBuilder.group({
      VESSEL_NAME: [''],
      PORT_CODE: [''],
      STATUS: [''],
      ETA: [''],
      ETD: [''],
    });

    this.getDropdown();
    this.GetScheduleList();
  }

  openModal(ID: any = 0) {
    this.submitted = false;
    this.isUpdate = false;
    this.ClearForm();

    if (ID > 0) {
      this.isUpdate = true;
      this.GetScheduleDetails(ID);
    }

    this.openModalPopup.nativeElement.click();
  }

  GetScheduleList() {
    this._commonService.destroyDT();
    this._scheduleService
      .getScheduleList(this.schedule)
      .subscribe((res: any) => {
        this.isLoading = false;
        this.isLoading1 = false;
        if (res.ResponseCode == 200) {
          this.ScheduleList = res.Data;
        }
        this._commonService.getDT();
      });
  }

  GetScheduleDetails(ID: number) {
    this._scheduleService.GetScheduleDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.ScheduleForm.patchValue(res.Data);
        this.ScheduleForm.get('ETA')?.setValue(
          formatDate(res.Data.ETA, 'yyyy-MM-dd', 'en')
        );
        this.ScheduleForm.get('ETD')?.setValue(
          formatDate(res.Data.ETD, 'yyyy-MM-dd', 'en')
        );
      }
    });
  }

  InsertSchedule() {
    this.submitted = true;
    if (this.ScheduleForm.invalid) {
      return;
    }

    this.ScheduleForm.get('CREATED_BY')?.setValue(
      localStorage.getItem('username')
    );

    this._scheduleService
      .postSchedule(JSON.stringify(this.ScheduleForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been inserted successfully !'
          );
          this.GetScheduleList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  ClearForm() {
    this.ScheduleForm.reset();
    this.ScheduleForm.get('ID')?.setValue(0);
  }

  Clear() {
    this.ScheduleForm1.reset();
    this.ScheduleForm1.get('STATUS')?.setValue('');
    this.ScheduleForm1.get('VESSEL_NAME')?.setValue('');
    this.ScheduleForm1.get('PORT_CODE')?.setValue('');
    this.schedule = new SCHEDULE();
    this.isLoading1 = true;
    this.GetScheduleList();
  }

  getDropdown() {
    this._commonService.getDropdownData('VESSEL_NAME').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.vesselList = res.Data;
        this.vesselList1 = res.Data;
      }
    });

    this._commonService.getDropdownData('PORT').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.portList = res.Data;
      }
    });
  }

  UpdateSchedule() {
    this.submitted = true;
    if (this.ScheduleForm.invalid) {
      return;
    }

    this._scheduleService
      .updateSchedule(JSON.stringify(this.ScheduleForm.value))
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this._commonService.successMsg(
            'Your record has been Updated successfully !'
          );
          this.GetScheduleList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  DeleteSchedule(ID: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this._scheduleService.deleteSchedule(ID).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
            this.GetScheduleList();
          }
        });
      }
    });
  }

  getServiceName1(event: any) {
    this.servicenameList1 = [];
    //this.slotDetailsForm.get('SERVICE_NAME')?.setValue('');
    this._commonService
      .getDropdownData('SERVICE_NAME', event, '')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.servicenameList1 = res.Data;
        }
      });
  }

  Search() {
    var VESSEL_NAME =
      this.ScheduleForm1.value.VESSEL_NAME == null
        ? ''
        : this.ScheduleForm1.value.VESSEL_NAME;
    var PORT_CODE =
      this.ScheduleForm1.value.PORT_CODE == null
        ? ''
        : this.ScheduleForm1.value.PORT_CODE;
    var STATUS =
      this.ScheduleForm1.value.STATUS == null
        ? ''
        : this.ScheduleForm1.value.STATUS;
    var ETA =
      this.ScheduleForm1.value.ETA == null ? '' : this.ScheduleForm1.value.ETA;
    var ETD =
      this.ScheduleForm1.value.ETD == null ? '' : this.ScheduleForm1.value.ETD;

    if (
      VESSEL_NAME == '' &&
      PORT_CODE == '' &&
      STATUS == '' &&
      ETA == '' &&
      ETD == ''
    ) {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.schedule.VESSEL_NAME = VESSEL_NAME;
    this.schedule.PORT_CODE = PORT_CODE;
    this.schedule.STATUS = STATUS;
    this.schedule.ETA = ETA;
    this.schedule.ETD = ETD;
    this.isLoading = true;
    this.GetScheduleList();
  }

  get f() {
    return this.ScheduleForm.controls;
  }
}
