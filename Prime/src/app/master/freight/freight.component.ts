import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;

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
      Currency: ['', Validators.required],
      LadenStatus: ['', Validators.required],
      LadenStatus1: ['', Validators.required],
      ServiceMode: ['', Validators.required],
      DRY20: ['', Validators.required],
    });

    this.GetFreightMasterList();
    this.getDropdown();
  }

  get f() {
    return this.freightForm.controls;
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

  openModal(ID: any = 0) {
    this.submitted = false;
    this.isUpdate = false;
    this.ClearForm();

    if (ID > 0) {
      this.isUpdate = true;
      this.GetFreightMasterDetails(ID);
    }

    this.openModalPopup.nativeElement.click();
  }

  onchangeLaden(event: any) {
    if (event.target.checked) {
      this.freightForm.get('LadenStatus').setValue('L');
    } else {
      this.freightForm.get('LadenStatus').setValue('E');
    }
  }
}
