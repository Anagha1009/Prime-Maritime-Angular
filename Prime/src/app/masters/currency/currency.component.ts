import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MASTER } from 'src/app/models/master';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
})
export class CurrencyComponent implements OnInit {
  currencyForm: FormGroup;
  currencyForm1: FormGroup;
  currencymasterForm: FormGroup;
  CurrencyList: any[] = [];
  isUpdate: boolean = false;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  submitted: boolean = false;
  master: MASTER = new MASTER();

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _masterService: MasterService,
    private _commonService: CommonService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.currencyForm = this._formBuilder.group({
      ID: [0],
      KEY_NAME: [''],
      CODE: ['', Validators.required],
      CODE_DESC: ['', Validators.required],
      STATUS: ['', Validators.required],
      CREATED_BY: [''],
    });

    this.currencyForm1 = this._formBuilder.group({
      STATUS: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.GetCurrencyMasterList();
  }

  get f() {
    return this.currencyForm.controls;
  }

  InsertCurrencyMaster() {
    this.submitted = true;
    if (this.currencyForm.invalid) {
      return;
    }

    this.currencyForm
      .get('CREATED_BY')
      ?.setValue(localStorage.getItem('username'));

    this.currencyForm.get('KEY_NAME')?.setValue('CURRENCY');

    this._masterService
      .InsertMaster(JSON.stringify(this.currencyForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been inserted successfully !'
          );
          this.GetCurrencyMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  GetCurrencyMasterList() {
    this._commonService.destroyDT();
    this.master.KEY_NAME = 'CURRENCY';
    this._masterService.GetMasterList(this.master).subscribe((res: any) => {
      this.isLoading = false;
      this.isLoading1 = false;
      if (res.ResponseCode == 200) {
        this.CurrencyList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  GetCurrencyMasterDetails(ID: number) {
    this._masterService.GetMasterDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.currencyForm.patchValue(res.Data);
      }
    });
  }

  UpdateCurrencyMaster() {
    this.currencyForm.get('KEY_NAME')?.setValue('CURRENCY');

    this._masterService
      .UpdateMaster(JSON.stringify(this.currencyForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been Updated successfully !'
          );
          this.GetCurrencyMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  DeleteCurrencyMaster(ID: number) {
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
        this._masterService.DeleteMaster(ID).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
            this.GetCurrencyMasterList();
          }
        });
      }
    });
  }

  openModal(ID: any = 0) {
    this.submitted = false;
    this.isUpdate = false;
    this.ClearForm();

    if (ID > 0) {
      this.isUpdate = true;
      this.GetCurrencyMasterDetails(ID);
    }

    this.openModalPopup.nativeElement.click();
  }

  Search() {
    var STATUS =
      this.currencyForm1.value.STATUS == null
        ? ''
        : this.currencyForm1.value.STATUS;
    var FROM_DATE =
      this.currencyForm1.value.FROM_DATE == null
        ? ''
        : this.currencyForm1.value.FROM_DATE;
    var TO_DATE =
      this.currencyForm1.value.TO_DATE == null
        ? ''
        : this.currencyForm1.value.TO_DATE;

    if (STATUS == '' && FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
    }

    this.master.STATUS = STATUS;
    this.master.FROM_DATE = FROM_DATE;
    this.master.TO_DATE = TO_DATE;

    this.isLoading = true;
    this.GetCurrencyMasterList();
  }

  ClearForm() {
    this.currencyForm.reset();
    this.currencyForm.get('ID')?.setValue(0);
  }

  Clear() {
    this.currencyForm1.reset();
    this.currencyForm1.get('STATUS')?.setValue('');
    this.master = new MASTER();
    this.isLoading1 = true;
    this.GetCurrencyMasterList();
  }
}
