import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
})
export class CurrencyComponent implements OnInit {
  currencyForm: FormGroup;
  CurrencyList: any[] = [];
  isUpdate: boolean = false;

  constructor(
    private _masterService: MasterService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.currencyForm = this._formBuilder.group({
      ID: [0],
      KEY_NAME: [''],
      CODE: [''],
      CODE_DESC: [''],
      STATUS: [''],
      PARENT_CODE: [''],
      CREATED_BY: [''],
    });
    this.GetCurrencyMasterList();
  }

  InsertCurrencyMaster() {
    this.currencyForm
      .get('CREATED_BY')
      ?.setValue(localStorage.getItem('username'));
    var status = this.currencyForm.get('STATUS')?.value;
    this.currencyForm.get('STATUS')?.setValue(status == 'true' ? true : false);
    this.currencyForm.get('KEY_NAME')?.setValue('CURRENCY');

    this._masterService
      .InsertMaster(JSON.stringify(this.currencyForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your record has been submitted successfully !');
          this.GetCurrencyMasterList();
          this.ClearForm();
        }
      });
  }

  GetCurrencyMasterList() {
    this._masterService.GetMasterList('CURRENCY').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.CurrencyList = res.Data;
      }
    });
  }

  GetCurrencyMasterDetails(ID: number) {
    this._masterService.GetMasterDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.currencyForm.patchValue(res.Data);
        this.isUpdate = true;
      }
    });
  }

  UpdateCurrencyMaster() {
    this.currencyForm
      .get('CREATED_BY')
      ?.setValue(localStorage.getItem('username'));
    var status = this.currencyForm.get('STATUS')?.value;
    this.currencyForm.get('STATUS')?.setValue(status == 'true' ? true : false);

    this.currencyForm.get('KEY_NAME')?.setValue('CURRENCY');

    this._masterService
      .UpdateMaster(JSON.stringify(this.currencyForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your Service Type master has been Updated successfully !');
          this.GetCurrencyMasterList();
          this.ClearForm();
          this.isUpdate = false;
        }
      });
  }

  DeleteCurrencyMaster(ID: number) {
    debugger;
    if (confirm('Are you sure want to delete this record ?')) {
      this._masterService.DeleteMaster(ID).subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          alert('Your record has been deleted successfully !');
          this.GetCurrencyMasterList();
        }
      });
    }
  }

  ClearForm() {
    this.currencyForm.reset();
    this.currencyForm.get('KEY_NAME')?.setValue('');
    this.currencyForm.get('CODE')?.setValue('');
    this.currencyForm.get('CODE_DESC')?.setValue('');
    this.currencyForm.get('STATUS')?.setValue('');
  }
}
