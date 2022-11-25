import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { stat } from 'fs';
import { CONTAINER } from 'src/app/models/container';
import { PARTY } from 'src/app/models/party';
import { PartyService } from 'src/app/services/party.service';


@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.scss']
})
export class PartyComponent implements OnInit {
  submitted: boolean = false;
  partyForm: FormGroup;
  partyList: any[] = [];
  data: any;
  isUpdate: boolean = false;


  constructor(
    private _partyService: PartyService, private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _router: Router) { }

  ngOnInit(): void {

    this.partyForm = this._formBuilder.group({
      CUST_ID:[0],
      CUST_NAME: [''],
      CUST_EMAIL: [''],
      CUST_ADDRESS: [''],
      CUST_TYPE: [''],
      GSTIN: [''],
      AGENT_CODE: [''],
      STATUS: ['']
    });

    this.GetPartyMasterList();
  }

  

  GetPartyMasterList() {
    var partyModel = new PARTY();
    partyModel.AGENT_CODE = localStorage.getItem('usercode');

    this._partyService.getPartyList(partyModel).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.partyList = res.Data;
      }
    });
  }

  InsertPartyMaster() {

    this.partyForm.get('AGENT_CODE')?.setValue(localStorage.getItem('usercode'));
    this.partyForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    var status = this.partyForm.get('STATUS')?.value;
    this.partyForm.get('STATUS')?.setValue(status == "true" ? true : false);
   
    this._partyService.postParty(JSON.stringify(this.partyForm.value)).subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your record has been submitted successfully !');
          this.GetPartyMasterList()
          this.ClearForm()
        }
      });
  }

  DeletePartyMaster(partyID: number) {

    if(confirm('Are you sure want to delete this record ?')){
      var partyModel = new PARTY();
      partyModel.AGENT_CODE = localStorage.getItem('usercode');
      partyModel.CUST_ID = partyID;

    this._partyService.deleteParty(partyModel).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        alert('Your record has been deleted successfully !');
        this.GetPartyMasterList();
      }
    });
    }
  }

  GetPartyMasterDetails(partyID: number) {

    var partyModel = new PARTY();
    partyModel.AGENT_CODE = localStorage.getItem('usercode');
    partyModel.CUST_ID = partyID;

    this._partyService.getPartyDetails(partyModel).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.partyForm.patchValue(res.Data)
        this.partyForm.get("CUST_TYPE")?.setValue(res.Data.CUST_TYPE.trim())
        this.isUpdate = true;
      }
    });
  }

  UpdatePartyMaster(){
    this.partyForm.get('AGENT_CODE')?.setValue(localStorage.getItem('usercode'));
    this.partyForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    var status = this.partyForm.get('STATUS')?.value;
    this.partyForm.get('STATUS')?.setValue(status == "true" ? true : false);

    console.log("sfds " + JSON.stringify(this.partyForm.value))
    this._partyService
      .updateParty(JSON.stringify(this.partyForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your party master has been Updated successfully !');
          this.GetPartyMasterList()
          this.ClearForm()
          this.isUpdate = false;
        }
      });
  }

  ClearForm(){
    this.partyForm.reset()
    this.partyForm.get('CUST_TYPE')?.setValue("")
    this.partyForm.get('STATUS')?.setValue("")

  }
}
// this.sizeForm.patchValue(res.Data)
//         this.sizeForm.get("STATUS")?.setValue(res.Data.STATUS.trim())
//         this.sizeForm.get("CONT_SIZE")?.setValue(res.Data.CONT_SIZE.trim())