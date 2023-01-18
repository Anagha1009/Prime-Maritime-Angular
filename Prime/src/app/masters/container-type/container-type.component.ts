import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CONTAINER } from 'src/app/models/container';
import { TYPE } from 'src/app/models/type';
import { CommonService } from 'src/app/services/common.service';
import { ContainerTypeService } from 'src/app/services/container-type.service';

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
  conttype: CONTAINER = new CONTAINER();

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
    });

    this.GetConatinerTypeMasterList();
  }

  get f() {
    return this.containerTypeForm.controls;
  }

  Search() {}

  Clear() {}

  GetConatinerTypeMasterList() {
    var containerTypeModel = new TYPE();
    containerTypeModel.CREATED_BY = localStorage.getItem('usercode');

    this._commonService.destroyDT();

    this._containerTypeService
      .GetContainerTypeMasterList(containerTypeModel)
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
          alert('Your record has been submitted successfully !');
          this.GetConatinerTypeMasterList();
          this.ClearForm();
          this.submitted = false;
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
          this.isUpdate = true;
        }
      });
  }

  UpdateContainerTypeMaster() {
    this.containerTypeForm
      .get('CREATED_BY')
      ?.setValue(localStorage.getItem('username'));

    this._containerTypeService
      .updateContainerType(JSON.stringify(this.containerTypeForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your party master has been Updated successfully !');
          this.GetConatinerTypeMasterList();
          this.ClearForm();
          this.isUpdate = false;
          this.submitted = false;
          this.closeBtn.nativeElement.click();
        }
      });
  }

  DeleteConatinerTypemaster(ID: number) {
    if (confirm('Are you sure want to delete this record ?')) {
      this._containerTypeService
        .DeleteContainerType(ID)
        .subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            alert('Your record has been deleted successfully !');
            this.GetConatinerTypeMasterList();
          }
        });
    }
  }

  ClearForm() {
    this.containerTypeForm.reset();
  }

  openModal(typeID: any = 0) {
    this.submitted = false;
    this.ClearForm();

    if (typeID > 0) {
      this.GetContainerTypeDetails(typeID);
    }

    this.openModalPopup.nativeElement.click();
  }
}
