import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SCHEDULE, VOYAGE } from 'src/app/models/vessel';
import { BookingService } from 'src/app/services/booking.service';
import { CommonService } from 'src/app/services/common.service';
import { VesselService } from 'src/app/services/vessel.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-voyage',
  templateUrl: './voyage.component.html',
  styleUrls: ['./voyage.component.scss'],
})
export class VoyageComponent implements OnInit {
  voyageForm: FormGroup;
  voyageForm1: FormGroup;
  voyageList: any[] = [];
  vesselList: any[] = [];
  portList: any[] = [];
  currencyList: any[] = [];
  terminalList: any[] = [];
  submitted: boolean = false;
  servicenameList: any[] = [];
  isUpdate: boolean = false;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  voyage: VOYAGE = new VOYAGE();

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _voyageService: VesselService,
    private _bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.voyageForm = this._formBuilder.group({
      ID: [0],
      VESSEL_NAME: ['', Validators.required],
      VOYAGE_NO: ['', Validators.required],
      ATA: ['', Validators.required],
      ATD: ['', Validators.required],
      IMM_CURR: ['', Validators.required],
      IMM_CURR_RATE: ['', Validators.required],
      EXP_CURR: ['', Validators.required],
      EXP_CURR_RATE: ['', Validators.required],
      TERMINAL_CODE: ['', Validators.required],
      SERVICE_NAME: ['', Validators.required],
      VIA_NO: ['', Validators.required],
      PORT_CODE: ['', Validators.required],
      ETA: ['', Validators.required],
      ETD: ['', Validators.required],
      CREATED_BY: [''],
      STATUS: [''],
    });

    this.voyageForm1 = this._formBuilder.group({
      STATUS: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.getDropdown();
    this.GetVoyageList();
  }

  GetVoyageList() {
    this._commonService.destroyDT();
    this._voyageService.getVoyageList(this.voyage).subscribe((res: any) => {
      this.isLoading = false;
      this.isLoading1 = false;
      if (res.ResponseCode == 200) {
        this.voyageList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  GetVoyageDetails(ID: number) {
    this._voyageService.GetVoyageDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.voyageForm.patchValue(res.Data);
        this.voyageForm
          .get('ATA')
          ?.setValue(formatDate(res.Data.ETA, 'yyyy-MM-dd', 'en'));
        this.voyageForm
          .get('ATD')
          ?.setValue(formatDate(res.Data.ETD, 'yyyy-MM-dd', 'en'));
        this.voyageForm
          .get('ETA')
          ?.setValue(formatDate(res.Data.ETA, 'yyyy-MM-dd', 'en'));
        this.voyageForm
          .get('ETD')
          ?.setValue(formatDate(res.Data.ETD, 'yyyy-MM-dd', 'en'));
      }
    });
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
          this._commonService.successMsg(
            'Your record has been inserted successfully !'
          );
          this.closeBtn.nativeElement.click();
        }
      });
  }

  UpdateVoyage() {
    this.submitted = true;
    if (this.voyageForm.invalid) {
      return;
    }

    this._voyageService
      .updateVoyage(JSON.stringify(this.voyageForm.value))
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this._commonService.successMsg(
            'Your record has been Updated successfully !'
          );
          this.GetVoyageList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  DeleteSchedule(ID: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this._voyageService.deleteVoyage(ID).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
            this.GetVoyageList();
          }
        });
      }
    });
  }

  getServiceName1(event: any) {
    this.servicenameList = [];
    // this.slotDetailsForm.get('SERVICE_NAME')?.setValue('');
    this._commonService
      .getDropdownData('SERVICE_NAME', event, '')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.servicenameList = res.Data;
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
      }
    });

    this._commonService.getDropdownData('CURRENCY').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.currencyList = res.Data;
      }
    });

    this._commonService.getDropdownData('PORT').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.portList = res.Data;
      }
    });

    this._commonService.getDropdownData('TERMINAL').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.terminalList = res.Data;
      }
    });
  }

  ClearForm() {
    this.voyageForm.reset();
    this.voyageForm.get('ID')?.setValue(0);
  }

  Search() {
    var STATUS =
      this.voyageForm1.value.STATUS == null
        ? ''
        : this.voyageForm1.value.STATUS;
    var FROM_DATE =
      this.voyageForm1.value.FROM_DATE == null
        ? ''
        : this.voyageForm1.value.FROM_DATE;
    var TO_DATE =
      this.voyageForm1.value.TO_DATE == null
        ? ''
        : this.voyageForm1.value.TO_DATE;

    if (STATUS == '' && FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.voyage.STATUS = STATUS;
    this.voyage.FROM_DATE = FROM_DATE;
    this.voyage.TO_DATE = TO_DATE;
    this.isLoading = true;
    this.GetVoyageList();
  }

  Clear() {
    this.voyageForm1.reset();
    this.voyageForm1.get('STATUS')?.setValue('');
    this.voyage = new VOYAGE();
    this.isLoading1 = true;
    this.GetVoyageList();
  }

  openModal(ID: any = 0) {
    this.submitted = false;
    this.isUpdate = false;
    this.ClearForm();

    if (ID > 0) {
      this.isUpdate = true;
      this.GetVoyageDetails(ID);
    }

    this.openModalPopup.nativeElement.click();
  }
}
