import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  data: any;
  isUpdate: boolean = false;
  container: CONTAINER;
  contForm:FormGroup;
  masterForm:FormGroup;
  isLoading:boolean = false;
  isLoading1:boolean = false;
  CONTAINER: CONTAINER = new CONTAINER();
  
  @ViewChild('openModalPopup') openModalPopup: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;





  constructor(
    private _containerService: ContainerService,
    private _commonService:CommonService,
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

    this.contForm = this._formBuilder.group({
      CONTAINER_NO:[''],
      CONTAINER_TYPE:[''],
      CONTAINER_SIZE:[''],
      ON_HIRE_DATE:[''],
      OFF_HIRE_DATE:['']
    });

    this.GetContainerMasterList();
    this.getDropdown();
  }

  
  get f(){
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
          this.closeBtn.nativeElement.click();

          this.ClearForm();
        }
      });
  }

  GetContainerMasterList() {
    var containerModel = new CONTAINER();
    this._commonService.destroyDT();

    containerModel.CREATED_BY = localStorage.getItem('usercode');

    this._containerService
      .GetContainerMasterList(containerModel)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.containerList = res.Data;
        }
        this._commonService.getDT();

      });
  }
  Search() {
    var CONTAINER_NO = this.containerForm.value.CONTAINER_NO;
    var CONTAINER_TYPE = this.containerForm.value.CONTAINER_TYPE;
    var STATUS = this.containerForm.value.STATUS;
    var ON_HIRE_DATE = this.containerForm.value.ON_HIRE_DATE;
    var OFF_HIRE_DATE = this.containerForm.value.OFF_HIRE_DATE;
    var MANUFACTURING_DATE=this.containerForm.value.MANUFACTURING_DATE;
    var OWNER_NAME=this.containerForm.value.OWNER_NAME;
    var LESSOR_NAME=this.containerForm.value.LESSOR_NAME;

    if (
      CONTAINER_NO == '' &&
      CONTAINER_TYPE == '' &&
      STATUS == '' &&
      ON_HIRE_DATE == '' &&
      OFF_HIRE_DATE == ''&&
      MANUFACTURING_DATE==''&&
      OWNER_NAME== '' &&
      LESSOR_NAME == '' 
      

    ) {
      alert('Please enter atleast one filter to search !');
      return;
    } else if (ON_HIRE_DATE > OFF_HIRE_DATE) {
      alert('From Date should be less than To Date !');
      return;
    }

     this.container.CONTAINER_NO = CONTAINER_NO;
     this.container.CONTAINER_TYPE = CONTAINER_TYPE;
     this.container.STATUS = STATUS;
     this.container.ON_HIRE_DATE = ON_HIRE_DATE;
    this.container.OFF_HIRE_DATE = OFF_HIRE_DATE;
    this.container.MANUFACTURING_DATE=MANUFACTURING_DATE;
    this.container.OWNER_NAME=OWNER_NAME;
    this.container.LESSOR_NAME=LESSOR_NAME;
    // this.isLoading = true;
    // this.GetPartyMasterList();
  }
  ClearForm() {
    this.contForm.reset();
    this.contForm.get('CONTAINER_NO')?.setValue('');
    this.contForm.get('CONTAINER_TYPE')?.setValue('');
    this.contForm.get('CONTAINER_SIZE')?.setValue('');
    this.contForm.get('STATUS')?.setValue('');
    this.contForm.get('ON_HIRE_DATE')?.setValue('');
    this.contForm.get('OFF_HIRE_DATE')?.setValue('');
    this.contForm.get('MANUFACTURING_DATE')?.setValue('');
    this.contForm.get('OWNER_NAME')?.setValue('');
    this.contForm.get('LESSOR_NAME')?.setValue('');
    this.contForm.get('PICKUP_LOCATION')?.setValue('');
    this.contForm.get('DROP_LOCATION')?.setValue('');
  }
  // Clear() {
  //   this.contForm.get('CONTAINER_NO')?.setValue('');
  //   this.contForm.get('CONTAINER_TYPE')?.setValue('');
  //   this.contForm.get('CONTAINER_SIZE')?.setValue('');
  //   this.contForm.get('STATUS')?.setValue('');
  //   this.contForm.get('FROM_DATE')?.setValue('');
  //   this.contForm.get('TO_DATE')?.setValue('');

  //   this.contForm.CONTAINER_NO = '';
  //   this.contForm.CUST_TYPE = '';
  //   this.contForm.STATUS = '';
  //   this.contForm.FROM_DATE = '';
  //   this.contForm.TO_DATE = '';

  //   this.isLoading1 = true;
  //   this.GetContainerMasterList();
  // }
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
    this.containerForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

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
          this.closeBtn.nativeElement.click();

        }
      });
  }

  // deleteContainerMaster(containerId: number) {
  //   debugger;
  //   if (confirm('Are you sure want to delete this record ?')) {
  //     var containerModel = new CONTAINER();
  //     containerModel.CREATED_BY = localStorage.getItem('username');
  //     containerModel.ID = containerId;

  //     this._containerService
  //       .deleteContainerMaster(containerModel)
  //       .subscribe((res: any) => {
  //         if (res.ResponseCode == 200) {
  //           alert('Your record has been deleted successfully !');
  //           this.GetContainerMasterList();
  //         }
  //       });
  //   }
  // }


  deleteContainerMaster(ID: number) {
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
        this._containerService.deleteContainerMaster(ID).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
            this.GetContainerMasterList();
          }
        });
      }
    });
  }

  openModal(ID: any = 0) {
    debugger;
    this.submitted = false;
    this.ClearForm();

    if (ID > 0) {
      this.GetContainerMasterDetails(ID);
    }

    this.openModalPopup.nativeElement.click();
  }
}
