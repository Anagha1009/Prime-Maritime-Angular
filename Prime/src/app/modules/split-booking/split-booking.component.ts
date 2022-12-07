import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnyARecord } from 'dns';
import { BOOKING } from 'src/app/models/booking';
import { QUOTATION } from 'src/app/models/quotation';
import { BookingService } from 'src/app/services/booking.service';
import { QuotationService } from 'src/app/services/quotation.service';

@Component({
  selector: 'app-split-booking',
  templateUrl: './split-booking.component.html',
  styleUrls: ['./split-booking.component.scss']
})
export class SplitBookingComponent implements OnInit {
  splitBookingForm:FormGroup;
  booking=new BOOKING();
  isScroll: boolean = false;
  splitbooking=new BOOKING();
  bookingNo:string='';
  previewDetails:boolean=false;
  previewNoData:boolean=false;
  submitted: boolean = false;

  constructor(private _formBuilder: FormBuilder,
    private _bookingService: BookingService,
    private _srrService:QuotationService,
    private _router: Router) { }

  ngOnInit(): void {
    this.splitBookingForm = this._formBuilder.group({
      BOOKING_NO: [''],
      SRR_ID: [0],
      SRR_NO: [''],
      VESSEL_NAME: ['',Validators.required],
      VOYAGE_NO: ['',Validators.required],
      MOTHER_VESSEL_NAME: ['',Validators.required],
      MOTHER_VOYAGE_NO: ['',Validators.required],
      AGENT_CODE: [''],
      AGENT_NAME: [''],
      STATUS: [''],
      CREATED_BY: [''],
      IS_ROLLOVER: [false],
      SLOT_LIST: new FormArray([]),
    });
    console.log(this.booking);

    this.slotAllocation()

  }

  slotAllocation() {
    var slotDetails = this.splitBookingForm.get('SLOT_LIST') as FormArray;
    if(slotDetails?.length>=3){
      this.isScroll=true;
    }
    slotDetails.push(
      this._formBuilder.group({
        SLOT_OPERATOR: [''],
        NO_OF_SLOTS: [''],
      })
    );
  }

  get f() {
    var x = this.splitBookingForm.get('SLOT_LIST') as FormArray;
    return x.controls;
  }

  get f2(){
     return this.splitBookingForm.controls;

  }

  f1(i: any) {
    return i;
  }

  getBookingDetails() {
    debugger;
    this.previewNoData=false;
    this.previewDetails=false;
    var bk = new BOOKING();
    bk.AGENT_CODE = localStorage.getItem('usercode');
    bk.BOOKING_NO = this.bookingNo;

    this._bookingService.getBookingDetails(bk).subscribe((res: any) => {
      debugger;
      if (res.ResponseCode == 200) {
        console.log(res.data);
        this.booking = res.Data;
        this.previewDetails=true;
      }
      if(res.ResponseCode==500){
        this.previewNoData=true;
      }
    });
 
  }

  removeItem(i: any) {
    const add = this.splitBookingForm.get('SLOT_LIST') as FormArray;
    add.removeAt(i);
  }

  splitBooking(){
    
    debugger;
    this.submitted=true;
    if(this.splitBookingForm.invalid){
      return
    }
    alert("hii")
    // this.splitBookingForm.get('BOOKING_NO')?.setValue(this.booking?.BOOKING_NO);
    // this.splitBookingForm.get('IS_ROLLOVER')?.setValue(true);
    // this.splitBookingForm.get('SRR_ID')?.setValue(this.booking?.CONTAINER_LIST[0].SRR_ID);
    // this.splitBookingForm.get('SRR_NO')?.setValue(this.booking?.CONTAINER_LIST[0].SRR_NO);
    // this.splitBookingForm.get('AGENT_NAME')?.setValue(localStorage.getItem('username'));
    // this.splitBookingForm.get('AGENT_CODE')?.setValue(localStorage.getItem('usercode'));
    // this.splitBookingForm.get('STATUS')?.setValue('Booked');
    // this.splitBookingForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    // console.log(JSON.stringify(this.splitBookingForm.value));
    // this._bookingService
    //   .postBookingDetails(JSON.stringify(this.splitBookingForm.value))
    //   .subscribe((res: any) => {
    //     if (res.responseCode == 200) {
    //       alert('The booking has been rolled over successfully !');
    //       this._router.navigateByUrl('/home/booking-list');
    //     }
    //   });

  }
  cancelBooking(){
    this.splitBookingForm.get('VESSEL_NAME')?.setValue('');
    this.splitBookingForm.get('VOYAGE_NO')?.setValue('');
    this.splitBookingForm.get('MOTHER_VESSEL_NAME')?.setValue('');
    this.splitBookingForm.get('MOTHER_VOYAGE_NO')?.setValue('');
    var slotDetails = this.splitBookingForm.get('SLOT_LIST') as FormArray;
    slotDetails.get('SLOT_OPERATOR')?.setValue('');
    slotDetails.get('NO_OF_SLOTS')?.setValue('');

  }

}
