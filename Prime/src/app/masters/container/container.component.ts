import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CONTAINER } from 'src/app/models/container';
import { ContainerService } from 'src/app/services/container.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
})
export class ContainerComponent implements OnInit {
  submitted: boolean = false;
  containerForm: FormGroup;
  containerList: any[] = [];
  data: any;
  isUpdate: boolean = false;
  container: CONTAINER;

  constructor(
    private _containerService: ContainerService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.containerForm = this._formBuilder.group({
      ID: [0],
      CONTAINER_NO: ['',Validators.required],
      CONTAINER_TYPE: ['',Validators.required],
      CONTAINER_SIZE: ['',Validators.required],
      IS_OWNED: [false],
      ON_HIRE_DATE: ['',Validators.required],
      OFF_HIRE_DATE: ['',Validators.required],
      MANUFACTURING_DATE: ['',Validators.required],
      SHIPPER_OWNED: [false],
      OWNER_NAME: ['',Validators.required],
      LESSOR_NAME: ['',Validators.required],
      PICKUP_LOCATION: ['',Validators.required],
      DROP_LOCATION: ['',Validators.required],
      CREATED_BY: [''],
      STATUS: ['',Validators.required
    ],
    });

    this.GetContainerMasterList();
  }

  
  get f(){
    return this.containerForm.controls;

 }

  
  Insertcontainersize() {
    this.submitted=true
    if(this.containerForm.invalid){
      return
    }

    this.containerForm
      .get('CREATED_BY')
      ?.setValue(localStorage.getItem('username'));
    var status = this.containerForm.get('STATUS')?.value;
    this.containerForm.get('STATUS')?.setValue(status == 'true' ? true : false);

    this._containerService
      .postContainer(JSON.stringify(this.containerForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your record has been submitted successfully !');
          this.GetContainerMasterList();
          this.ClearForm();
        }
      });
  }

  GetContainerMasterList() {
    var containerModel = new CONTAINER();
    containerModel.CREATED_BY = localStorage.getItem('usercode');

    this._containerService
      .GetContainerMasterList(containerModel)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.containerList = res.Data;
        }
      });
  }

  ClearForm() {
    this.containerForm.reset();
    this.containerForm.get('CONTAINER_NO')?.setValue('');
    this.containerForm.get('CONTAINER_TYPE')?.setValue('');
    this.containerForm.get('CONTAINER_SIZE')?.setValue('');
    this.containerForm.get('STATUS')?.setValue('');
    this.containerForm.get('ON_HIRE_DATE')?.setValue('');
    this.containerForm.get('OFF_HIRE_DATE')?.setValue('');
    this.containerForm.get('MANUFACTURING_DATE')?.setValue('');
    this.containerForm.get('OWNER_NAME')?.setValue('');
    this.containerForm.get('LESSOR_NAME')?.setValue('');
    this.containerForm.get('PICKUP_LOCATION')?.setValue('');
    this.containerForm.get('DROP_LOCATION')?.setValue('');
  }

  GetContainerMasterDetails(containerId: number) {
    var containerModel = new CONTAINER();
    containerModel.CREATED_BY = localStorage.getItem('usercode');
    containerModel.ID = containerId;
    this._containerService
      .GetContainerMasterDetails(containerModel)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.containerForm.patchValue(res.Data);
          this.containerForm.get('OWNER')?.setValue(res.Data.OWNER_NAME);
          this.containerForm
            .get('ON_HIRE_DATE')
            ?.setValue(formatDate(res.Data.ON_HIRE_DATE, 'yyyy-MM-dd', 'en'));
          this.containerForm
            .get('OFF_HIRE_DATE')
            ?.setValue(formatDate(res.Data.OFF_HIRE_DATE, 'yyyy-MM-dd', 'en'));
          this.containerForm
            .get('MANUFACTURING_DATE')
            ?.setValue(
              formatDate(res.Data.MANUFACTURING_DATE, 'yyyy-MM-dd', 'en')
            );
          this.isUpdate = true;
        }
      });
  }

  updateContainerMaster() {
    debugger;
    this.containerForm
      .get('CREATED_BY')
      ?.setValue(localStorage.getItem('username'));

    var status = this.containerForm.get('STATUS')?.value;
    this.containerForm.get('STATUS')?.setValue(status == 'true' ? true : false);

    console.log('sfds ' + JSON.stringify(this.containerForm.value));
    this._containerService
      .updateContainerMaster(JSON.stringify(this.containerForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your party master has been Updated successfully !');
          this.GetContainerMasterList();
          this.containerForm.setValue(this.container);
          this.ClearForm();
          this.isUpdate = false;
        }
      });
  }

  deleteContainerMaster(containerId: number) {
    debugger;
    if (confirm('Are you sure want to delete this record ?')) {
      var containerModel = new CONTAINER();
      containerModel.CREATED_BY = localStorage.getItem('username');
      containerModel.ID = containerId;

      this._containerService
        .deleteContainerMaster(containerModel)
        .subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            alert('Your record has been deleted successfully !');
            this.GetContainerMasterList();
          }
        });
    }
  }
}
