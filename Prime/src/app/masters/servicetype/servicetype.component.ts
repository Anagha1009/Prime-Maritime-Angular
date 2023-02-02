import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-servicetype',
  templateUrl: './servicetype.component.html',
  styleUrls: ['./servicetype.component.scss'],
})
export class ServicetypeComponent implements OnInit {
  submitted: boolean = false;
  typeForm: FormGroup;
  typeForm1:FormGroup;
  TypeList: any[] = [];
  isUpdate: boolean = false;
  isLoading: boolean = false;
  isLoading1: boolean = false;

  @ViewChild('closeBtn') closeBtn: ElementRef;

  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _masterService: MasterService,
    private _formBuilder: FormBuilder,
    private _commonService:CommonService
  ) {}

  ngOnInit(): void {
    this.typeForm = this._formBuilder.group({
      ID: [0],
      KEY_NAME: [''],
      CODE: ['',Validators.required],
      CODE_DESC: ['',Validators.required],
      STATUS: ['',Validators.required],
      ON_HIRE_DATE:[''],
      OFF_HIRE_DATE:[''],
      PARENT_CODE: [''],
      CREATED_BY: [''],
    });
    this.typeForm1=this._formBuilder.group({
      KEY_NAME: [''],
      CODE: ['',Validators.required],
      CODE_DESC: ['',Validators.required],
      STATUS: ['',Validators.required],
      ON_HIRE_DATE:[''],
      OFF_HIRE_DATE:[''],
      PARENT_CODE: [''],
      FROM_DATE:[''],
      TO_DATE:[''],
      CREATED_BY: [''],
    })

    this.GetServiceTypeMasterList();
  }

  get f(){
    return this.typeForm.controls;
  }

  
  InsertServiceTypeMaster() {

    this.submitted=true
    if(this.typeForm.invalid){
      return
    }
    this.typeForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    var status = this.typeForm.get('STATUS')?.value;
    this.typeForm.get('STATUS')?.setValue(status == 'true' ? true : false);
    this.typeForm.get('KEY_NAME')?.setValue('SERVICE_TYPE');

    this._masterService
      .InsertMaster(JSON.stringify(this.typeForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your record has been submitted successfully !');
          this.GetServiceTypeMasterList();
          this.closeBtn.nativeElement.click();

          this.ClearForm();
        }
      });
  }

  GetServiceTypeMasterList() {
    this._masterService.GetMasterList('SERVICE_TYPE').subscribe((res: any) => {
      this._commonService.destroyDT();

      if (res.ResponseCode == 200) {
        this.TypeList = res.Data;
      }
      this._commonService.getDT();

    });
  }

  GetServiceTypeMasterDetails(ID: number) {
    this._masterService.GetMasterDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.typeForm.patchValue(res.Data);
        this.isUpdate = true;
      }
    });
  }

  UpdateServiceTypeMaster() {
    this.typeForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    var status = this.typeForm.get('STATUS')?.value;
    this.typeForm.get('STATUS')?.setValue(status == 'true' ? true : false);
    this.typeForm.get('KEY_NAME')?.setValue('SERVICE_TYPE');

    this._masterService
      .UpdateMaster(JSON.stringify(this.typeForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your Service Type master has been Updated successfully !');
          this.GetServiceTypeMasterList();
          this.ClearForm();
          this.isUpdate = false;
          this.closeBtn.nativeElement.click();

        }
      });
  }

  Search() {}


  ClearForm() {
    this.typeForm.reset();
    this.typeForm.get('STATUS')?.setValue('');
  }
  Clear() {
    this.typeForm1.get('KEY_NAME')?.setValue('');
    this.typeForm1.get('CODE')?.setValue('');
    this.typeForm1.get('CODE_DESC')?.setValue('');
    this.typeForm1.get('STATUS')?.setValue('');
    this.typeForm1.get('ON_HIRE_DATE')?.setValue('');
    this.typeForm1.get('OFF_HIRE_DATE')?.setValue(''); 
    this.isLoading1 = true;
    this.GetServiceTypeMasterList();
  }

  openModal(ID: any = 0) {
    this.submitted = false;
    this.ClearForm();

    if (ID > 0) {
      this.GetServiceTypeMasterDetails(ID);
    }

    this.openModalPopup.nativeElement.click();
  }

  
  DeleteServiceTypeMaster(ID: number) {
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
         this.GetServiceTypeMasterList();
}
        });
      }
    });
  }
}
