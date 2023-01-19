import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LINER } from 'src/app/models/liner';
import { LINERSERVICE } from 'src/app/models/linerservice';
import { CommonService } from 'src/app/services/common.service';
import { LinerService } from 'src/app/services/liner.service';

@Component({
  selector: 'app-liner-service',
  templateUrl: './liner-service.component.html',
  styleUrls: ['./liner-service.component.scss']
})
export class LinerServiceComponent implements OnInit {

  LinerServiceform:FormGroup;
  ServiceList:any[]=[];
  submitted: boolean;
  isUpdate: boolean = false;
  portList: any[] = [];
  linerService:LINERSERVICE;
  
  constructor(private _formBuilder: FormBuilder,
    private _linerService:LinerService ,
    private _commonService: CommonService,
    private route: ActivatedRoute,
    private _router: Router
    ) { }

  ngOnInit(): void {
    this.LinerServiceform = this._formBuilder.group({
      ID: [0],
      LINER_CODE: ['',Validators.required],
      SERVICE_NAME: ['',Validators.required],
      PORT_CODE: ['',Validators.required],
      STATUS: ['',Validators.required],
      CREATED_BY: [''],
    });
    this.GetServiceList();
    this.getDropDown();
  }


  get f(){
    return this. LinerServiceform.controls;
  }
  GetServiceList() {
    this._linerService.getServiceList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.ServiceList = res.Data;
        console.log(res.Data)
      }
    });
  }

  GetServiceDetails(ID: number) {
    var serviceModel = new LINERSERVICE();
  
    serviceModel.ID = ID;

    this._linerService.GetServiceDetails(serviceModel).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.LinerServiceform.patchValue(res.Data)        
         this.isUpdate = true;

      }
    });
  }


  InsertService() {
    debugger
    this.submitted=true
    if(this.LinerServiceform.invalid){
      return
    }
    this.LinerServiceform.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    var status = this.LinerServiceform.get('STATUS')?.value;
    this.LinerServiceform.get('STATUS')?.setValue(status == "true" ? true : false);
   
    this._linerService.postService(JSON.stringify(this.LinerServiceform.value)).subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your record has been submitted successfully !');
          this.GetServiceList()
          // this.ClearForm()
        }
      });
  }

getDropDown(){
  this._commonService.getDropdownData('PORT').subscribe((res: any) => {
    if (res.ResponseCode == 200) {
      this.portList = res.Data;
    }
  });
}

UpdateService() {
  debugger;
  this.LinerServiceform.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

  var status = this.LinerServiceform.get('STATUS')?.value;
  this.LinerServiceform.get('STATUS')?.setValue(status == 'true' ? true : false);

  console.log('sfds ' + JSON.stringify(this.LinerServiceform.value));
  this._linerService
    .updateliner(JSON.stringify(this.LinerServiceform.value))
    .subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        alert('Your party master has been Updated successfully !');
        this.GetServiceList()

        this.LinerServiceform.setValue(this.linerService);
        // this.ClearForm();
        this.isUpdate = false;
      }
    });
}

DeleteService(ID: number) {
  debugger;
  if (confirm('Are you sure want to delete this record ?')) {
    var serviceModel = new LINERSERVICE();
    serviceModel.CREATED_BY = localStorage.getItem('username');
    serviceModel.ID = ID;

    this._linerService
      .deleteService(serviceModel)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          alert('Your record has been deleted successfully !');
          this.GetServiceList()
        }
      });
  }
}

ClearForm(){
  this.LinerServiceform.reset();
}
}
