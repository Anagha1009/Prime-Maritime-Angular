import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Location } from 'src/app/models/location';
import { CommonService } from 'src/app/services/common.service';
import { LocationService } from 'src/app/services/location.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit {
  submitted: boolean = false;
  locationForm: FormGroup;
  locationList: any[] = [];
  isUpdate: boolean = false;
  location: Location = new Location();
  locForm: FormGroup;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  portList: any[] = [];
  dropdownSettings = {};
  selectedItems: any[] = [];

  @ViewChild('openModalPopup') openModalPopup: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;

  constructor(
    private _locationService: LocationService,
    private _commonService: CommonService,
    private _formBuilder: FormBuilder
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
      searchPlaceholderText: 'Select Port',
      noDataAvailablePlaceholderText: 'No Records',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    this.locationForm = this._formBuilder.group({
      ID: [0],
      LOC_NAME: ['', Validators.required],
      LOC_CODE: ['', Validators.required],
      IS_DEPO: [false],
      IS_CFS: [false],
      IS_TERMINAL: [false],
      IS_YARD: [false],
      IS_ICD: [false],
      ADDRESS: ['', Validators.required],
      COUNTRY_CODE: ['', Validators.required],
      PORT: new FormControl(this.portList, Validators.required),
      PORT_CODE: [''],
      STATUS: ['', Validators.required],
      CREATED_BY: [''],
    });

    this.locForm = this._formBuilder.group({
      LOC_NAME: [''],
      LOC_TYPE: [''],
      STATUS: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.GetLocationMasterList();
  }

  get f() {
    return this.locationForm.controls;
  }

  getDropdown(event: any, value: any = '') {
    this.portList = [];
    this.locationForm.get('PORT').setValue('');
    this._commonService
      .getDropdownData('PORT', '', value == '' ? event.target.value : value)
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.portList = res.Data;

          if (value != '') {
            var x = this.locationForm.get('PORT_CODE').value.split(',');
            var ss: any = [];
            x.forEach((element: any) => {
              if (element != '') {
                ss.push(this.portList.filter((x) => x.CODE === element)[0]);
              }
            });
            this.selectedItems = ss;
          }
        }
      });
  }

  InsertLocation() {
    this.submitted = true;

    if (this.locationForm.invalid) {
      return;
    } else if (
      !this.f.IS_DEPO.value &&
      !this.f.IS_CFS.value &&
      !this.f.IS_TERMINAL.value &&
      !this.f.IS_YARD.value &&
      !this.f.IS_ICD.value
    ) {
      return;
    }

    const add = this.locationForm.get('PORT') as FormArray;
    var port = '';
    add.value.forEach((element: any) => {
      port += element.CODE + ',';
    });
    this.locationForm.get('PORT_CODE').setValue(port);
    this.locationForm
      .get('CREATED_BY')
      .setValue(this._commonService.getUserCode());

    this._locationService
      .postLocation(JSON.stringify(this.locationForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been inserted successfully !'
          );
          this.GetLocationMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  GetLocationMasterList() {
    this._commonService.destroyDT();

    this._locationService
      .GetLocationMasterList(this.location)
      .subscribe((res: any) => {
        this.isLoading = false;
        this.isLoading1 = false;
        if (res.ResponseCode == 200) {
          this.locationList = res.Data;
        }
        this._commonService.getDT();
      });
  }

  Search() {
    var LOC_NAME =
      this.locForm.value.LOC_NAME == null ? '' : this.locForm.value.LOC_NAME;
    var LOC_TYPE =
      this.locForm.value.LOC_TYPE == null ? '' : this.locForm.value.LOC_TYPE;
    var STATUS =
      this.locForm.value.STATUS == null ? '' : this.locForm.value.STATUS;

    var FROM_DATE =
      this.locForm.value.FROM_DATE == null ? '' : this.locForm.value.FROM_DATE;
    var TO_DATE =
      this.locForm.value.TO_DATE == null ? '' : this.locForm.value.TO_DATE;

    if (
      LOC_NAME == '' &&
      LOC_TYPE == '' &&
      STATUS == '' &&
      FROM_DATE == '' &&
      TO_DATE == ''
    ) {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.location.LOC_NAME = LOC_NAME;
    this.location.LOC_TYPE = LOC_TYPE;
    this.location.STATUS = STATUS;
    this.location.FROM_DATE = FROM_DATE;
    this.location.TO_DATE = TO_DATE;
    this.isLoading = true;
    this.GetLocationMasterList();
  }

  ClearForm() {
    this.locationForm.reset();
    this.locationForm.get('ID')?.setValue(0);
    this.locationForm.get('COUNTRY_CODE')?.setValue('');
    this.locationForm.get('IS_DEPO')?.setValue(false);
    this.locationForm.get('IS_CFS')?.setValue(false);
    this.locationForm.get('IS_TERMINAL')?.setValue(false);
    this.locationForm.get('IS_YARD')?.setValue(false);
    this.locationForm.get('IS_ICD')?.setValue(false);
  }

  Clear() {
    this.locForm.reset();
    this.locForm.get('LOC_TYPE')?.setValue('');
    this.locForm.get('STATUS')?.setValue('');
    this.location = new Location();
    this.isLoading1 = true;
    this.GetLocationMasterList();
  }

  GetLocationMasterDetails(LOC_CODE: string) {
    this._locationService
      .GetLocationMasterDetails(LOC_CODE)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.locationForm.patchValue(res.Data);
          var country = this.locationForm.get('COUNTRY_CODE').value;
          this.getDropdown('', country);
        }
      });
  }

  updateLocationMaster() {
    this.submitted = true;
    if (this.locationForm.invalid) {
      return;
    } else if (
      !this.f.IS_DEPO.value &&
      !this.f.IS_CFS.value &&
      !this.f.IS_TERMINAL.value &&
      !this.f.IS_YARD.value &&
      !this.f.IS_ICD.value
    ) {
      return;
    }

    const add = this.locationForm.get('PORT') as FormArray;
    var port = '';
    add.value.forEach((element: any) => {
      port += element.CODE + ',';
    });
    this.locationForm.get('PORT_CODE').setValue(port);

    this._locationService
      .updateLocationMaster(JSON.stringify(this.locationForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been updated successfully !'
          );
          this.GetLocationMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  deleteLocationMaster(LOC_CODE: string) {
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
        this._locationService
          .deletelocationMaster(LOC_CODE)
          .subscribe((res: any) => {
            if (res.ResponseCode == 200) {
              Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
              this.GetLocationMasterList();
            }
          });
      }
    });
  }

  openModal(LOC_CODE: any = '') {
    this.submitted = false;
    this.isUpdate = false;
    this.ClearForm();

    if (LOC_CODE != '') {
      this.isUpdate = true;
      this.GetLocationMasterDetails(LOC_CODE);
    }

    this.openModalPopup.nativeElement.click();
  }
}
