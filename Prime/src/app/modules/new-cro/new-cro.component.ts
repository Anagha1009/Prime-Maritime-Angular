import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BOOKING } from 'src/app/models/booking';
import { BookingService } from 'src/app/services/booking.service';
import { CroService } from 'src/app/services/cro.service';

@Component({
  selector: 'app-new-cro',
  templateUrl: './new-cro.component.html',
  styleUrls: ['./new-cro.component.scss'],
})
export class NewCroComponent implements OnInit {
  croForm: FormGroup;
  submitted: boolean = false;
  bookingDetails: any;
  containerList: any[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _croService: CroService,
    private _bookingService: BookingService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.croForm = this._formBuilder.group({
      CRO_NO: [''],
      BOOKING_ID: [''],
      BOOKING_NO: [''],
      STUFFING_TYPE: ['', Validators.required],
      EMPTY_CONT_PCKP: ['', Validators.required],
      LADEN_ACPT_LOCATION: ['', Validators.required],
      CRO_VALIDITY_DATE: ['', Validators.required],
      REMARKS: [''],
      REQ_QUANTITY: ['', Validators.required],
      GROSS_WT: ['', Validators.required],
      GROSS_WT_UNIT: ['', Validators.required],
      PACKAGES: ['', Validators.required],
      NO_OF_PACKAGES: [''],
      STATUS: ['Drafted'],
      AGENT_NAME: [''],
      AGENT_CODE: [''],
      CREATED_BY: [''],
    });

    this.getBookingDetails();
  }

  get f() {
    return this.croForm.controls;
  }

  SaveCRO() {
    this.croForm
      .get('BOOKING_ID')
      ?.setValue(localStorage.getItem('BOOKING_ID'));
    this.croForm
      .get('BOOKING_NO')
      ?.setValue(localStorage.getItem('BOOKING_NO'));
    this.croForm.get('CRO_NO')?.setValue(this.getRandomNumber());
    this.croForm.get('AGENT_NAME')?.setValue(localStorage.getItem('username'));
    this.croForm.get('AGENT_CODE')?.setValue(localStorage.getItem('usercode'));
    this.croForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    console.log(JSON.stringify(this.croForm.value));
    this._croService
      .insertCRO(JSON.stringify(this.croForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your CRO has been submitted successfully !');
          this._router.navigateByUrl('/home/cro-list');
        }
      });
  }

  getRandomNumber() {
    var num = Math.floor(Math.random() * 1e16).toString();
    return 'CRO' + num;
  }

  getBookingDetails() {
    var booking = new BOOKING();
    booking.AGENT_CODE = localStorage.getItem('agentcode');
    booking.BOOKING_NO = localStorage.getItem('BOOKING_NO');

    this._bookingService.getBookingDetails(booking).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.bookingDetails = res.Data;
        this.containerList = res.Data.CONTAINER_LIST;
      }
    });
  }
}
