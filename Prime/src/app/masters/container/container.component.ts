import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CONTAINER } from 'src/app/models/container';
import { CommonService } from 'src/app/services/common.service';
import { ContainerService } from 'src/app/services/container.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
})
export class ContainerComponent implements OnInit {
  submitted: boolean = false;
  containerForm: FormGroup;
  containerList: any[] = [];
  containerTypeList: any[] = [];
  isUpdate: boolean = false;
  container: CONTAINER = new CONTAINER();
  contForm: FormGroup;
  masterForm: FormGroup;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  portList: any[] = [];

  @ViewChild('openModalPopup') openModalPopup: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;

  constructor(
    private _containerService: ContainerService,
    private _commonService: CommonService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.containerForm = this._formBuilder.group({
      ID: [0],
      CONTAINER_NO: ['', Validators.required],
      CONTAINER_TYPE: ['', Validators.required],
      ONHIRE_DATE: ['', Validators.required],
      ONHIRE_LOCATION: ['', Validators.required],
      LEASED_FROM: ['', Validators.required],
      STATUS: ['', Validators.required],
    });

    this.contForm = this._formBuilder.group({
      CONTAINER_NO: [''],
      CONTAINER_TYPE: [''],
      CONTAINER_SIZE: [''],
      ONHIRE_DATE: [''],
      STATUS: [''],
    });

    this.GetContainerMasterList();
    this.getDropdown();
  }

  get f() {
    return this.containerForm.controls;
  }

  getDropdown() {
    this._commonService
      .getDropdownData('CONTAINER_TYPE')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.containerTypeList = res.Data;
        }
      });

    this._commonService.getDropdownData('PORT').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.portList = res.Data;
      }
    });
  }

  InsertContainer() {
    this.submitted = true;

    if (this.containerForm.invalid) {
      return;
    }

    this._containerService
      .postContainer(JSON.stringify(this.containerForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been inserted successfully !'
          );
          this.GetContainerMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  GetContainerMasterList() {
    this._commonService.destroyDT();

    this._containerService
      .GetContainerMasterList(this.container)
      .subscribe((res: any) => {
        this.isLoading = false;
        this.isLoading1 = false;
        if (res.ResponseCode == 200) {
          this.containerList = res.Data;
        }
        this._commonService.getDT();
      });
  }

  Search() {
    var CONTAINER_NO =
      this.contForm.value.CONTAINER_NO == null
        ? ''
        : this.contForm.value.CONTAINER_NO;
    var CONTAINER_TYPE =
      this.contForm.value.CONTAINER_TYPE == null
        ? ''
        : this.contForm.value.CONTAINER_TYPE;
    var CONTAINER_SIZE =
      this.contForm.value.CONTAINER_SIZE == null
        ? ''
        : this.contForm.value.CONTAINER_SIZE;
    var ONHIRE_DATE =
      this.contForm.value.ONHIRE_DATE == null
        ? ''
        : this.contForm.value.ONHIRE_DATE;
    var STATUS =
      this.contForm.value.STATUS == null ? '' : this.contForm.value.STATUS;

    if (
      CONTAINER_NO == '' &&
      CONTAINER_TYPE == '' &&
      CONTAINER_SIZE == '' &&
      ONHIRE_DATE == '' &&
      STATUS == ''
    ) {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.container.CONTAINER_NO = CONTAINER_NO;
    this.container.CONTAINER_TYPE = CONTAINER_TYPE;
    this.container.CONTAINER_SIZE = CONTAINER_SIZE;
    this.container.ONHIRE_DATE = ONHIRE_DATE;
    this.container.STATUS = STATUS;
    this.isLoading = true;
    this.GetContainerMasterList();
  }

  ClearForm() {
    this.containerForm.reset();
    this.containerForm.get('ID')?.setValue(0);
    this.containerForm.get('CONTAINER_SIZE')?.setValue('');
  }

  Clear() {
    this.contForm.reset();
    this.contForm.get('CONTAINER_TYPE')?.setValue('');
    this.contForm.get('STATUS')?.setValue('');
    this.container = new CONTAINER();
    this.isLoading1 = true;
    this.GetContainerMasterList();
  }

  GetContainerMasterDetails(containerId: number) {
    var containerModel = new CONTAINER();
    containerModel.ID = containerId;

    this._containerService
      .GetContainerMasterDetails(containerModel)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.containerForm.patchValue(res.Data);
          this.containerForm
            .get('ONHIRE_DATE')
            ?.setValue(formatDate(res.Data.ONHIRE_DATE, 'yyyy-MM-dd', 'en'));
        }
      });
  }

  updateContainerMaster() {
    this.submitted = true;
    if (this.containerForm.invalid) {
      return;
    }

    this._containerService
      .updateContainerMaster(JSON.stringify(this.containerForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been updated successfully !'
          );
          this.GetContainerMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  deleteContainerMaster(containerId: number) {
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
        this._containerService
          .deleteContainerMaster(containerId)
          .subscribe((res: any) => {
            if (res.ResponseCode == 200) {
              Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
              this.GetContainerMasterList();
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
      this.GetContainerMasterDetails(ID);
    }

    this.openModalPopup.nativeElement.click();
  }
}
