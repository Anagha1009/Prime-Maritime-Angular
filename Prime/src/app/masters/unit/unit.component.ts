import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MASTER } from 'src/app/models/master';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {
  unitForm: any;
  data:any;
  UnitList: any[] = [];
  isUpdate: boolean = false;


  constructor(private _masterService: MasterService,private _commonService: CommonService,private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _router:Router) { }

  ngOnInit(): void {
    this.unitForm = this._formBuilder.group({
      ID: [0],
      KEY_NAME: [''],
      CODE: [''],
      CODE_DESC: [''],
      STATUS: [''],
      PARENT_CODE: [''],
      CREATED_BY: [''],

  });
  this.GetUnitMasterList();
}

InsertUnitMaster() {
  debugger
  this.unitForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
  var status = this.unitForm.get('STATUS')?.value;
  this.unitForm.get('STATUS')?.setValue(status == "true" ? true : false);
  this.unitForm.get('KEY_NAME')?.setValue('UNIT');

  this._masterService.InsertMaster(JSON.stringify(this.unitForm.value)).subscribe((res: any) => {
    if (res.responseCode == 200) {
      alert('Your record has been submitted successfully !');
      this.GetUnitMasterList()

    }
  });

}

GetUnitMasterList() {

  this._commonService.getDropdownData("UNIT").subscribe((res: any) => {
    if (res.ResponseCode == 200) {
      this.UnitList = res.Data;
    }
  })

}
GetUnitMasterDetails(code: string) {
  var unitModel = new MASTER();
  unitModel.CREATED_BY = localStorage.getItem('usercode');
  unitModel.CODE = code;

  this._masterService.GetMasterDetails(unitModel).subscribe((res: any) => {
    if (res.ResponseCode == 200) {
      this.unitForm.patchValue(res.Data)
      this.isUpdate = true;
    }
  });
}

UpdateUnitMaster(){
  this.unitForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
  var status = this.unitForm.get('STATUS')?.value;
  this.unitForm.get('STATUS')?.setValue(status == "true" ? true : false);
  this.unitForm.get('KEY_NAME')?.setValue('UNIT');
  this._masterService
    .UpdateMaster(JSON.stringify(this.unitForm.value))
    .subscribe((res: any) => {
      if (res.responseCode == 200) {
        alert('Your Unit master has been Updated successfully !');
        this.GetUnitMasterList()
        this.ClearForm()
        this.isUpdate = false;
      }
    });
}

DeleteUnitMaster(code: string) {
  debugger
  if (confirm('Are you sure want to delete this record ?')) {
    var unitModel = new MASTER();
    unitModel.CREATED_BY = localStorage.getItem('usercode');
    unitModel.CODE = code;

    this._masterService.DeleteMaster(unitModel).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        alert('Your record has been deleted successfully !');
        this.GetUnitMasterList();
      }
    });
  }
}
ClearForm() {
  this.unitForm.reset()
  this.unitForm.get('KEY_NAME')?.setValue('');
  this.unitForm.get('CODE')?.setValue('');
  this.unitForm.get('CODE_DESC')?.setValue('');
  this.unitForm.get('STATUS')?.setValue('');
}

}
