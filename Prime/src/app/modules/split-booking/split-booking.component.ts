import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BOOKING } from 'src/app/models/booking';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-split-booking',
  templateUrl: './split-booking.component.html',
  styleUrls: ['./split-booking.component.scss']
})
export class SplitBookingComponent implements OnInit {
  splitBookingForm:FormGroup;
  booking = new BOOKING();
  splitbooking=new BOOKING();
  bookingNo:string='';
  previewDetails:boolean=false;


  constructor(private _formBuilder: FormBuilder,
    private _bookingService: BookingService,
    private _router: Router) { }

  ngOnInit(): void {
    this.splitBookingForm = this._formBuilder.group({
      BOOKING_NO: [''],
      SRR_ID: [''],
      SRR_NO: [''],
      VESSEL_NAME: ['',Validators.required],
      VOYAGE_NO: ['',Validators.required],
      MOTHER_VESSEL_NAME: ['',Validators.required],
      MOTHER_VOYAGE_NO: ['',Validators.required],
      AGENT_CODE: [''],
      AGENT_NAME: [''],
      STATUS: [''],
      CREATED_BY: [''],
    });

    //this.getBookingDetails();

  }

  getBookingDetails() {
    var booking = new BOOKING();
    debugger;
    booking.AGENT_CODE = localStorage.getItem('usercode');
    booking.BOOKING_NO = this.bookingNo;

    this._bookingService.getBookingDetails(booking).subscribe((res: any) => {
      debugger;
      if (res.ResponseCode == 200) {
        this.booking = res.Data;
        this.previewDetails=true;
        
      }
    });

  }

  splitBooking(){
    this.splitBookingForm.get('BOOKING_NO')?.setValue(this.booking.BOOKING_NO+"-A");
    this.splitBookingForm.get('SRR_ID')?.setValue(this.booking.SRR_ID);
    this.splitBookingForm.get('SRR_NO')?.setValue(this.booking.SRR_NO);
    this.splitBookingForm.get('AGENT_NAME')?.setValue(localStorage.getItem('username'));
    this.splitBookingForm.get('AGENT_CODE')?.setValue(localStorage.getItem('usercode'));
    this.splitBookingForm.get('STATUS')?.setValue("Booked");
    this.splitBookingForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    console.log(JSON.stringify(this.splitBookingForm.value));
    this._bookingService
      .postBookingDetails(JSON.stringify(this.splitBookingForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('The booking has been rolled over successfully !');
          this._router.navigateByUrl('/home/cro-list');
        }
      });

  }

}
