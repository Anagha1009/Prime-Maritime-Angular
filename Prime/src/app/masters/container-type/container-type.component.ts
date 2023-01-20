import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CONTAINER } from 'src/app/models/container';
import { TYPE } from 'src/app/models/type';
import { CommonService } from 'src/app/services/common.service';
import { ContainerTypeService } from 'src/app/services/container-type.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-container-type',
  templateUrl: './container-type.component.html',
  styleUrls: ['./container-type.component.scss'],
})
export class ContainerTypeComponent implements OnInit {
  submitted: boolean = false;
  containerTypeForm: FormGroup;
  containerTypeForm1: FormGroup;
  containerTypeList: any[] = [];
  isUpdate: boolean = false;
  isLoading: boolean = false;
  isLoading1: boolean = false;

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _containerTypeService: ContainerTypeService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.containerTypeForm = this._formBuilder.group({
      ID: [0],
      CONT_TYPE_CODE: ['', Validators.required],
      CONT_TYPE: ['', Validators.required],
      CONT_SIZE: ['', Validators.required],
      ISO_CODE: ['', Validators.required],
      TEUS: ['', Validators.required],
      OUT_DIM: ['', Validators.required],
      STATUS: ['', Validators.required],
      CREATED_BY: [''],
    });

    this.containerTypeForm1 = this._formBuilder.group({
      CONT_TYPE_CODE: [''],
      CONT_TYPE: [''],
      CONT_SIZE: [''],
      STATUS: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.GetConatinerTypeMasterList();
  }

  get f() {
    return this.containerTypeForm.controls;
  }

  Search() {}

  Clear() {}

  GetConatinerTypeMasterList() {
    this._commonService.destroyDT();

    this._containerTypeService
      .GetContainerTypeMasterList()
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.containerTypeList = res.Data;
        }
        this._commonService.getDT();
      });
  }

  InsertContainerTypeMaster() {
    this.submitted = true;
    if (this.containerTypeForm.invalid) {
      return;
    }

    this.containerTypeForm
      .get('CREATED_BY')
      ?.setValue(localStorage.getItem('username'));

    this._containerTypeService
      .postContainerType(JSON.stringify(this.containerTypeForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been inserted successfully !'
          );
          this.GetConatinerTypeMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  GetContainerTypeDetails(typeId: number) {
    this._containerTypeService
      .GetContainerTypeDetails(typeId)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.containerTypeForm.patchValue(res.Data);
        }
      });
  }

  UpdateContainerTypeMaster() {
    this.submitted = true;
    if (this.containerTypeForm.invalid) {
      return;
    }

    this._containerTypeService
      .updateContainerType(JSON.stringify(this.containerTypeForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been updated successfully !'
          );
          this.GetConatinerTypeMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  DeleteConatinerTypemaster(ID: number) {
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
        this._containerTypeService
          .DeleteContainerType(ID)
          .subscribe((res: any) => {
            if (res.ResponseCode == 200) {
              Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
              this.GetConatinerTypeMasterList();
            }
          });
      }
    });
  }

  ClearForm() {
    this.containerTypeForm.reset();
    this.containerTypeForm.get('ID')?.setValue(0);
  }

  openModal(typeID: any = 0) {
    this.submitted = false;
    this.isUpdate = false;
    this.ClearForm();

    if (typeID > 0) {
      this.isUpdate = true;
      this.GetContainerTypeDetails(typeID);
    }

    this.openModalPopup.nativeElement.click();
  }
}
