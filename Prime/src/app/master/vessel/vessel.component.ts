import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VESSEL } from 'src/app/models/vessel';
import { CommonService } from 'src/app/services/common.service';
import { VesselService } from 'src/app/services/vessel.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vessel',
  templateUrl: './vessel.component.html',
  styleUrls: ['./vessel.component.scss'],
})
export class VesselComponent implements OnInit {
  submitted: boolean = false;
  vesselForm: FormGroup;
  vesselForm1: FormGroup;
  isUpdate: boolean = false;
  vesselList: any[] = [];
  isLoading: boolean = false;
  isLoading1: boolean = false;
  vessel: VESSEL = new VESSEL();

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _vesselService: VesselService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.vesselForm = this._formBuilder.group({
      ID: [0],
      VESSEL_NAME: ['', Validators.required],
      IMO_NO: ['', Validators.required],
      COUNTRY_CODE: ['', Validators.required],
      VESSEL_CODE: ['', Validators.required],
      STATUS: ['', Validators.required],
      CREATED_BY: [''],
    });

    this.vesselForm1 = this._formBuilder.group({
      VESSEL_NAME: [''],
      IMO_NO: [''],
      STATUS: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.GetVesselMasterList();
  }

  get f() {
    return this.vesselForm.controls;
  }

  GetVesselMasterList() {
    this._commonService.destroyDT();
    this._vesselService.getVesselList(this.vessel).subscribe((res: any) => {
      this.isLoading = false;
      this.isLoading1 = false;
      if (res.ResponseCode == 200) {
        this.vesselList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  openModal(ID: any = 0) {
    this.submitted = false;
    this.isUpdate = false;
    this.ClearForm();

    if (ID > 0) {
      this.isUpdate = true;
      this.GetVesselMasterDetails(ID);
    }

    this.openModalPopup.nativeElement.click();
  }

  InsertVesselMaster() {
    this.submitted = true;
    if (this.vesselForm.invalid) {
      return;
    }

    this.vesselForm
      .get('CREATED_BY')
      ?.setValue(this._commonService.getUserName());

    this._vesselService
      .postVessel(JSON.stringify(this.vesselForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been inserted successfully !'
          );
          this.GetVesselMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  GetVesselMasterDetails(vesselId: any) {
    this._vesselService.getVesselDetails(vesselId).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.vesselForm.patchValue(res.Data);
      }
    });
  }

  UpdateVesselMaster() {
    this.submitted = true;
    if (this.vesselForm.invalid) {
      return;
    }

    this._vesselService
      .UpdateVesselMaster(JSON.stringify(this.vesselForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been Updated successfully !'
          );
          this.GetVesselMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  DeleteVesselMaster(vesselId: number) {
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
        this._vesselService
          .DeleteVesselMaster(vesselId)
          .subscribe((res: any) => {
            if (res.ResponseCode == 200) {
              Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
              this.GetVesselMasterList();
            }
          });
      }
    });
  }

  Search() {
    var VESSEL_NAME =
      this.vesselForm1.value.VESSEL_NAME == null
        ? ''
        : this.vesselForm1.value.VESSEL_NAME;

    var IMO_NO =
      this.vesselForm1.value.IMO_NO == null
        ? ''
        : this.vesselForm1.value.IMO_NO;

    var STATUS =
      this.vesselForm1.value.STATUS == null
        ? ''
        : this.vesselForm1.value.STATUS;
    var FROM_DATE =
      this.vesselForm1.value.FROM_DATE == null
        ? ''
        : this.vesselForm1.value.FROM_DATE;
    var TO_DATE =
      this.vesselForm1.value.TO_DATE == null
        ? ''
        : this.vesselForm1.value.TO_DATE;

    if (
      STATUS == '' &&
      FROM_DATE == '' &&
      TO_DATE == '' &&
      VESSEL_NAME == '' &&
      IMO_NO == ''
    ) {
      alert('Please enter atleast one filter to search !');
    }

    this.vessel.STATUS = STATUS;
    this.vessel.FROM_DATE = FROM_DATE;
    this.vessel.TO_DATE = TO_DATE;
    this.vessel.VESSEL_NAME = VESSEL_NAME;
    this.vessel.IMO_NO = IMO_NO;

    this.isLoading = true;
    this.GetVesselMasterList();
  }

  ClearForm() {
    this.vesselForm.reset();
    this.vesselForm.get('ID')?.setValue(0);
  }

  Clear() {
    this.vesselForm1.reset();
    this.vesselForm1.get('STATUS')?.setValue('');
    this.vessel = new VESSEL();
    this.isLoading1 = true;
    this.GetVesselMasterList();
  }
}
