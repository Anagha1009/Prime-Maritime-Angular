import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  unitForm1:any;
  UnitList: any[] = [];
  isUpdate: boolean = false;
  submitted:boolean=false;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  
  @ViewChild('closeBtn') closeBtn: ElementRef;

  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _masterService: MasterService,
    private _commonService:CommonService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.unitForm = this._formBuilder.group({
      ID: [0],
      KEY_NAME: [''],
      CODE: ['',Validators.required],
      CODE_DESC: ['',Validators.required],
      STATUS: ['',Validators.required],
      PARENT_CODE: [''],
      CREATED_BY: [''],
    });
    this.unitForm1=this._formBuilder.group({
      KEY_NAME:[''],
      CODE:[''],
      CODE_DESC:[''],
      STATUS:[''],
      PARENT_CODE:[''],
      ON_HIRE_DATE:[''],
      OFF_HIRE_DATE:['']
    })
    this.GetUnitMasterList();
  }
  get f(){
    return this.unitForm.controls;
  }
 

  InsertUnitMaster() {
    this.submitted=true
    if(this.unitForm.invalid){
      return
    }
    this.unitForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    var status = this.unitForm.get('STATUS')?.value;
    this.unitForm.get('STATUS')?.setValue(status == 'true' ? true : false);
    this.unitForm.get('KEY_NAME')?.setValue('UNIT');

    this._masterService
      .InsertMaster(JSON.stringify(this.unitForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your record has been submitted successfully !');
          this.ClearForm();
          this.GetUnitMasterList();
        }
      });
  }

  GetUnitMasterList() {
    this._masterService.GetMasterList('UNIT').subscribe((res: any) => {
      this._commonService.destroyDT();
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
        this.isUpdate = true;
      }
    });
  }

  UpdateUnitMaster() {
    this.unitForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    var status = this.unitForm.get('STATUS')?.value;
    this.unitForm.get('STATUS')?.setValue(status == 'true' ? true : false);
    this.unitForm.get('KEY_NAME')?.setValue('UNIT');
    this._masterService
      .UpdateMaster(JSON.stringify(this.unitForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your Unit master has been Updated successfully !');
          this.GetUnitMasterList();
          this.ClearForm();
          this.isUpdate = false;
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
    this.ClearForm();

    if (ID > 0) {
      this.GetUnitMasterDetails(ID);
    }

    this.openModalPopup.nativeElement.click();
  }

  Search() {}

  ClearForm() {
    this.unitForm.reset();
    this.unitForm.get('STATUS')?.setValue('');
  }
}
