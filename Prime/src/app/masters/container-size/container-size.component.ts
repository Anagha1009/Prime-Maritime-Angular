import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MASTER } from 'src/app/models/master';
import { SIZE } from 'src/app/models/size';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-container-size',
  templateUrl: './container-size.component.html',
  styleUrls: ['./container-size.component.scss'],
})
export class ContainerSizeComponent implements OnInit {
  submitted: boolean = false;
  sizeForm: FormGroup;
  sizeForm1: FormGroup;
  SizeList: any[] = [];
  isUpdate: boolean = false;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  size: SIZE = new SIZE();
  master: MASTER = new MASTER();

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _masterService: MasterService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.sizeForm = this._formBuilder.group({
      ID: [0],
      KEY_NAME: ['CONTAINER_SIZE'],
      CODE: ['', Validators.required],
      CODE_DESC: ['', Validators.required],
      STATUS: ['', Validators.required],
      CREATED_BY: [''],
    });

    this.sizeForm1 = this._formBuilder.group({
      STATUS: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.GetContainerSizeList();
  }

  get f() {
    return this.sizeForm.controls;
  }

  Search() {
    var STATUS = this.sizeForm1.value.STATUS;
    var FROM_DATE = this.sizeForm1.value.FROM_DATE;
    var TO_DATE = this.sizeForm1.value.TO_DATE;

    if (STATUS == '' && FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
      return;
    } else if (FROM_DATE > TO_DATE) {
      alert('From Date should be less than To Date !');
      return;
    }

    this.size.STATUS = STATUS;
    this.size.FROM_DATE = FROM_DATE;
    this.size.TO_DATE = TO_DATE;
    this.isLoading = true;
    this.GetContainerSizeList();
  }

  Clear() {}

  InsertContainerSize() {
    this.submitted = true;
    if (this.sizeForm.invalid) {
      return;
    }

    this.sizeForm
      .get('CREATED_BY')
      ?.setValue(this._commonService.getUserName());

    this._masterService
      .InsertMaster(JSON.stringify(this.sizeForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been inserted successfully !'
          );
          this.GetContainerSizeList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  GetContainerSizeList() {
    this._commonService.destroyDT();

    this.master.KEY_NAME = 'CONTAINER_SIZE';
    this._masterService.GetMasterList(this.master).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.SizeList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  GetContainerSizeDetails(ID: number) {
    this._masterService.GetMasterDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.sizeForm.patchValue(res.Data);
      }
    });
  }

  UpdateContainerSize() {
    this.submitted = true;
    if (this.sizeForm.invalid) {
      return;
    }

    this._masterService
      .UpdateMaster(JSON.stringify(this.sizeForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been updated successfully !'
          );
          this.GetContainerSizeList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  ClearForm() {
    this.sizeForm.reset();

    this.sizeForm.get('STATUS')?.setValue('');
    this.sizeForm.get('CODE')?.setValue('');
    this.sizeForm.get('CODE_DESC')?.setValue('');
  }

  DeleteContainerSize(ID: number) {
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
            this.GetContainerSizeList();
          }
        });
      }
    });
  }

  openModal(sizeID: any = 0) {
    this.submitted = false;
    this.isUpdate = false;
    this.ClearForm();

    if (sizeID > 0) {
      this.isUpdate = true;
      this.GetContainerSizeDetails(sizeID);
    }

    this.openModalPopup.nativeElement.click();
  }
}
