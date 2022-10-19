import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-bl',
  templateUrl: './new-bl.component.html',
  styleUrls: ['./new-bl.component.scss'],
})
export class NewBlComponent implements OnInit {
  tabs: string = '1';
  blForm: FormGroup;

  constructor(private FormBuilder: FormBuilder, private _router: Router) {}

  ngOnInit(): void {
    this.getBLForm();
  }

  // GET FORM

  getBLForm() {
    this.blForm = this.FormBuilder.group({
      SERVICE_NAME: [''],
      VESSEL_NAME: ['', Validators.required],
      VOYAGE_NO: ['', Validators.required],
      ORIGIN_ICD: ['', Validators.required],
      EFFECT_FROM: ['', Validators.required],
      EFFECT_TO: ['', Validators.required],
      MTY_REPO: [''],
      CUSTOMER_NAME: ['', Validators.required],
      ADDRESS: ['', Validators.required],
      ADDRESS1: [''],
      SRR_CONTAINERS: new FormArray([]),
      SRR_COMMODITIES: new FormArray([]),
      SRR_RATES: new FormArray([]),
    });
  }

  // ON CHANGE

  onchangeTab(index) {
    this.tabs = index;
  }
}
