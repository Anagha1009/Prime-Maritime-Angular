import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { valHooks } from 'jquery';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import { ServiceService } from 'src/app/services/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  serviceForm: FormGroup;
  serviceForm1:FormGroup;
  ServiceList: any[] = [];
  isUpdate: boolean = false;
  linerList: any[] = [];
  linerIdList:any[] = [];
  serviceNameList1: any[] = [];

  serviceNameList:any[]=[];
  portList: any[]=[];
  submitted:boolean=false;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  
  @ViewChild('closeBtn') closeBtn: ElementRef;

  @ViewChild('openModalPopup') openModalPopup: ElementRef;

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
      ON_HIRE_DATE:[''],
      OFF_HIRE_DATE:[''],
      CREATED_BY: [''],
    });
    this.serviceForm1=this._formBuilder.group({
      LINER_CODE: [''],
      SERVICE_NAME: [''],
      PORT_CODE: [''],
      STATUS: [''],
      ON_HIRE_DATE:[''],
      OFF_HIRE_DATE:['']
    });

    this.getDropdown();
    this.GetServiceMasterList();
  }

  get f(){
    return this.serviceForm.controls;
  }

  Search(){}

  openModal(ID: any = 0) {
    this.submitted = false;
    this.ClearForm();

    if (ID > 0) {
      this.GetServiceMasterDetails(ID);
    }

    this.openModalPopup.nativeElement.click();
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
        this.serviceNameList1 = res.Data;
        console.log("SERVICE_NAME"+ JSON.stringify(res.Data));
      }
    });

    this._commonService.getDropdownData('PORT').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.portList = res.Data;
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
          this.ClearForm();

          
        }
      });
  }
  getServiceName1(event: any) {
    this.serviceNameList1 = [];
    // this.slotDetailsForm.get('SERVICE_NAME')?.setValue('');
    this._commonService
      .getDropdownData('SERVICE_NAME', event, '')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.serviceNameList1 = res.Data;
        }
      });
  }
  GetServiceMasterList() {
    debugger;
    this._commonService.destroyDT();
    this._serviceService.GetAllServiceList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.linerIdList = res.Data;
        console.log("All List" + JSON.stringify(res.Data));
      }
      this._commonService.getDT();
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

  DeleteServiceMaster(ID: number) {
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
            this.GetServiceMasterList();
          }
        });
      }
    });
  }

  ClearForm()
  {
    this.serviceForm.reset()
    this.serviceForm.get('LINER_CODE')?.setValue('');
    this.serviceForm.get('SERVICE_NAME')?.setValue('');
    this.serviceForm.get('PORT_CODE')?.setValue('');
    this.serviceForm.get('STATUS')?.setValue('');
    this.serviceForm.get('ON_HIRE_DATE')?.setValue('');
    this.serviceForm.get('OFF_HIRE_DATE')?.setValue('');
    this.serviceForm.get('STATUS')?.setValue("")
  }

  Clear() {
    this.serviceForm1.get('LINER_CODE')?.setValue('');
    this.serviceForm1.get('SERVICE_NAME')?.setValue('');
    this.serviceForm1.get('PORT_CODE')?.setValue('');
    this.serviceForm1.get('STATUS')?.setValue('');
    this.serviceForm1.get('ON_HIRE_DATE')?.setValue('');
    this.serviceForm1.get('OFF_HIRE_DATE')?.setValue('');
    this.isLoading1 = true;
    this.GetServiceMasterList();
  }

}
