import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detention',
  templateUrl: './detention.component.html',
  styleUrls: ['./detention.component.scss'],
})
export class DetentionComponent implements OnInit {
  submitted: boolean = false;
  detentionForm: FormGroup;
  detentionList: any[] = [];
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
    this.detentionForm = this._formBuilder.group({
      ID: [0],
      PORT_CODE: ['', Validators.required],
      CONTAINER_TYPE: ['', Validators.required],
      CURRENCY: ['', Validators.required],
      FROM_DAYS: [0, Validators.required],
      TO_DAYS: [0, Validators.required],
      RATE20: [0, Validators.required],
      RATE40: [0, Validators.required],
      HC_RATE: [0, Validators.required],
    });

    this.GetDetentionMasterList();
    this.getDropdown();
  }

  get f() {
    return this.detentionForm.controls;
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

  GetDetentionMasterList() {
    this._commonService.destroyDT();
    this._masterService.getDetentionList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.detentionList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  DeleteDetentionMaster(ID: number) {
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
        this._masterService.deleteDetention(ID).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
            this.GetDetentionMasterList();
          }
        });
      }
    });
  }

  GetDetentionMasterDetails(ID: number) {
    this.submitted = false;
    this._masterService.getDetentionDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.detentionForm.patchValue(res.Data);
      }
    });
    this.openModalPopup.nativeElement.click();
  }

  UpdateDetentionMaster() {
    this.submitted = true;
    if (this.detentionForm.invalid) {
      return;
    }

    this._masterService
      .updateDetention(JSON.stringify(this.detentionForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been updated successfully !'
          );
          this.GetDetentionMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  ClearForm() {
    this.detentionForm.reset();
    this.detentionForm.get('ID').setValue(0);
    this.detentionForm.get('PORT_CODE').setValue('');
    this.detentionForm.get('CURRENCY').setValue('');
  }
}
