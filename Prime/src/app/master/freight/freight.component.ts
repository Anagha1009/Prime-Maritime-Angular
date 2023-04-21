import { Format } from '@angular-devkit/build-angular/src/builders/extract-i18n/schema';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-freight',
  templateUrl: './freight.component.html',
  styleUrls: ['./freight.component.scss'],
})
export class FreightComponent implements OnInit {
  submitted: boolean = false;
  freightForm: FormGroup;
  freightList: any[] = [];
  isUpdate: boolean = false;
  portList: any[] = [];
  currencyList: any[] = [];
  chargeType: any = '';
  submitted1: boolean = false;
  tariffchargeList: any[] = [];

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;
  @ViewChild('openModalPopup1') openModalPopup1: ElementRef;

  constructor(
    private _masterService: MasterService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.freightForm = this._formBuilder.group({
      ID: [0],
      POL: ['', Validators.required],
      POD: ['', Validators.required],
      Charge: ['', Validators.required],
      CHARGE_CODE: ['', Validators.required],
      Currency: ['', Validators.required],
      LadenStatus: ['', Validators.required],
      LadenStatus1: ['', Validators.required],
      ServiceMode: ['', Validators.required],
      DRY20: ['', Validators.required],
      FROM_VAL: [0],
      TO_VAL: [0],
      STATUS: [Validators.required],
      CHARGELIST: new FormArray([]),
    });

    this.GetFreightMasterList();
    this.getDropdown();
  }

  get f() {
    return this.freightForm.controls;
  }

  get f1() {
    const add = this.freightForm.get('CHARGELIST') as FormArray;
    return add.controls;
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

  GetFreightMasterList() {
    this._commonService.destroyDT();
    this._masterService.getFreightList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.freightList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  InsertFreightMaster() {
    this.submitted = true;
    if (this.freightForm.invalid) {
      return;
    }

    console.log(JSON.stringify(this.freightForm.value));
    this._masterService
      .insertFreight(JSON.stringify(this.freightForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been inserted successfully !'
          );
          this.GetFreightMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  DeleteFreightMaster(ID: number) {
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
        this._masterService.deleteFreight(ID).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
            this.GetFreightMasterList();
          }
        });
      }
    });
  }

  GetFreightMasterDetails(ID: number) {
    this.isUpdate = true;
    this.chargeType = 'Freight';

    this.freightForm.get('Charge').enable();
    this.freightForm.get('POD').enable();
    this.freightForm.get('LadenStatus').enable();
    this.freightForm.get('LadenStatus1').enable();
    this.freightForm.get('ServiceMode').enable();
    this.freightForm.get('DRY20').enable();

    this.freightForm.get('CHARGE_CODE').disable();
    this.freightForm.get('FROM_VAL').disable();
    this.freightForm.get('TO_VAL').disable();
    this.freightForm.get('STATUS').disable();

    const add = this.freightForm.get('CHARGELIST') as FormArray;
    add.clear();

    this._masterService.getFreightDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.freightForm.patchValue(res.Data);

        if (res.Data.LadenStatus == 'L') {
          this.freightForm.get('LadenStatus1').setValue(true);
        } else {
          this.freightForm.get('LadenStatus1').setValue(false);
        }
      }
    });
    this.openModalPopup1.nativeElement.click();
  }

  UpdateFreightMaster() {
    this.submitted = true;
    if (this.freightForm.invalid) {
      return;
    }

    this._masterService
      .updateFreight(JSON.stringify(this.freightForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been updated successfully !'
          );
          this.GetFreightMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  ClearForm() {
    this.freightForm.reset();
    this.freightForm.get('ID').setValue(0);
    this.freightForm.get('POL').setValue('');
    this.freightForm.get('POD').setValue('');
    this.freightForm.get('Charge').setValue('');
    this.freightForm.get('Currency').setValue('');
  }

  openModal() {
    this.submitted1 = true;
    this.submitted = false;
    this.isUpdate = false;

    this.freightForm.reset();
    this.freightForm.get('POL').setValue('');
    this.freightForm.get('POD').setValue('');
    this.freightForm.get('CHARGE_CODE').setValue('');
    this.freightForm.get('Charge').setValue('');
    this.freightForm
      .get('Currency')
      .setValue(this.chargeType == 'Freight' ? 'USD' : '');
    this.freightForm.get('FROM_VAL').setValue(0);
    this.freightForm.get('TO_VAL').setValue(0);
    this.freightForm.get('ID').setValue(0);

    const add = this.freightForm.get('CHARGELIST') as FormArray;
    add.clear();

    if (this.chargeType == '') {
      return;
    } else if (this.chargeType == 'Freight') {
      this.freightForm.get('CHARGE_CODE').disable();
      this.freightForm.get('FROM_VAL').disable();
      this.freightForm.get('TO_VAL').disable();
      this.freightForm.get('STATUS').disable();

      this.freightForm.get('Charge').enable();
      this.freightForm.get('POD').enable();
      this.freightForm.get('LadenStatus').enable();
      this.freightForm.get('LadenStatus1').enable();
      this.freightForm.get('ServiceMode').enable();
      this.freightForm.get('DRY20').enable();
    } else if (this.chargeType == 'Charge') {
      this.freightForm.get('Charge').disable();
      this.freightForm.get('POD').disable();
      this.freightForm.get('LadenStatus').disable();
      this.freightForm.get('LadenStatus1').disable();
      this.freightForm.get('ServiceMode').disable();
      this.freightForm.get('DRY20').disable();

      this.freightForm.get('CHARGE_CODE').enable();
      this.freightForm.get('FROM_VAL').enable();
      this.freightForm.get('TO_VAL').enable();
      this.freightForm.get('STATUS').enable();
    }

    this.openModalPopup1.nativeElement.click();
  }

  openChargeModal() {
    this.submitted1 = false;
    this.chargeType = '';
    this.openModalPopup.nativeElement.click();
  }

  onchangeLaden(event: any) {
    if (event.target.checked) {
      this.freightForm.get('LadenStatus').setValue('L');
    } else {
      this.freightForm.get('LadenStatus').setValue('E');
    }
  }

  addNew() {
    this.submitted = true;

    if (this.freightForm.invalid) {
      return;
    }

    const add = this.freightForm.get('CHARGELIST') as FormArray;
    add.push(
      this._formBuilder.group({
        POL: [this.freightForm.get('POL').value],
        CHARGE_CODE: [this.freightForm.get('CHARGE_CODE').value],
        IETYPE: [''],
        ICTYPE: [''],
        IMPCOST20: [0],
        IMPCOST40: [0],
        IMPREVENUE20: [0],
        IMPREVENUE40: [0],
        EXPCOST20: [0],
        EXPCOST40: [0],
        EXPREVENUE20: [0],
        EXPREVENUE40: [0],
        CURRENCY: [this.freightForm.get('Currency').value],
        FROM_VAL: [this.freightForm.get('FROM_VAL').value],
        TO_VAL: [this.freightForm.get('TO_VAL').value],
        STATUS: [''],
      })
    );
  }

  deleteCharge(i: any) {
    const add = this.freightForm.get('CHARGELIST') as FormArray;

    add.removeAt(i);
  }
}
