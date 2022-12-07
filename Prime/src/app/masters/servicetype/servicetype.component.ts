import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-servicetype',
  templateUrl: './servicetype.component.html',
  styleUrls: ['./servicetype.component.scss'],
})
export class ServicetypeComponent implements OnInit {
  submitted: boolean = false;
  typeForm: FormGroup;
  TypeList: any[] = [];
  isUpdate: boolean = false;

  constructor(
    private _masterService: MasterService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.typeForm = this._formBuilder.group({
      ID: [0],
      KEY_NAME: [''],
      CODE: ['',Validators.required],
      CODE_DESC: ['',Validators.required],
      STATUS: ['',Validators.required],
      PARENT_CODE: [''],
      CREATED_BY: [''],
    });

    this.GetServiceTypeMasterList();
  }

  get f(){
    return this.typeForm.controls;
  }

  
  InsertServiceTypeMaster() {

    this.submitted=true
    if(this.typeForm.invalid){
      return
    }
    this.typeForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    var status = this.typeForm.get('STATUS')?.value;
    this.typeForm.get('STATUS')?.setValue(status == 'true' ? true : false);
    this.typeForm.get('KEY_NAME')?.setValue('SERVICE_TYPE');

    this._masterService
      .InsertMaster(JSON.stringify(this.typeForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your record has been submitted successfully !');
          this.GetServiceTypeMasterList();
          this.ClearForm();
        }
      });
  }

  GetServiceTypeMasterList() {
    this._masterService.GetMasterList('SERVICE_TYPE').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.TypeList = res.Data;
      }
    });
  }

  GetServiceTypeMasterDetails(ID: number) {
    this._masterService.GetMasterDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.typeForm.patchValue(res.Data);
        this.isUpdate = true;
      }
    });
  }

  UpdateServiceTypeMaster() {
    this.typeForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    var status = this.typeForm.get('STATUS')?.value;
    this.typeForm.get('STATUS')?.setValue(status == 'true' ? true : false);
    this.typeForm.get('KEY_NAME')?.setValue('SERVICE_TYPE');

    this._masterService
      .UpdateMaster(JSON.stringify(this.typeForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your Service Type master has been Updated successfully !');
          this.GetServiceTypeMasterList();
          this.ClearForm();
          this.isUpdate = false;
        }
      });
  }

  ClearForm() {
    this.typeForm.reset();
    this.typeForm.get('STATUS')?.setValue('');
  }

  DeleteServiceTypeMaster(ID: number) {
    if (confirm('Are you sure want to delete this record ?')) {
      this._masterService.DeleteMaster(ID).subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          alert('Your record has been deleted successfully !');
          this.GetServiceTypeMasterList();
        }
      });
    }
  }
}
