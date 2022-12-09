import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { valHooks } from 'jquery';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  serviceForm: FormGroup;
  ServiceList: any[] = [];
  isUpdate: boolean = false;
  linerList: any[] = [];
  linerIdList:any[] = [];
  serviceNameList:any[]=[];
  PortList: any[]=[];
  submitted:boolean=false;
  

  constructor(
    private _masterService: MasterService,
    private _commonService:CommonService,
    private _formBuilder: FormBuilder,
    private _serviceService:ServiceService
    
  ) { }

  ngOnInit(): void {
    debugger
    this.serviceForm = this._formBuilder.group({
      ID: [0],
      LINER_CODE: ['',Validators.required],
      SERVICE_NAME: ['',Validators.required],
      PORT_CODE: ['',Validators.required],
      STATUS: ['',Validators.required],
      CREATED_BY: [''],
    });

    this.getDropdown();
    this.GetServiceMasterList();
  }

  get f(){
    return this.serviceForm.controls;
  }

  getDropdown(){
    this._commonService.getDropdownData('LINER').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.linerList = res.Data;
        console.log("LINER" + JSON.stringify(res.Data));
      }
    });

    this._commonService.getDropdownData('SERVICE_NAME').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.serviceNameList = res.Data;
      }
    });

    this._commonService.getDropdownData('PORT').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.PortList = res.Data;
      }
    });
  }

  InsertServiceMaster() {
    this.submitted=true
    if(this.serviceForm.invalid){
      return
    }
    this.serviceForm
      .get('CREATED_BY')
      ?.setValue(localStorage.getItem('username'));
    var status = this.serviceForm.get('STATUS')?.value;
    this.serviceForm.get('STATUS')?.setValue(status == 'true' ? true : false);
  
    this._serviceService
      .InsertMaster(JSON.stringify(this.serviceForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your record has been submitted successfully !');
          this.GetServiceMasterList();
          
        }
      });
  }

  GetServiceMasterList() {
    debugger;
    this._serviceService.GetAllServiceList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.linerIdList = res.Data;
        console.log("All List" + JSON.stringify(res.Data));
      }
    });
  }

  GetServiceMasterDetails(ID:any){
    debugger;
    this._serviceService.GetMasterDetails(ID).subscribe((res: any) => {
      console.log(JSON.stringify(res));
      if (res.ResponseCode == 200) {
        debugger
        this.serviceForm.patchValue(res.Data);
        //this.serviceForm.get("SERVICE_NAME")?.setValue(res.Data.SERVICE_NAME)
        this.isUpdate = true;
      }
    });
  }

  UpdateServiceMaster(){
    debugger;
    this.serviceForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    var status = this.serviceForm.get('STATUS')?.value;
    this.serviceForm.get('STATUS')?.setValue(status == "true" ? true : false);

   
    this._serviceService
      .UpdateServiceMaster(JSON.stringify(this.serviceForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your party master has been Updated successfully !');
          this.GetServiceMasterList()
          this.ClearForm()
          this.isUpdate = false;
        }
      });
  }

  DeleteServiceMaster(ID: any) {
    debugger;
    if (confirm('Are you sure want to delete this record ?')) {
      this._serviceService.DeleteMaster(ID).subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          alert('Your record has been deleted successfully !');
          this.GetServiceMasterList();
        }
      });
    }
  }

  ClearForm()
  {
    this.serviceForm.reset()
    this.serviceForm.get('STATUS')?.setValue("")
  }

}
