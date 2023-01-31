import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MASTER } from 'src/app/models/master';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-port',
  templateUrl: './port.component.html',
  styleUrls: ['./port.component.scss'],
})
export class PortComponent implements OnInit {
  portForm: FormGroup;
  portForm1:FormGroup;
  PortList: any;
  data: any;
  isUpdate: boolean = false;
  isLoading: boolean = false;
  isLoading1:boolean= false;

  submitted:boolean=false;

  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _masterService: MasterService,
    private _formBuilder: FormBuilder,
    private _commonService:CommonService,
  ) {}

  ngOnInit(): void {
    this.portForm = this._formBuilder.group({
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
    this.portForm1=this._formBuilder.group({
      KEY_NAME: [''],
      CODE: [''],
      CODE_DESC: [''],
      STATUS: [''],
      PARENT_CODE: [''],
      ON_HIRE_DATE:[''],
      OFF_HIRE_DATE:[''],
      CREATED_BY: ['']
    });
    this.GetPortMasterList();
  }

  get f(){
    return this.portForm.controls;
  }

  

  GetPortMasterList() {
    this._masterService.GetMasterList('PORT').subscribe((res: any) => {
      this._commonService.destroyDT();

      if (res.ResponseCode == 200) {
        this.PortList = res.Data;
      }
      this._commonService.getDT();

    });
  }

  InsertPortMaster() {

    this.submitted=true
    if(this.portForm.invalid){
      return
    }
    this.portForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    var status = this.portForm.get('STATUS')?.value;
    this.portForm.get('STATUS')?.setValue(status == 'true' ? true : false);
    this.portForm.get('KEY_NAME')?.setValue('PORT');

    this._masterService
      .InsertMaster(JSON.stringify(this.portForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your record has been submitted successfully !');
          this.GetPortMasterList();
          this.ClearForm();
        }
      });
  }

  GetPortMasterDetails(ID: number) {
    this._masterService.GetMasterDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.portForm.patchValue(res.Data);
        this.isUpdate = true;
      }
    });
  }

  UpdatePortMaster() {
    this.portForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    var status = this.portForm.get('STATUS')?.value;
    this.portForm.get('STATUS')?.setValue(status == 'true' ? true : false);

    this.portForm.get('KEY_NAME')?.setValue('PORT');

    this._masterService
      .UpdateMaster(JSON.stringify(this.portForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your  Port master has been Updated successfully !');
          this.GetPortMasterList();
          this.ClearForm();
          this.isUpdate = false;
        }
      });
  }

  // DeletePortMaster(ID: number) {
  //   debugger;
  //   if (confirm('Are you sure want to delete this record ?')) {
  //     this._masterService.DeleteMaster(ID).subscribe((res: any) => {
  //       if (res.ResponseCode == 200) {
  //         alert('Your record has been deleted successfully !');
  //         this.GetPortMasterList();
  //       }
  //     });
  //   }
  // }

  DeletePortMaster(ID: number) {
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
            this.GetPortMasterList();
          }
        });
      }
    });
  }
  

  openModal(ID: any = 0) {
    this.submitted = false;
    this.ClearForm();

    if (ID > 0) {
      this.GetPortMasterDetails(ID);
    }

    this.openModalPopup.nativeElement.click();
  }

  // ClearForm() {
  //   debugger
  //   this.portForm.reset();
  //   this.portForm.get('STATUS')?.setValue('');

  // }

  ClearForm() {
    this.portForm.reset();
    this.portForm.get('KEY_NAME')?.setValue('');
    this.portForm.get('CODE')?.setValue('');
    this.portForm.get('CODE_DESC')?.setValue('');
    this.portForm.get('STATUS')?.setValue('');
    this.portForm.get('ON_HIRE_DATE')?.setValue('');
    this.portForm.get('OFF_HIRE_DATE')?.setValue('');

  }

  Clear() {
    this.portForm1.get('KEY_NAME')?.setValue('');
    this.portForm1.get('CODE')?.setValue('');
    this.portForm1.get('CODE_DESC')?.setValue('');
    this.portForm1.get('STATUS')?.setValue('');
    this.portForm1.get('ON_HIRE_DATE')?.setValue('');
    this.portForm1.get('OFF_HIRE_DATE')?.setValue('');


    
    this.isLoading1 = true;
    this.GetPortMasterList();
  }

  Search() {} 

}
