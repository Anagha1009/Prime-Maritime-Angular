import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PARTY } from 'src/app/models/party';
import { CommonService } from 'src/app/services/common.service';
import { PartyService } from 'src/app/services/party.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.scss'],
})
export class PartyComponent implements OnInit {
  submitted: boolean = false;
  partyForm: FormGroup;
  partyList: any[] = [];
  isUpdate: boolean = false;
  custForm: FormGroup;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  customer: PARTY = new PARTY();
  isGST: boolean = false;
  custTypeList: any[] = [];
  dropdownSettings = {};
  selectedItems: any[] = [];

  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openModalPopup') openModalPopup: ElementRef;

  constructor(
    private _partyService: PartyService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService
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
      searchPlaceholderText: 'Select Type',
      noDataAvailablePlaceholderText: 'No Records',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    this.partyForm = this._formBuilder.group({
      CUST_ID: [0],
      CUST_NAME: ['', Validators.required],
      CUST_EMAIL: ['', [Validators.email]],
      CUST_ADDRESS: ['', Validators.required],
      CUST_TYPE: [''],
      CUST_TYPE_CODE: new FormControl(this.custTypeList, Validators.required),
      GSTIN: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
          ),
        ],
      ],
      STATUS: ['', Validators.required],
      CUST_CONTACT: [''],
      VAT_NO: ['', Validators.required],
    });

    if (this._commonService.getUser()?.countrycode == 'IN') {
      this.partyForm.get('GSTIN').enable();
      this.partyForm.get('VAT_NO').disable();
      this.isGST = true;
    } else {
      this.partyForm.get('GSTIN').disable();
      this.partyForm.get('VAT_NO').enable();
      this.isGST = false;
    }

    this.custForm = this._formBuilder.group({
      CUST_NAME: [''],
      CUST_TYPE: [''],
      STATUS: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.GetPartyMasterList();
    this.getDropdown();
  }

  get f() {
    return this.partyForm.controls;
  }

  Search() {
    var CUST_NAME =
      this.custForm.value.CUST_NAME == null
        ? ''
        : this.custForm.value.CUST_NAME;
    var CUST_TYPE =
      this.custForm.value.CUST_TYPE == null
        ? ''
        : this.custForm.value.CUST_TYPE;
    var STATUS =
      this.custForm.value.STATUS == null ? '' : this.custForm.value.STATUS;
    var FROM_DATE =
      this.custForm.value.FROM_DATE == null
        ? ''
        : this.custForm.value.FROM_DATE;
    var TO_DATE =
      this.custForm.value.TO_DATE == null ? '' : this.custForm.value.TO_DATE;

    if (
      CUST_NAME == '' &&
      CUST_TYPE == '' &&
      STATUS == '' &&
      FROM_DATE == '' &&
      TO_DATE == ''
    ) {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.customer.CUST_NAME = CUST_NAME;
    this.customer.CUST_TYPE = CUST_TYPE;
    this.customer.STATUS = STATUS;
    this.customer.FROM_DATE = FROM_DATE;
    this.customer.TO_DATE = TO_DATE;
    this.isLoading = true;
    this.GetPartyMasterList();
  }

  Clear() {
    this.custForm.reset();
    this.custForm.get('STATUS')?.setValue('');
    this.customer = new PARTY();
    this.isLoading1 = true;
    this.GetPartyMasterList();
  }

  GetPartyMasterList() {
    this.customer.AGENT_CODE = '';
    this._commonService.destroyDT();
    this._partyService.getPartyList(this.customer).subscribe((res: any) => {
      this.isLoading = false;
      this.isLoading1 = false;
      if (res.ResponseCode == 200) {
        this.partyList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  InsertPartyMaster() {
    this.submitted = true;
    if (this.partyForm.invalid) {
      return;
    }

    this.partyForm
      .get('CREATED_BY')
      ?.setValue(this._commonService.getUserName());

    const add = this.partyForm.get('CUST_TYPE_CODE') as FormArray;
    var custType = '';
    add.value.forEach((element: any) => {
      custType += element.CODE + ',';
    });
    this.partyForm.get('CUST_TYPE').setValue(custType);
    this._partyService
      .postParty(JSON.stringify(this.partyForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been inserted successfully !'
          );
          this.GetPartyMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  DeletePartyMaster(partyID: number) {
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
        this._partyService.deleteParty(partyID).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
            this.GetPartyMasterList();
          }
        });
      }
    });
  }

  GetPartyMasterDetails(partyID: number) {
    var partyModel = new PARTY();
    partyModel.AGENT_CODE = '';
    partyModel.CUST_ID = partyID;

    this._partyService.getPartyDetails(partyModel).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.partyForm.patchValue(res.Data);
        this.getDropdown('1');
      }
    });
  }

  UpdatePartyMaster() {
    this.submitted = true;
    if (this.partyForm.invalid) {
      return;
    }

    const add = this.partyForm.get('CUST_TYPE_CODE') as FormArray;
    var custType = '';
    add.value.forEach((element: any) => {
      custType += element.CODE + ',';
    });
    this.partyForm.get('CUST_TYPE').setValue(custType);

    this._partyService
      .updateParty(JSON.stringify(this.partyForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been updated successfully !'
          );
          this.GetPartyMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  ClearForm() {
    this.partyForm.reset();
    this.partyForm.get('CUST_TYPE')?.setValue('');
    this.partyForm.get('CUST_ID')?.setValue(0);
  }

  openModal(custID: any = 0) {
    this.submitted = false;
    this.isUpdate = false;
    this.ClearForm();

    if (custID > 0) {
      this.isUpdate = true;
      this.GetPartyMasterDetails(custID);
    }

    this.openModalPopup.nativeElement.click();
  }

  onlyNumeric(event: any) {
    this._commonService.numericOnly(event);
  }

  getDropdown(value: any = '') {
    this.custTypeList = [];
    this.partyForm.get('CUST_TYPE_CODE').setValue('');
    this._commonService
      .getDropdownData('CUST_TYPE', '', '')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.custTypeList = res.Data;

          if (value != '') {
            var x = this.partyForm.get('CUST_TYPE').value.split(',');
            var ss: any = [];
            x.forEach((element: any) => {
              if (element != '') {
                ss.push(this.custTypeList.filter((x) => x.CODE === element)[0]);
              }
            });
            this.selectedItems = ss;
          }
        }
      });
  }
}
