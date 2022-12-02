import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VESSEL } from 'src/app/models/vessel';
import { VesselService } from 'src/app/services/vessel.service';

@Component({
  selector: 'app-vessel',
  templateUrl: './vessel.component.html',
  styleUrls: ['./vessel.component.scss']
})
export class VesselComponent implements OnInit {
  submitted: boolean = false;
  vesselForm: FormGroup;
  data: any;
  isUpdate: boolean = false;
  vesselList: any[] = [];

  constructor(
    private _vesselService: VesselService, private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit(): void {

    this.vesselForm = this._formBuilder.group({
      ID:[0],
      VESSEL_NAME: [''],
      IMO_NO: [''],
      COUNTRY_CODE: [''],
      VESSEL_CODE: [''],
      STATUS: [''],
      CREATED_BY: ['']
    });

    this.GetVesselMasterList();
  }
  GetVesselMasterList() {
    var vesselModel = new VESSEL();
    vesselModel.CREATED_BY = localStorage.getItem('usercode');

    this._vesselService.getVesselList(vesselModel).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.vesselList = res.Data;
      }
    });
  }

  InsertVesselMaster() {
    debugger;
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
  

  ClearForm(){
    this.vesselForm.reset()
    this.vesselForm.get('VESSEL_NAME')?.setValue("")
    this.vesselForm.get('STATUS')?.setValue("")

  }


}
