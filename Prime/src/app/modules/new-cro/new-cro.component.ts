import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CroService } from 'src/app/services/cro.service';

@Component({
  selector: 'app-new-cro',
  templateUrl: './new-cro.component.html',
  styleUrls: ['./new-cro.component.scss'],
})
export class NewCroComponent implements OnInit {
  croForm: FormGroup;
  submitted: boolean = false;

  constructor(
    private FormBuilder: FormBuilder,
    private _croService: CroService,
    private _router: Router
    ) {}

  ngOnInit(): void {
    this.croForm = this.FormBuilder.group({
      BOOKING_ID:[1],
      BOOKING_NO:['123'],
      STUFFING_TYPE: ['', Validators.required],
      EMPTY_CONT_PCKP: ['', Validators.required],
      LADEN_ACPT_LOCATION: ['', Validators.required],
      RO_VALIDITY_DATE: ['', Validators.required],
      REMARKS: [''],
      REQ_QUANTITY: ['', Validators.required],
      GROSS_WT: ['', Validators.required],
      GROSS_WT_UNIT:['', Validators.required],
      PACKAGES:['', Validators.required],
      NO_OF_PACKAGES: [''],
      STATUS: ['Drafted'],
      AGENT_NAME: [''],
      AGENT_CODE: [''],
      CREATED_BY: ['']
    });
  }

  get f() {
    return this.croForm.controls;
  }

  SaveCRO() {

    this.croForm
    .get('AGENT_NAME')
    ?.setValue(localStorage.getItem('username'));

    this.croForm
    .get('AGENT_CODE')
    ?.setValue(localStorage.getItem('rolecode'));

    this.croForm
    .get('CREATED_BY')
    ?.setValue(localStorage.getItem('username'));

    console.log(JSON.stringify(this.croForm.value));
    this._croService
      .insertCRO(JSON.stringify(this.croForm.value))
      .subscribe((res) => {
        if (res.responseCode == 200) {
          alert('Your CRO has been submitted successfully !');
          this._router.navigateByUrl('home/agent-dashboard');
        }
      });
  }

}
