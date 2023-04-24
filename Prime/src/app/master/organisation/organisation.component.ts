import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.scss'],
})
export class OrganisationComponent implements OnInit {
  orgList: any[] = [];
  orgForm: FormGroup;
  submitted: boolean = false;
  isUpdate: boolean = false;

  @ViewChild('openModalPopup') openModalPopup: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;

  constructor(
    private _commonService: CommonService,
    private _formBuilder: FormBuilder,
    private _masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.orgForm = this._formBuilder.group({
      ORG_NAME: ['', Validators.required],
      ORG_CODE: [
        '',
        [Validators.required, Validators.pattern('^([a-zA-Z0-9]+)$')],
      ],
      CREATED_BY: [''],
    });

    this.GetOrgMasterList();
  }

  get f() {
    return this.orgForm.controls;
  }

  InsertOrganisation() {
    this.submitted = true;

    if (this.orgForm.invalid) {
      return;
    }

    this.orgForm.get('CREATED_BY').setValue(this._commonService.getUserCode());

    this._masterService
      .ValidateOrgCode(this.orgForm.get('ORG_CODE')?.value)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this._masterService
            .insertOrg(JSON.stringify(this.orgForm.value))
            .subscribe((res: any) => {
              if (res.responseCode == 200) {
                this._commonService.successMsg(
                  'Your record has been inserted successfully !'
                );
                this.GetOrgMasterList();
                this.closeBtn.nativeElement.click();
              }
            });
        } else {
          this._commonService.warnMsg(
            'This Organisation Code Already Exists !'
          );
        }
      });
  }

  GetOrgMasterList() {
    this._commonService.destroyDT();

    this._masterService.GetOrgMasterList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.orgList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  ClearForm() {
    this.orgForm.reset();
  }

  GetOrgMasterDetails(ORG_CODE: string) {
    this._masterService.GetOrgMasterDetails(ORG_CODE).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.orgForm.patchValue(res.Data);
      }
    });
  }

  updateOrgMaster() {
    this.submitted = true;
    if (this.orgForm.invalid) {
      return;
    }

    this._masterService
      .UpdateOrgMasterList(JSON.stringify(this.orgForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been updated successfully !'
          );
          this.GetOrgMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  deleteOrgMaster(ORG_CODE: string) {
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
        this._masterService
          .DeleteOrgMasterList(ORG_CODE)
          .subscribe((res: any) => {
            if (res.ResponseCode == 200) {
              Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
              this.GetOrgMasterList();
            }
          });
      }
    });
  }

  openModal(CODE: any = '') {
    this.submitted = false;
    this.isUpdate = false;
    this.ClearForm();

    if (CODE != '') {
      this.isUpdate = true;
      this.GetOrgMasterDetails(CODE);
    }

    this.openModalPopup.nativeElement.click();
  }
}
