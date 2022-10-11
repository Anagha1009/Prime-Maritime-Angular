import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { debug } from 'console';
import { BOOKING, CONTAINER, QUOTATION } from 'src/app/models/quotation';
import { SRRService } from 'src/app/services/srr.service';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.scss'],
})
export class AgentDashboardComponent implements OnInit {
  // classActive: boolean = false;
  isSlotDetails: boolean = false;
  srrList: any[] = [];
  bookingList: any[] = [];
  quotationForm: FormGroup;
  slotDetailsForm: FormGroup;
  containerForm: FormGroup;
  isScroll: boolean = false;
  isScroll1: boolean = false;
  slotList: any[] = [];
  slotDetailsList: any[] = [];
  currentDate: string = '';
  quotation = new QUOTATION();
  submitted: boolean = false;

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeBtn1') closeBtn1: ElementRef;
  @ViewChild('openBtn') openBtn: ElementRef;

  constructor(
    private SrrService: SRRService,
    private router: Router,
    private FormBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.quotationForm = this.FormBuilder.group({
      SRR_NO: [''],
      CUSTOMER_NAME: [''],
      STATUS: [''],
    });

    this.slotDetailsForm = this.FormBuilder.group({
      SLOTDETAILS: new FormArray([]),
    });

    this.containerForm = this.FormBuilder.group({
      NO_OF_CONTAINERS: ['', Validators.required],
    });

    this.quotation.AGENT_CODE = +localStorage.getItem('rolecode');

    this.getSRRList();
    this.getBookingList();
    this.currentDate = this.getcurrentDate();
  }

  searchSRRList() {
    this.quotation.SRR_NO = this.quotationForm.value.SRR_NO;
    this.quotation.CUSTOMER_NAME = this.quotationForm.value.CUSTOMER_NAME;
    this.quotation.STATUS = this.quotationForm.value.STATUS;

    this.getSRRList();
  }

  clearSRRList() {
    this.quotationForm.get('SRR_NO')?.setValue('');
    this.quotationForm.get('CUSTOMER_NAME')?.setValue('');
    this.quotationForm.get('STATUS')?.setValue('');
    this.quotation.SRR_NO = '';
    this.quotation.CUSTOMER_NAME = '';
    this.quotation.STATUS = '';

    this.getSRRList();
  }

  getSRRList() {
    this.quotation.OPERATION = 'GET_SRRLIST';
    this.SrrService.getSRRList(this.quotation).subscribe(
      (res) => {
        this.srrList = [];
        this.isScroll = false;
        if (res.hasOwnProperty('Data')) {
          if (res.Data?.length > 0) {
            this.srrList = res.Data;

            if (this.srrList?.length >= 4) {
              this.isScroll = true;
            } else {
              this.isScroll = false;
            }
          }
        }
      },
      (error) => {
        if (error.status == 401) {
          alert('You are not authorized to access this page, please login');
          this.router.navigateByUrl('login');
        }
      }
    );
  }

  getBookingList() {
    this.quotation.OPERATION = 'GET_BOOKINGLIST';
    this.SrrService.getSRRList(this.quotation).subscribe(
      (res) => {
        this.bookingList = [];
        this.isScroll1 = false;
        if (res.hasOwnProperty('Data')) {
          if (res.Data?.length > 0) {
            this.bookingList = res.Data;
            console.log('bookinglist ' + JSON.stringify(this.bookingList));
            if (this.bookingList?.length >= 4) {
              this.isScroll1 = true;
            } else {
              this.isScroll1 = false;
            }
          }
        }
      },
      (error) => {
        if (error.status == 401) {
          alert('You are not authorized to access this page, please login');
          this.router.navigateByUrl('login');
        }
      }
    );
  }

  addContainer(i) {
    this.submitted = true;

    if (this.containerForm.invalid) {
      return;
    }

    debugger;
    var srrdata = this.srrList[i];
    var rootobject = new CONTAINER();
    rootobject.SRR_ID = srrdata.SRR_ID;
    rootobject.SRR_NO = srrdata.SRR_NO;
    rootobject.NO_OF_CONTAINERS =
      +this.containerForm.get('NO_OF_CONTAINERS')?.value;
    rootobject.CREATED_BY = localStorage.getItem('username');

    this.SrrService.insertContainer(JSON.stringify(rootobject)).subscribe(
      (res) => {
        debugger;
        if (res.responseCode == 200) {
          this.getSRRList();
          alert('Container added successfully');
          this.closeModal();
        }
      }
    );
  }

  addSlots(i) {
    // let obj = {
    //   Index: i,
    //   Form: this.slotDetailsForm.value,
    // };

    // this.slotList.push(obj);

    // var x = this.slotList.filter((x) => x.Index == i);

    // x.forEach((element) => {
    //   this.slotDetailsList.push(element.Form);
    // });

    this.slotDetailsForm.get('SRR_ID').setValue(this.srrList[i].SRR_ID);
    this.slotDetailsForm.get('SRR_NO').setValue(this.srrList[i].SRR_NO);
    this.slotDetailsForm.get('POL').setValue(this.srrList[i].POL);
    this.slotDetailsForm.get('POD').setValue(this.srrList[i].POD);
    this.slotDetailsForm
      .get('AGENT_CODE')
      .setValue(localStorage.getItem('rolecode'));
    this.slotDetailsForm
      .get('AGENT_NAME')
      .setValue(localStorage.getItem('username'));
    this.slotDetailsForm
      .get('CREATED_BY')
      .setValue(localStorage.getItem('username'));

    this.SrrService.insertSlots(
      JSON.stringify(this.slotDetailsForm.value)
    ).subscribe((res) => {
      if (res.responseCode == 200) {
        alert('Your Slot has been booked successfully!');
        this.closeModal();
      }
    });
  }

  booking(i) {
    var rootobject = new BOOKING();
    rootobject.SRR_NO = this.srrList[i].SRR_NO;
    rootobject.STATUS = 'Booked';
    rootobject.AGENT_CODE = localStorage.getItem('rolecode');

    this.SrrService.booking(JSON.stringify(rootobject)).subscribe((res) => {
      if (res.responseCode == 200) {
        alert('Your Booking has been confirmed');
      }
    });
  }

  getSlotDetails(SRR_NO) {
    // this.slotNo = i;
    this.isSlotDetails = !this.isSlotDetails;

    this.SrrService.getSlotList(
      localStorage.getItem('rolecode'),
      SRR_NO
    ).subscribe((res) => {
      debugger;
      this.slotDetailsList = res.Data;
    });
  }

  bookNow() {
    var slotDetails = this.slotDetailsForm.get('SLOTDETAILS') as FormArray;

    slotDetails.clear();

    debugger;
    var x = this.srrList;

    slotDetails.push(
      this.FormBuilder.group({
        SRR_ID: [''],
        SRR_NO: [''],
        POL: [''],
        POD: [''],
        VESSEL_NAME: [''],
        VOYAGE_NO: [''],
        MOTHER_VESSEL_NAME: [''],
        MOTHER_VOYAGE_NO: [''],
        SLOT_OPERATOR: [''],
        NO_OF_SLOTS: [''],
        AGENT_CODE: [''],
        AGENT_NAME: [''],
        CREATED_BY: [''],
      })
    );

    this.openBtn.nativeElement.click();
  }

  slotAllocation() {
    var slotDetails = this.slotDetailsForm.get('SLOTDETAILS') as FormArray;

    slotDetails.push(
      this.FormBuilder.group({
        SRR_ID: [''],
        SRR_NO: [''],
        POL: [''],
        POD: [''],
        VESSEL_NAME: [''],
        VOYAGE_NO: [''],
        MOTHER_VESSEL_NAME: [''],
        MOTHER_VOYAGE_NO: [''],
        SLOT_OPERATOR: [''],
        NO_OF_SLOTS: [''],
        AGENT_CODE: [''],
        AGENT_NAME: [''],
        CREATED_BY: [''],
      })
    );
  }

  closeModal(): void {
    this.closeBtn.nativeElement.click();
    this.closeBtn1.nativeElement.click();
  }

  getcurrentDate() {
    var date: any = new Date();

    var todate: any = date.getDate();
    if (todate < 10) {
      todate = '0' + todate;
    }

    var month = date.getMonth() + 1;

    if (month < 10) {
      month = '0' + month;
    }

    var year = date.getFullYear();
    return year + '-' + month + '-' + todate;
  }

  get f() {
    return this.containerForm.controls;
  }
}
