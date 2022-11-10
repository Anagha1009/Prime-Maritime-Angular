import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
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

  @ViewChild('openBtn') openBtn: ElementRef;
  
  constructor(
    private _partyService: PartyService , private _formBuilder:FormBuilder,
    private _router: Router)  { }

  ngOnInit(): void {

    this.partyForm = this._formBuilder.group({
      CUST_NAME: [''],
      CUST_EMAIL: [''],
      CUST_ADDRESS: [''],
      CUST_TYPE:[''],
      GSTIN: [''],
      AGENT_CODE: [''],
      STATUS:['']
    });

    this.GetMasterList();
  }

  GetMasterList() {
    var partyModel = new PARTY();
    partyModel.AGENT_CODE = localStorage.getItem('usercode');

    this._partyService.getPartyList(partyModel).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.partyList = res.Data;
       console.log(res);
      }
    });
  }


  saveParty() {
    this.partyForm.get('AGENT_CODE')?.setValue(localStorage.getItem('usercode'));
    this.partyForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    console.log(JSON.stringify(this.partyForm.value))

    this._partyService
    .postParty(JSON.stringify(this.partyForm.value))
    .subscribe((res: any) => {
      if (res.responseCode == 200) {
        alert('Your party master has been submitted successfully !');
        this._router.navigateByUrl('/home/quotation-list');
      }
    });
  }
}
