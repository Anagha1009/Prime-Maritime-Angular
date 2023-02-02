import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MASTER } from 'src/app/models/master';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss'],
})
export class UnitComponent implements OnInit {
  unitForm: any;
  unitForm1: any;
  UnitList: any[] = [];
  isUpdate: boolean = false;
  submitted: boolean = false;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  master: MASTER = new MASTER();

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _masterService: MasterService,
    private _commonService: CommonService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.unitForm = this._formBuilder.group({
      ID: [0],
      KEY_NAME: [''],
      CODE: ['', Validators.required],
      CODE_DESC: ['', Validators.required],
      STATUS: ['', Validators.required],
      CREATED_BY: [''],
    });

    this.unitForm1 = this._formBuilder.group({
      STATUS: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.GetUnitMasterList();
  }

  get f() {
    return this.unitForm.controls;
  }

  InsertUnitMaster() {
    this.submitted = true;
    if (this.unitForm.invalid) {
      return;
    }
    this.unitForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    this.unitForm.get('KEY_NAME')?.setValue('UNIT');

    this._masterService
      .InsertMaster(JSON.stringify(this.unitForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been inserted successfully !'
          );
          this.GetUnitMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  GetUnitMasterList() {
    this._commonService.destroyDT();
    this.master.KEY_NAME = 'UNIT';
    this._masterService.GetMasterList(this.master).subscribe((res: any) => {
      this.isLoading = false;
      this.isLoading1 = false;
      if (res.ResponseCode == 200) {
        this.UnitList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  GetUnitMasterDetails(ID: number) {
    this._masterService.GetMasterDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.unitForm.patchValue(res.Data);
      }
    });
  }

  UpdateUnitMaster() {
    this.submitted = true;
    if (this.unitForm.invalid) {
      return;
    }

    this.unitForm.get('KEY_NAME')?.setValue('UNIT');
    this._masterService
      .UpdateMaster(JSON.stringify(this.unitForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been Updated successfully !'
          );
          this.GetUnitMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  DeleteUnitMaster(ID: number) {
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
        this._masterService.DeleteMaster(ID).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
            this.GetUnitMasterList();
          }
        });
      }
    });
  }

  openModal(ID: any = 0) {
    this.submitted = false;
    this.isUpdate = false;
    this.ClearForm();

    if (ID > 0) {
      this.isUpdate = true;
      this.GetUnitMasterDetails(ID);
    }

    this.openModalPopup.nativeElement.click();
  }

  Search() {
    var STATUS =
      this.unitForm1.value.STATUS == null ? '' : this.unitForm1.value.STATUS;
    var FROM_DATE =
      this.unitForm1.value.FROM_DATE == null
        ? ''
        : this.unitForm1.value.FROM_DATE;
    var TO_DATE =
      this.unitForm1.value.TO_DATE == null ? '' : this.unitForm1.value.TO_DATE;

    if (STATUS == '' && FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
    }

    this.master.STATUS = STATUS;
    this.master.FROM_DATE = FROM_DATE;
    this.master.TO_DATE = TO_DATE;

    this.isLoading = true;
    this.GetUnitMasterList();
  }

  ClearForm() {
    this.unitForm.reset();
    this.unitForm.get('ID')?.setValue(0);
  }

  Clear() {
    this.unitForm1.reset();
    this.unitForm1.get('STATUS')?.setValue('');
    this.master = new MASTER();
    this.isLoading1 = true;
    this.GetUnitMasterList();
  }
}
