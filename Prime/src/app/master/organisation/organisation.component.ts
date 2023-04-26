import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  locationList: any[] = [];
  dropdownSettings = {};
  selectedItems: any[] = [];

  @ViewChild('openModalPopup') openModalPopup: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;

  constructor(
    private _commonService: CommonService,
    private _formBuilder: FormBuilder,
    private _masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'CODE',
      textField: 'CODE_DESC',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 170,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Select Location',
      noDataAvailablePlaceholderText: 'No Records',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    this.orgForm = this._formBuilder.group({
      ORG_NAME: ['', Validators.required],
      ORG_CODE: [
        '',
        [Validators.required, Validators.pattern('^([a-zA-Z0-9]+)$')],
      ],
      ORG_LOCATION: ['', Validators.required],
      ORG_LOC: new FormControl(this.locationList, Validators.required),
      ORG_LOC_CODE: [''],
      ORG_ADDRESS1: ['', Validators.required],
      EMAIL: [''],
      CONTACT: [''],
      FAX: [''],
      COUNTRY_CODE: [''],
      CREATED_BY: [''],
    });

    this.GetOrgMasterList();
    this.getDropdown();
  }

  get f() {
    return this.orgForm.controls;
  }

  getDropdown(value: any = '') {
    this.locationList = [];
    this.orgForm.get('ORG_LOC').setValue('');
    this._commonService
      .getDropdownData('ALLLOCATION', '', '')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.locationList = res.Data;

          if (value != '') {
            var x = this.orgForm.get('ORG_LOC_CODE').value.split(',');
            var ss: any = [];
            x.forEach((element: any) => {
              if (element != '') {
                ss.push(this.locationList.filter((x) => x.CODE === element)[0]);
              }
            });
            this.selectedItems = ss;
          }
        }
      });
  }

  InsertOrganisation() {
    this.submitted = true;

    if (this.orgForm.invalid) {
      return;
    }

    this.orgForm.get('CREATED_BY').setValue(this._commonService.getUserCode());

    const add = this.orgForm.get('ORG_LOC') as FormArray;
    var loc = '';
    add.value.forEach((element: any) => {
      loc += element.CODE + ',';
    });
    this.orgForm.get('ORG_LOC_CODE').setValue(loc);
    console.log(JSON.stringify(this.orgForm.value));
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
    this.orgForm.get('EMAIL').setValue('');
    this.orgForm.get('CONTACT').setValue('');
    this.orgForm.get('FAX').setValue('');
  }

  GetOrgMasterDetails(ORG_CODE: string) {
    this._masterService.GetOrgMasterDetails(ORG_CODE).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.orgForm.patchValue(res.Data);
        this.getDropdown('1');
      }
    });
  }

  updateOrgMaster() {
    this.submitted = true;
    if (this.orgForm.invalid) {
      return;
    }

    const add = this.orgForm.get('ORG_LOC') as FormArray;
    var loc = '';
    add.value.forEach((element: any) => {
      loc += element.CODE + ',';
    });
    this.orgForm.get('ORG_LOC_CODE').setValue(loc);

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

  deleteOrgMaster(ORG_CODE: string, ORG_LOC_CODE: string) {
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
          .DeleteOrgMasterList(ORG_CODE, ORG_LOC_CODE)
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
