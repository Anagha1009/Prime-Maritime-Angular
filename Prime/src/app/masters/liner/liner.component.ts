import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LINER } from 'src/app/models/liner';
import { CommonService } from 'src/app/services/common.service';
import { LinerService } from 'src/app/services/liner.service';

@Component({
  selector: 'app-liner',
  templateUrl: './liner.component.html',
  styleUrls: ['./liner.component.scss'],
})
export class LinerComponent implements OnInit {
  LinerForm: FormGroup;
  LinerForm1: FormGroup;
  LinerList: any[] = [];
  submitted: boolean;
  isUpdate: boolean = false;
  liner: LINER = new LINER();
  isLoading: boolean = false;
  isLoading1: boolean = false;

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _formBuilder: FormBuilder,
    private _linerService: LinerService,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.LinerForm = this._formBuilder.group({
      ID: [0],
      NAME: ['', Validators.required],
      CODE: ['', Validators.required],
      DESCRIPTION: ['', Validators.required],
      STATUS: ['', Validators.required],
      CREATED_BY: [''],
    });

    this.LinerForm1 = this._formBuilder.group({
      NAME: [''],
      CODE: [''],
      DESCRIPTION: [''],
      STATUS: [''],
    });

    this.GetLinerList();
  }

  GetLinerList() {
    this._commonService.destroyDT();
    this._linerService.getLinerList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.LinerList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  get f() {
    return this.LinerForm.controls;
  }

  Search() {}
  Clear() {}

  GetLinerDetails(ID: number) {
    this._linerService.GetLinerDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.LinerForm.patchValue(res.Data);
      }
    });
  }

  InsertLinerMaster() {
    this.submitted = true;
    if (this.LinerForm.invalid) {
      return;
    }

    this.LinerForm.get('CREATED_BY')?.setValue(
      localStorage.getItem('username')
    );

    this._linerService
      .postLiner(JSON.stringify(this.LinerForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your record has been submitted successfully !');
          this.GetLinerList();
          this.ClearForm();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  DeleteLinerList(ID: number) {
    if (confirm('Are you sure want to delete this record ?')) {
      this._linerService.deleteLiner(ID).subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          alert('Your record has been deleted successfully !');
          this.GetLinerList();
        }
      });
    }
  }

  UpdateLiner() {
    this.submitted = true;
    if (this.LinerForm.invalid) {
      return;
    }

    this.LinerForm.get('CREATED_BY')?.setValue(
      localStorage.getItem('username')
    );

    this._linerService
      .updateliner(JSON.stringify(this.LinerForm.value))
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          alert('Your party master has been Updated successfully !');
          this.GetLinerList();
          this.ClearForm();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  ClearForm() {
    this.LinerForm.reset();
    this.LinerForm.get('ID')?.setValue(0);
  }

  openModal(linerID: any = 0) {
    this.submitted = false;
    this.isUpdate = false;
    this.ClearForm();

    if (linerID > 0) {
      this.isUpdate = true;
      this.GetLinerDetails(linerID);
    }

    this.openModalPopup.nativeElement.click();
  }
}
