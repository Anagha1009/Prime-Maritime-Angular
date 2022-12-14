import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TdrService } from 'src/app/services/tdr.service';

@Component({
  selector: 'app-tdr',
  templateUrl: './tdr.component.html',
  styleUrls: ['./tdr.component.scss']
})
export class TdrComponent implements OnInit {
  submitted: boolean = false;
  tdrForm: FormGroup;
  tdrLsit: any[] = [];
  


  constructor(
    private _tdrService: TdrService,
    private _formBuilder: FormBuilder,
   
  ) { }

  ngOnInit(): void {
    this.tdrForm = this._formBuilder.group({
      VESSEL_NAME: ['',Validators.required],
      VOYAGE_NO: ['',Validators.required],
      POL:['',Validators.required],
      TERMINAL:['',Validators.required],
      ETA:['',Validators.required],
      POB_BERTHING:['',Validators.required],
      BERTHED:['',Validators.required],
      OPERATION_COMMMENCED:['',Validators.required],
      POB_SAILING:['',Validators.required],
      SAILED:['',Validators.required],
      ETD:['',Validators.required],
      ETA_NEXTPORT:['',Validators.required],
      CREATED_BY:['']
    });
  
  }

  get f(){
    return this.tdrForm.controls;
  }

   
  InsertTdr() {
    debugger
    this.submitted=true
    if(this.tdrForm.invalid){
      return
    }
    this.tdrForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
   
    this._tdrService.InsertTdr(JSON.stringify(this.tdrForm.value)).subscribe((res: any) => {
      debugger
        if (res.responseCode == 200) {
          alert('Your record has been submitted successfully !');

        }
      });
  }

}
