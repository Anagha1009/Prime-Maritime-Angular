import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  currencyForm1:FormGroup;
  currencymasterForm:FormGroup;
  CurrencyList: any[] = [];
  isUpdate: boolean = false;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  submitted:boolean=false;

  @ViewChild('closeBtn') closeBtn: ElementRef;

  @ViewChild('openModalPopup') openModalPopup: ElementRef;


  constructor(
    private _masterService: MasterService,
    private _commonService:CommonService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.currencyForm = this._formBuilder.group({
      ID: [0],
      KEY_NAME: [''],
      CODE: ['',Validators.required],
      CODE_DESC: ['',Validators.required],
      STATUS: ['',Validators.required],
      PARENT_CODE: [''],
      ON_HIRE_DATE:[''],
      OFF_HIRE_DATE:[''],
      CREATED_BY: [''],
    });
    this.currencyForm1 = this._formBuilder.group({
      KEY_NAME: [''],
      CODE: [''],
      CODE_DESC: [''],
      STATUS: [''],
      CREATED_BY: [''],
    });

    
    this.GetCurrencyMasterList();
  }

  get f(){
    return this.currencyForm.controls;
  }

  InsertCurrencyMaster() {
    this.submitted=true
    if(this.currencyForm.invalid){
      return

    }
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
          this.closeBtn.nativeElement.click();

          this.ClearForm();
        }
      });
  }

  GetCurrencyMasterList() {
    this._masterService.GetMasterList('CURRENCY').subscribe((res: any) => {
      this._commonService.destroyDT();

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
    debugger;
    this.submitted = false;
    this.ClearForm();

    if (ID > 0) {
      this.GetCurrencyMasterDetails(ID);
    }

    this.openModalPopup.nativeElement.click();
  }

  Search() {}

  ClearForm() {
    this.currencyForm.reset();
    this.currencyForm.get('KEY_NAME')?.setValue('');
    this.currencyForm.get('CODE')?.setValue('');
    this.currencyForm.get('CODE_DESC')?.setValue('');
    this.currencyForm.get('STATUS')?.setValue('');
  }
}
