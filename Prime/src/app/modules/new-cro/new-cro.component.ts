import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CroService } from 'src/app/services/cro.service';
import { url } from 'inspector';
import { BookingService } from 'src/app/services/booking.service';
import { BOOKING } from 'src/app/models/quotation';

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
    private FormBuilder: FormBuilder,
    private _croService: CroService,
    private _bookingService: BookingService,
    private _router: Router,
    private _activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.croForm = this.FormBuilder.group({
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

    var bookingNo = localStorage.getItem('BOOKING_NO');
    this.getBookingDetails(bookingNo);
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
    this.croForm.get('AGENT_CODE')?.setValue(localStorage.getItem('rolecode'));
    this.croForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

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

  getRandomNumber() {
    var num = Math.floor(Math.random() * 1e16).toString();
    return 'CRO' + num;
  }

  getBookingDetails(bookingNo) {
    var booking = new BOOKING();
    booking.AGENT_CODE = +localStorage.getItem('rolecode');
    booking.BOOKING_NO = bookingNo;

    this._bookingService.getBookingDetails(booking).subscribe((res) => {
      if (res.ResponseCode == 200) {
        this.bookingDetails = res.Data;
        this.containerList = res.Data.CONTAINER_LIST;
      }
    });
  }
}
