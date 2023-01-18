import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CONTAINER } from 'src/app/models/container';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-container-size',
  templateUrl: './container-size.component.html',
  styleUrls: ['./container-size.component.scss'],
})
export class ContainerSizeComponent implements OnInit {
  submitted: boolean = false;
  sizeForm: FormGroup;
  sizeForm1: FormGroup;
  SizeList: any[] = [];
  isUpdate: boolean = false;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  contsize: CONTAINER = new CONTAINER();

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _masterService: MasterService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.sizeForm = this._formBuilder.group({
      ID: [0],
      KEY_NAME: ['CONTAINER_SIZE'],
      CODE: ['', Validators.required],
      CODE_DESC: ['', Validators.required],
      STATUS: ['', Validators.required],
      CREATED_BY: [''],
    });

    this.sizeForm1 = this._formBuilder.group({
      KEY_NAME: [''],
      CODE: [''],
      CODE_DESC: [''],
      STATUS: [''],
      CREATED_BY: [''],
    });

    this.GetContainerSizeList();
  }

  get f() {
    return this.sizeForm.controls;
  }

  Search() {}

  Clear() {}

  InsertContainerSize() {
    this.submitted = true;
    if (this.sizeForm.invalid) {
      return;
    }

    this.sizeForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    this._masterService
      .InsertMaster(JSON.stringify(this.sizeForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your record has been submitted successfully !');
          this.GetContainerSizeList();
          this.ClearForm();
          this.submitted = false;
          this.closeBtn.nativeElement.click();
        }
      });
  }

  GetContainerSizeList() {
    this._commonService.destroyDT();
    this._masterService
      .GetMasterList('CONTAINER_SIZE')
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.SizeList = res.Data;
        }
        this._commonService.getDT();
      });
  }

  GetContainerSizeDetails(ID: number) {
    this._masterService.GetMasterDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.sizeForm.patchValue(res.Data);
        this.isUpdate = true;
      }
    });
  }

  UpdateContainerSize() {
    this.submitted = true;
    if (this.sizeForm.invalid) {
      return;
    }

    this.sizeForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    this._masterService
      .UpdateMaster(JSON.stringify(this.sizeForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your party master has been Updated successfully !');
          this.GetContainerSizeList();
          this.ClearForm();
          this.isUpdate = false;
          this.submitted = false;
          this.closeBtn.nativeElement.click();
        }
      });
  }

  ClearForm() {
    this.sizeForm.get('STATUS')?.setValue('');
    this.sizeForm.get('CODE')?.setValue('');
    this.sizeForm.get('CODE_DESC')?.setValue('');
  }

  DeleteContainerSize(ID: number) {
    if (confirm('Are you sure want to delete this record ?')) {
      this._masterService.DeleteMaster(ID).subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          alert('Your record has been deleted successfully !');
          this.GetContainerSizeList();
        }
      });
    }
  }

  openModal(sizeID: any = 0) {
    this.submitted = false;
    this.ClearForm();

    if (sizeID > 0) {
      this.GetContainerSizeDetails(sizeID);
    }

    this.openModalPopup.nativeElement.click();
  }
}
