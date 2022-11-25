import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MASTER } from 'src/app/models/master';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-servicetype',
  templateUrl: './servicetype.component.html',
  styleUrls: ['./servicetype.component.scss']
})
export class ServicetypeComponent implements OnInit {
  submitted: boolean = false;
  typeForm: FormGroup;
  TypeList: any[] = [];
  data: any;
  isUpdate: boolean = false;


  constructor(private _masterService: MasterService, private _commonService:CommonService, private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _router: Router ) { }

  ngOnInit(): void {
    this.typeForm = this._formBuilder.group({
      ID:[0],
      KEY_NAME:[''],
      CODE:[''],
      CODE_DESC:[''],
      STATUS: [''],
      PARENT_CODE:[''],
      CREATED_BY :[''],

    });

    this.GetServiceTypeMasterList();
}

InsertServiceTypeMaster() {
  this.typeForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
  var status = this.typeForm.get('STATUS')?.value;
  this.typeForm.get('STATUS')?.setValue(status == "true" ? true : false);
  this.typeForm.get('KEY_NAME')?.setValue('SERVICE_TYPE');

  this._masterService.InsertMaster(JSON.stringify(this.typeForm.value)).subscribe((res: any) => {
    if (res.responseCode == 200) {
      alert('Your record has been submitted successfully !');
      this.GetServiceTypeMasterList()
      this.ClearForm() 
    }
  });
   
  }

  GetServiceTypeMasterList() {

    this._commonService.getDropdownData("SERVICE_TYPE").subscribe((res:any)=>{
      if (res.ResponseCode == 200) {
            this.TypeList = res.Data;
          }
    })
    
  }

  GetServiceTypeMasterDetails(code:string) {
    var typeModel = new MASTER();
    typeModel.CREATED_BY = localStorage.getItem('usercode');
    typeModel.CODE = code;

    this._masterService.GetMasterDetails(typeModel).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.typeForm.patchValue(res.Data)
        this.isUpdate = true;
      }
    });
  }

  UpdateServiceTypeMaster(){
    this.typeForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    var status = this.typeForm.get('STATUS')?.value;
    this.typeForm.get('STATUS')?.setValue(status == "true" ? true : false);
    this.typeForm.get('KEY_NAME')?.setValue('SERVICE_TYPE');
    this._masterService
      .UpdateMaster(JSON.stringify(this.typeForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your Service Type master has been Updated successfully !');
          this.GetServiceTypeMasterList()
          this.ClearForm()
          this.isUpdate = false;
        }
      });
  }

  ClearForm() {
    this.typeForm.reset()
    this.typeForm.get('KEY_NAME')?.setValue('');
    this.typeForm.get('CODE')?.setValue(''); 
    this.typeForm.get('CODE_DESC')?.setValue(''); 
    this.typeForm.get('STATUS')?.setValue(''); 
  }

  DeleteServiceTypeMaster(code:string) {
    if(confirm('Are you sure want to delete this record ?')){
      var typeModel = new MASTER();
      typeModel.CREATED_BY = localStorage.getItem('usercode');
      typeModel.CODE = code;

    this._masterService.DeleteMaster(typeModel).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        alert('Your record has been deleted successfully !');
        this.GetServiceTypeMasterList();
      }
    });
    }
  }

  }


