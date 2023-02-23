import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MASTER } from 'src/app/models/master';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-servicetype',
  templateUrl: './servicetype.component.html',
  styleUrls: ['./servicetype.component.scss'],
})
export class ServicetypeComponent implements OnInit {
  submitted: boolean = false;
  typeForm: FormGroup;
  typeForm1: FormGroup;
  TypeList: any[] = [];
  isUpdate: boolean = false;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  master: MASTER = new MASTER();

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _masterService: MasterService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.typeForm = this._formBuilder.group({
      ID: [0],
      KEY_NAME: [''],
      CODE: ['', Validators.required],
      CODE_DESC: ['', Validators.required],
      STATUS: ['', Validators.required],
      CREATED_BY: [''],
    });

    this.typeForm1 = this._formBuilder.group({
      STATUS: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.GetServiceTypeMasterList();
  }

  get f() {
    return this.typeForm.controls;
  }

  InsertServiceTypeMaster() {
    this.submitted = true;
    if (this.typeForm.invalid) {
      return;
    }
    this.typeForm
      .get('CREATED_BY')
      ?.setValue(this._commonService.getUserName());
    this.typeForm.get('KEY_NAME')?.setValue('SERVICE_TYPE');

    this._masterService
      .InsertMaster(JSON.stringify(this.typeForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been inserted successfully !'
          );
          this.GetServiceTypeMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  GetServiceTypeMasterList() {
    this._commonService.destroyDT();
    this.master.KEY_NAME = 'SERVICE_TYPE';
    this._masterService.GetMasterList(this.master).subscribe((res: any) => {
      this.isLoading = false;
      this.isLoading1 = false;
      if (res.ResponseCode == 200) {
        this.TypeList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  GetServiceTypeMasterDetails(ID: number) {
    this._masterService.GetMasterDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.typeForm.patchValue(res.Data);
      }
    });
  }

  UpdateServiceTypeMaster() {
    this.submitted = true;
    if (this.typeForm.invalid) {
      return;
    }

    this.typeForm.get('KEY_NAME')?.setValue('SERVICE_TYPE');

    this._masterService
      .UpdateMaster(JSON.stringify(this.typeForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been Updated successfully !'
          );
          this.GetServiceTypeMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  Search() {
    var STATUS =
      this.typeForm1.value.STATUS == null ? '' : this.typeForm1.value.STATUS;
    var FROM_DATE =
      this.typeForm1.value.FROM_DATE == null
        ? ''
        : this.typeForm1.value.FROM_DATE;
    var TO_DATE =
      this.typeForm1.value.TO_DATE == null ? '' : this.typeForm1.value.TO_DATE;

    if (STATUS == '' && FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
    }

    this.master.STATUS = STATUS;
    this.master.FROM_DATE = FROM_DATE;
    this.master.TO_DATE = TO_DATE;

    this.isLoading = true;
    this.GetServiceTypeMasterList();
  }

  ClearForm() {
    this.typeForm.reset();
    this.typeForm.get('ID')?.setValue(0);
  }

  Clear() {
    this.typeForm1.reset();
    this.typeForm1.get('STATUS')?.setValue('');
    this.master = new MASTER();
    this.isLoading1 = true;
    this.GetServiceTypeMasterList();
  }

  openModal(ID: any = 0) {
    this.submitted = false;
    this.isUpdate = false;
    this.ClearForm();

    if (ID > 0) {
      this.isUpdate = true;
      this.GetServiceTypeMasterDetails(ID);
    }

    this.openModalPopup.nativeElement.click();
  }

  DeleteServiceTypeMaster(ID: number) {
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
            this.GetServiceTypeMasterList();
          }
        });
      }
    });
  }
}
