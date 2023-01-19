import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VESSEL } from 'src/app/models/vessel';
import { CommonService } from 'src/app/services/common.service';
import { VesselService } from 'src/app/services/vessel.service';

@Component({
  selector: 'app-vessel',
  templateUrl: './vessel.component.html',
  styleUrls: ['./vessel.component.scss']
})
export class VesselComponent implements OnInit {
  submitted: boolean = false;
  vesselForm: FormGroup;
  vesselForm1:FormGroup;
  data: any;
  isUpdate: boolean = false;
  vesselList: any[] = [];
  isLoading: boolean = false;
  isLoading1: boolean = false;

  @ViewChild('closeBtn') closeBtn: ElementRef;

  @ViewChild('openModalPopup') openModalPopup: ElementRef;


  constructor(
    private _vesselService: VesselService, private _formBuilder: FormBuilder,
    private _commonService:CommonService,
    private route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit(): void {

    this.vesselForm = this._formBuilder.group({
      ID:[0],
      VESSEL_NAME: ['',Validators.required],
      IMO_NO: ['',Validators.required],
      COUNTRY_CODE: ['',Validators.required],
      VESSEL_CODE: ['',Validators.required],
      STATUS: ['',Validators.required],
      CREATED_BY: ['']
    });
    this.vesselForm1=this._formBuilder.group({
      VESSEL_NAME:[''],
      IMO_NO:[''],
      COUNTRY_CODE:[''],
      VESSEL_CODE:[''],
      STATUS:[''],
      ON_HIRE_DATE:[''],
      OFF_HIRE_DATE:['']
    })

    this.GetVesselMasterList();
  }

  get f(){
    return this.vesselForm.controls;
  } 

  GetVesselMasterList() {
    var vesselModel = new VESSEL();
    vesselModel.CREATED_BY = localStorage.getItem('usercode');
    this._commonService.destroyDT();

    this._vesselService.getVesselList(vesselModel).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.vesselList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  openModal(ID: any = 0) {
    this.submitted = false;
    this.ClearForm();

    if (ID > 0) {
      this.GetVesselMasterDetails(ID);
    }

    this.openModalPopup.nativeElement.click();
  }


  InsertVesselMaster() {
    debugger;
    this.submitted=true
    if(this.vesselForm.invalid){
      return
    }
    this.vesselForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    var status = this.vesselForm.get('STATUS')?.value;
    this.vesselForm.get('STATUS')?.setValue(status == "true" ? true : false);
   
    this._vesselService.postVessel(JSON.stringify(this.vesselForm.value)).subscribe((res: any) => {
      debugger;
        if (res.responseCode == 200) {
          alert('Your record has been submitted successfully !');
          this.GetVesselMasterList()
          this.ClearForm()
        }
      });
  }

  
  GetVesselMasterDetails(vesselId: any) {
    
    var vesselModel = new VESSEL();
    vesselModel.CREATED_BY = localStorage.getItem('usercode');
    vesselModel.ID = vesselId;

    this._vesselService.getVesselDetails(vesselModel).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.vesselForm.patchValue(res.Data)
        this.vesselForm.get("CUST_TYPE")?.setValue(res.Data.CUST_TYPE.trim())
        this.isUpdate = true;
      }
    });
  }

  UpdateVesselMaster(){

    debugger;
    this.vesselForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    var status = this.vesselForm.get('STATUS')?.value;
    this.vesselForm.get('STATUS')?.setValue(status == "true" ? true : false);

    console.log("sfds " + JSON.stringify(this.vesselForm.value))
    this._vesselService
      .UpdateVesselMaster(JSON.stringify(this.vesselForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your party master has been Updated successfully !');
          this.GetVesselMasterList()
          this.ClearForm()
          this.isUpdate = false;
        }
      });
  }

  DeleteVesselMaster(vesselId: number) {
    debugger;
    console.log(vesselId);


    if(confirm('Are you sure want to delete this record ?')){
      var vesselModel = new VESSEL();
      vesselModel.CREATED_BY = localStorage.getItem('usercode');
      vesselModel.ID = vesselId;

    this._vesselService.DeleteVesselMaster(vesselModel).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        alert('Your record has been deleted successfully !');
        this.GetVesselMasterList();
      }
    });
    }
  }
  
  Search(){ }

  ClearForm(){
    this.vesselForm.reset()
    this.vesselForm.get('STATUS')?.setValue("")

  }


}
