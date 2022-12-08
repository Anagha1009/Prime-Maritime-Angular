import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss'],
})
export class UnitComponent implements OnInit {
  unitForm: any;
  UnitList: any[] = [];
  isUpdate: boolean = false;
  submitted:boolean=false;

  constructor(
    private _masterService: MasterService,
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
      if (res.ResponseCode == 200) {
        this.UnitList = res.Data;
      }
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
    debugger;
    if (confirm('Are you sure want to delete this record ?')) {
      this._masterService.DeleteMaster(ID).subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          alert('Your record has been deleted successfully !');
          this.GetUnitMasterList();
        }
      });
    }
  }

  ClearForm() {
    this.unitForm.reset();
    this.unitForm.get('STATUS')?.setValue('');
  }
}
