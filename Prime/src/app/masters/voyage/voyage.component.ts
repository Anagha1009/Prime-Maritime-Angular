import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from 'src/app/services/booking.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-voyage',
  templateUrl: './voyage.component.html',
  styleUrls: ['./voyage.component.scss']
})
export class VoyageComponent implements OnInit {
  voyageForm: FormGroup;
  vesselList: any[] = [];
  vesselList1: any[] = [];
  currencyList: any[] = [];
  currencyList1: any[] = [];
  currencyList2: any[] = [];
  portList: any[] = [];
  submitted: boolean = false;
  isVoyageAdded: boolean = false;
  servicenameList1: any[] = [];

  @ViewChild('closeBtn') closeBtn: ElementRef;
  
  constructor( private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _bookingService: BookingService,
    private _router: Router,) { }

  ngOnInit(): void {
    this.voyageForm = this._formBuilder.group({
      VESSEL_NAME: ['',Validators.required],
      VOYAGE_NO: ['',Validators.required],
      ATA: ['',Validators.required],
      ATD: ['',Validators.required],
      IMM_CURR: ['',Validators.required],
      IMM_CURR_RATE: ['',Validators.required],
      EXP_CURR: ['',Validators.required],
      EXP_CURR_RATE: ['',Validators.required],
      TERMINAL_CODE: ['',Validators.required],
      SERVICE_NAME: ['',Validators.required],
      VIA_NO: ['',Validators.required],
      PORT_CODE: ['',Validators.required],
      ETA: ['',Validators.required],
      ETD: ['',Validators.required],
      CREATED_BY: [''],
    });
    this.getDropdown();
  }

  insertVoyage() {
    this.submitted = true;

    if (this.voyageForm.invalid) {
      return;
    }

    this.voyageForm
      .get('CREATED_BY')
      ?.setValue(localStorage.getItem('username'));

    this._bookingService
      .insertVoyage(JSON.stringify(this.voyageForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Voyage added successfully !');
          
          this.isVoyageAdded = true;
          this.closeBtn.nativeElement.click();
        }
      });
  }

  getServiceName1(event: any) {
    this.servicenameList1 = [];
    // this.slotDetailsForm.get('SERVICE_NAME')?.setValue('');
    this._commonService
      .getDropdownData('SERVICE_NAME', event, '')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.servicenameList1 = res.Data;
        }
      });
  }


  get f() {
    return this.voyageForm.controls;
  }

  getDropdown() {
    this._commonService.getDropdownData('VESSEL_NAME').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.vesselList = res.Data;
        this.vesselList1 = res.Data;
      }
    });

    this._commonService.getDropdownData('CURRENCY').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.currencyList = res.Data;
        this.currencyList1 = res.Data;
        this.currencyList2 = res.Data;
      }
    }); 

    this._commonService.getDropdownData('PORT').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.portList = res.Data;
      }
    });
  }
  


}


