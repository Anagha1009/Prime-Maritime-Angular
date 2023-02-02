import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LINER } from 'src/app/models/liner';
import { CommonService } from 'src/app/services/common.service';
import { LinerService } from 'src/app/services/liner.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-liner-service',
  templateUrl: './liner-service.component.html',
  styleUrls: ['./liner-service.component.scss'],
})
export class LinerServiceComponent implements OnInit {
  LinerServiceform: FormGroup;
  LinerServiceform1: FormGroup;
  ServiceList: any[] = [];
  submitted: boolean;
  isUpdate: boolean = false;
  portList: any[] = [];
  liner: LINER = new LINER();
  isLoading: boolean = false;
  isLoading1: boolean = false;

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _formBuilder: FormBuilder,
    private _linerService: LinerService,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.LinerServiceform = this._formBuilder.group({
      ID: [0],
      LINER_CODE: ['', Validators.required],
      SERVICE_NAME: ['', Validators.required],
      PORT_CODE: ['', Validators.required],
      STATUS: ['', Validators.required],
      CREATED_BY: [''],
    });

    this.LinerServiceform1 = this._formBuilder.group({
      STATUS: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.GetServiceList();
    this.getDropDown();
  }

  get f() {
    return this.LinerServiceform.controls;
  }

  Search() {
    var STATUS =
      this.LinerServiceform1.value.STATUS == null
        ? ''
        : this.LinerServiceform1.value.STATUS;
    var FROM_DATE =
      this.LinerServiceform1.value.FROM_DATE == null
        ? ''
        : this.LinerServiceform1.value.FROM_DATE;
    var TO_DATE =
      this.LinerServiceform1.value.TO_DATE == null
        ? ''
        : this.LinerServiceform1.value.TO_DATE;

    if (STATUS == '' && FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.liner.STATUS = STATUS;
    this.liner.FROM_DATE = FROM_DATE;
    this.liner.TO_DATE = TO_DATE;
    this.isLoading = true;
    this.GetServiceList();
  }

  Clear() {
    this.LinerServiceform1.reset();
    this.LinerServiceform1.get('STATUS')?.setValue('');
    this.liner = new LINER();
    this.isLoading1 = true;
    this.GetServiceList();
  }

  GetServiceList() {
    this._commonService.destroyDT();
    this._linerService.getServiceList(this.liner).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.isLoading = false;
        this.isLoading1 = false;
        this.ServiceList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  GetServiceDetails(ID: number) {
    this._linerService.GetServiceDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        debugger;
        this.LinerServiceform.patchValue(res.Data);
      }
    });
  }

  InsertService() {
    this.submitted = true;
    if (this.LinerServiceform.invalid) {
      return;
    }

    this.LinerServiceform.get('CREATED_BY')?.setValue(
      localStorage.getItem('username')
    );

    this._linerService
      .postService(JSON.stringify(this.LinerServiceform.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been inserted successfully !'
          );
          this.GetServiceList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  getDropDown() {
    this._commonService.getDropdownData('PORT').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.portList = res.Data;
      }
    });
  }

  UpdateService() {
    this.submitted = true;
    if (this.LinerServiceform.invalid) {
      return;
    }

    this._linerService
      .updateService(JSON.stringify(this.LinerServiceform.value))
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this._commonService.successMsg(
            'Your record has been updated successfully !'
          );
          this.GetServiceList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  DeleteService(ID: number) {
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
        this._linerService.deleteService(ID).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
            this.GetServiceList();
          }
        });
      }
    });
  }

  ClearForm() {
    this.LinerServiceform.reset();
    this.LinerServiceform.get('ID')?.setValue(0);
    this.LinerServiceform.get('PORT_CODE')?.setValue('');
  }

  openModal(linerID: any = 0) {
    this.submitted = false;
    this.isUpdate = false;
    this.ClearForm();

    if (linerID > 0) {
      this.isUpdate = true;
      this.GetServiceDetails(linerID);
    }

    this.openModalPopup.nativeElement.click();
  }
}
