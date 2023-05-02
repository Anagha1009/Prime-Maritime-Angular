import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stevedoring',
  templateUrl: './stevedoring.component.html',
  styleUrls: ['./stevedoring.component.scss'],
})
export class StevedoringComponent implements OnInit {
  submitted: boolean = false;
  steveForm: FormGroup;
  steveList: any[] = [];
  portList: any[] = [];
  currencyList: any[] = [];
  terminalList: any[] = [];

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _masterService: MasterService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.steveForm = this._formBuilder.group({
      ID: [0],
      IE_TYPE: ['', Validators.required],
      POL: ['', Validators.required],
      TERMINAL: ['', Validators.required],
      CHARGE_CODE: ['', Validators.required],
      CURRENCY: ['', Validators.required],
      LADEN_STATUS: ['', Validators.required],
      SERVICE_MODE: ['', Validators.required],
      DRY20: [0, Validators.required],
      DRY40: [0, Validators.required],
      DRY40HC: [0, Validators.required],
      DRY45: [0, Validators.required],
      RF20: [0, Validators.required],
      RF40: [0, Validators.required],
      RF40HC: [0, Validators.required],
      RF45: [0, Validators.required],
      HAZ20: [0, Validators.required],
      HAZ40: [0, Validators.required],
      HAZ40HC: [0, Validators.required],
      HAZ45: [0, Validators.required],
      SEQ20: [0, Validators.required],
      SEQ40: [0, Validators.required],
    });

    this.GetSteveMasterList();
    this.getDropdown();
  }

  get f() {
    return this.steveForm.controls;
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

  getTerminalDropdown(event: any) {
    this.steveForm.get('TERMINAL').setValue('');
    this.terminalList = [];
    this._commonService
      .getDropdownData('TERMINAL', event)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.terminalList = res.Data;
        }
      });
  }

  GetSteveMasterList() {
    this._commonService.destroyDT();
    this._masterService.getSteveList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.steveList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  DeleteSteveMaster(ID: number) {
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
        this._masterService.deleteSteve(ID).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
            this.GetSteveMasterList();
          }
        });
      }
    });
  }

  GetSteveMasterDetails(ID: number) {
    this.submitted = false;
    this._masterService.getSteveDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.steveForm.patchValue(res.Data);
      }
    });
    this.openModalPopup.nativeElement.click();
  }

  UpdateSteveMaster() {
    this.submitted = true;
    if (this.steveForm.invalid) {
      return;
    }

    this._masterService
      .updateSteve(JSON.stringify(this.steveForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been updated successfully !'
          );
          this.GetSteveMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  ClearForm() {
    this.steveForm.reset();
    this.steveForm.get('ID').setValue(0);
    this.steveForm.get('POL').setValue('');
    this.steveForm.get('CHARGE_CODE').setValue('');
    this.steveForm.get('CURRENCY').setValue('');
  }
}
