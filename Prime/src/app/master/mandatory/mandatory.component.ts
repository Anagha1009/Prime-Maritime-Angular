import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mandatory',
  templateUrl: './mandatory.component.html',
  styleUrls: ['./mandatory.component.scss'],
})
export class MandatoryComponent implements OnInit {
  submitted: boolean = false;
  mandatoryForm: FormGroup;
  mandatoryList: any[] = [];
  portList: any[] = [];
  currencyList: any[] = [];
  orgList: any[] = [];

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _masterService: MasterService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.mandatoryForm = this._formBuilder.group({
      ID: [0],
      PORT_CODE: ['', Validators.required],
      ORG_CODE: ['', Validators.required],
      CHARGE_CODE: ['', Validators.required],
      IE_TYPE: ['', Validators.required],
      LADEN_STATUS: ['', Validators.required],
      CURRENCY: [0, Validators.required],
      RATE20: [0, Validators.required],
      RATE40: [0, Validators.required],
      IS_PERCENTAGE: [false],
      PERCENTAGE_VALUE: [0],
    });

    this.GetMandatoryMasterList();
    this.getDropdown();
  }

  get f() {
    return this.mandatoryForm.controls;
  }

  getDropdown() {
    this._commonService.getDropdownData('PORT').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.portList = res.Data;
      }
    });

    this._commonService.getDropdownData('CURRENCY').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.currencyList = res.Data;
      }
    });

    this._commonService
      .getDropdownData('ORGANISATION')
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.orgList = res.Data;
        }
      });
  }

  GetMandatoryMasterList() {
    this._commonService.destroyDT();
    this._masterService.getMandatoryList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.mandatoryList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  DeleteMandatoryMaster(ID: number) {
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
        this._masterService.deleteMandatory(ID).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
            this.GetMandatoryMasterList();
          }
        });
      }
    });
  }

  GetMandatoryMasterDetails(ID: number) {
    this.submitted = false;
    this._masterService.getMandatoryDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.mandatoryForm.patchValue(res.Data);
      }
    });
    this.openModalPopup.nativeElement.click();
  }

  UpdateMandatoryMaster() {
    this.submitted = true;
    if (this.mandatoryForm.invalid) {
      return;
    }

    this._masterService
      .updateMandatory(JSON.stringify(this.mandatoryForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been updated successfully !'
          );
          this.GetMandatoryMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  ClearForm() {
    this.mandatoryForm.reset();
    this.mandatoryForm.get('ID').setValue(0);
    this.mandatoryForm.get('PORT_CODE').setValue('');
    this.mandatoryForm.get('CURRENCY').setValue('');
    this.mandatoryForm.get('ORG_CODE').setValue('');
    this.mandatoryForm.get('IE_TYPE').setValue('');
    this.mandatoryForm.get('LADEN_STATUS').setValue('');
    this.mandatoryForm.get('RATE20').setValue(0);
    this.mandatoryForm.get('RATE40').setValue(0);
    this.mandatoryForm.get('IS_PERCENTAGE').setValue(false);
    this.mandatoryForm.get('PERCENTAGE_VALUE').setValue(0);
  }
}
