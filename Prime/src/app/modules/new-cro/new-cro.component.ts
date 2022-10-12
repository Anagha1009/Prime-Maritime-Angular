import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-cro',
  templateUrl: './new-cro.component.html',
  styleUrls: ['./new-cro.component.scss'],
})
export class NewCroComponent implements OnInit {
  croForm: FormGroup;

  constructor(private FormBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.croForm = this.FormBuilder.group({
      STUFFING_TYPE: ['', Validators.required],
      EMPTY_CONT_PCKP: ['', Validators.required],
      LADEN_ACPT_LOC: ['', Validators.required],
      RO_VALIDITY_DATE: ['', Validators.required],
      REMARKS: [''],
      REQUIRED_QTY: ['', Validators.required],
      GROSS_WEIGHT: ['', Validators.required],
      PCKGS: [''],
      NO_OF_PCKGS: [''],
    });
  }
}
