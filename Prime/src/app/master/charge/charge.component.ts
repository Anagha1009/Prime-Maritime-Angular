import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-charge',
  templateUrl: './charge.component.html',
  styleUrls: ['./charge.component.scss'],
})
export class ChargeComponent implements OnInit {
  submitted: boolean = false;
  chargeForm: FormGroup;
  chargeList: any[] = [];
  portList: any[] = [];
  currencyList: any[] = [];
  tariffchargeList: any[] = [];

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _masterService: MasterService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.chargeForm = this._formBuilder.group({
      ID: [0],
      POL: ['', Validators.required],
      CHARGE_CODE: ['', Validators.required],
      CURRENCY: ['', Validators.required],
      IMPCOST20: [0, Validators.required],
      IMPCOST40: [0, Validators.required],
      IMPINCOME20: [0, Validators.required],
      IMPINCOME40: [0, Validators.required],
      EXPCOST20: [0, Validators.required],
      EXPCOST40: [0, Validators.required],
      EXPINCOME20: [0, Validators.required],
      EXPINCOME40: [0, Validators.required],
      FROM_VAL: [0, Validators.required],
      TO_VAL: [0, Validators.required],
    });

    this.GetChargeMasterList();
    this.getDropdown();
  }

  get f() {
    return this.chargeForm.controls;
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
      .getDropdownData('TARIFF_CHARGE')
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.tariffchargeList = res.Data;
        }
      });
  }

  GetChargeMasterList() {
    this._commonService.destroyDT();
    this._masterService.getChargeList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.chargeList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  DeleteChargeMaster(ID: number) {
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
        this._masterService.deleteCharge(ID).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
            this.GetChargeMasterList();
          }
        });
      }
    });
  }

  GetChargeMasterDetails(ID: number) {
    this.submitted = false;
    this._masterService.getChargeDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.chargeForm.patchValue(res.Data);
      }
    });
    this.openModalPopup.nativeElement.click();
  }

  UpdateChargeMaster() {
    this.submitted = true;
    if (this.chargeForm.invalid) {
      return;
    }

    this._masterService
      .updateCharge(JSON.stringify(this.chargeForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been updated successfully !'
          );
          this.GetChargeMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  ClearForm() {
    this.chargeForm.reset();
    this.chargeForm.get('ID').setValue(0);
    this.chargeForm.get('POL').setValue('');
    this.chargeForm.get('CHARGE_CODE').setValue('');
    this.chargeForm.get('CURRENCY').setValue('');
  }
}
