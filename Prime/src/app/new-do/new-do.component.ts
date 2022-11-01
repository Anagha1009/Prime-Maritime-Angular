import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DO } from '../models/do';
import { DoService } from '../services/do.service';

@Component({
  selector: 'app-new-do',
  templateUrl: './new-do.component.html',
  styleUrls: ['./new-do.component.scss']
})
export class NewDoComponent implements OnInit {

  doForm:FormGroup;
  deliverOrder =new DO();
  billNo:string='';
  previewDetails:boolean=false;
  previewNoData:boolean=false;
  previewForm:boolean=false;
  submitted: boolean = false;

  constructor(private _formBuilder: FormBuilder,
    private _DOService: DoService,
    private _router: Router) { }

  ngOnInit(): void {
    this.doForm = this._formBuilder.group({
      BL_ID: [0],
      BL_NO: [''],
      DO_NO: ['',Validators.required],
      DO_DATE: ['',Validators.required],
      ARRIVAL_DATE: ['',Validators.required],
      DO_VALIDITY: ['',Validators.required],
      IGM_NO: ['',Validators.required],
      IGM_ITEM_NO: ['',Validators.required],
      IGM_DATE: ['',Validators.required],
      CLEARING_PARTY:['',Validators.required],
      ACCEPTANCE_LOCATION: [''],
      LETTER_VALIDITY: [''],
      SHIPPING_TERMS: ['',Validators.required],
      AGENT_CODE: [''],
      AGENT_NAME: [''],
      CREATED_BY: ['']
    });

  }

  get f(){
    return this.doForm.controls;

 }
  getDO(){

  }

  insertDO(){
    this.submitted=true;
    this.doForm.get('BL_ID')?.setValue(0);
    this.doForm.get('BL_NO')?.setValue("BL-A-05");
    this.doForm.get('AGENT_NAME')?.setValue(localStorage.getItem('username'));
    this.doForm.get('AGENT_CODE')?.setValue(localStorage.getItem('usercode'));
    this.doForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    console.log(JSON.stringify(this.doForm.value));
    this._DOService
      .postDODetails(JSON.stringify(this.doForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('The delivery order has been saved successfully !');
          this._router.navigateByUrl('/home/booking-list');
        }
      });



  }

}
