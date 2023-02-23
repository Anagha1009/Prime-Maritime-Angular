import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MASTER } from 'src/app/models/master';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-port',
  templateUrl: './port.component.html',
  styleUrls: ['./port.component.scss'],
})
export class PortComponent implements OnInit {
  portForm: FormGroup;
  portForm1: FormGroup;
  PortList: any;
  data: any;
  isUpdate: boolean = false;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  submitted: boolean = false;
  master: MASTER = new MASTER();

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _masterService: MasterService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.portForm = this._formBuilder.group({
      ID: [0],
      KEY_NAME: [''],
      CODE: ['', Validators.required],
      CODE_DESC: ['', Validators.required],
      STATUS: ['', Validators.required],
      CREATED_BY: [''],
    });

    this.portForm1 = this._formBuilder.group({
      STATUS: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.GetPortMasterList();
  }

  get f() {
    return this.portForm.controls;
  }

  GetPortMasterList() {
    this._commonService.destroyDT();
    this.master.KEY_NAME = 'PORT';
    this._masterService.GetMasterList(this.master).subscribe((res: any) => {
      this.isLoading = false;
      this.isLoading1 = false;
      if (res.ResponseCode == 200) {
        this.PortList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  InsertPortMaster() {
    this.submitted = true;
    if (this.portForm.invalid) {
      return;
    }
    this.portForm
      .get('CREATED_BY')
      ?.setValue(this._commonService.getUserName());
    this.portForm.get('KEY_NAME')?.setValue('PORT');

    this._masterService
      .InsertMaster(JSON.stringify(this.portForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been inserted successfully !'
          );
          this.GetPortMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  GetPortMasterDetails(ID: number) {
    this._masterService.GetMasterDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.portForm.patchValue(res.Data);
      }
    });
  }

  UpdatePortMaster() {
    this.submitted = true;
    if (this.portForm.invalid) {
      return;
    }

    this.portForm.get('KEY_NAME')?.setValue('PORT');

    this._masterService
      .UpdateMaster(JSON.stringify(this.portForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been Updated successfully !'
          );
          this.GetPortMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  DeletePortMaster(ID: number) {
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
            this.GetPortMasterList();
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
      this.GetPortMasterDetails(ID);
    }

    this.openModalPopup.nativeElement.click();
  }

  ClearForm() {
    this.portForm.reset();
    this.portForm.get('ID')?.setValue(0);
  }

  Clear() {
    this.portForm1.reset();
    this.portForm1.get('STATUS')?.setValue('');
    this.master = new MASTER();
    this.isLoading1 = true;
    this.GetPortMasterList();
  }

  Search() {
    var STATUS =
      this.portForm1.value.STATUS == null ? '' : this.portForm1.value.STATUS;
    var FROM_DATE =
      this.portForm1.value.FROM_DATE == null
        ? ''
        : this.portForm1.value.FROM_DATE;
    var TO_DATE =
      this.portForm1.value.TO_DATE == null ? '' : this.portForm1.value.TO_DATE;

    if (STATUS == '' && FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
    }

    this.master.STATUS = STATUS;
    this.master.FROM_DATE = FROM_DATE;
    this.master.TO_DATE = TO_DATE;

    this.isLoading = true;
    this.GetPortMasterList();
  }
}
