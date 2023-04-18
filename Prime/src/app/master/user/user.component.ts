import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from 'src/app/models/user';
import { CommonService } from 'src/app/services/common.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  submitted: boolean = false;
  userForm: FormGroup;
  userList: any[] = [];
  isUpdate: boolean = false;
  user: User = new User();
  uForm: FormGroup;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  portList: any[] = [];
  dropdownSettings = {};
  selectedItems: any[] = [];
  isDEPO: boolean = false;
  orgList: any[] = [];
  depoList: any[] = [];

  @ViewChild('openModalPopup') openModalPopup: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;

  constructor(
    private _loginService: LoginService,
    private _commonService: CommonService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userForm = this._formBuilder.group({
      NAME: ['', Validators.required],
      USERNAME: ['', Validators.required],
      USERTYPE: ['', Validators.required],
      PASSWORD: ['', Validators.required],
      CONFIRMPASSWORD: ['', Validators.required],
      USERCODE: [
        '',
        [Validators.required, Validators.pattern('^([a-zA-Z0-9]+)$')],
      ],
      PORT_CODE: new FormControl(this.portList, Validators.required),
      PORT: [''],
      DEPO: ['', Validators.required],
      EMAIL: ['', [Validators.email, Validators.required]],
      LOCATION: [''],
      COUNTRYCODE: ['', Validators.required],
      USERADDRESS: [''],
      ROLE_ID: ['', Validators.required],
      ORG_CODE: [''],
      STATUS: ['', Validators.required],
      CREATED_BY: [''],
    });

    this.GetUserMasterList();

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

    this.getDropdowns();
  }

  get f() {
    return this.userForm.controls;
  }

  getDropdown(event: any, value: any = '') {
    this.portList = [];
    debugger;
    this.userForm.get('PORT_CODE').setValue('');
    this._commonService
      .getDropdownData('PORT', '', value == '' ? event.target.value : value)
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          debugger;
          this.portList = res.Data;

          if (value != '') {
            var x = this.userForm.get('PORT').value.split(',');
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

  getDropdowns() {
    this.orgList = [];
    this.depoList = [];
    this._commonService
      .getDropdownData('ORGANISATION')
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.orgList = res.Data;
        }
      });

    this._commonService.getDropdownData('DEPO').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.depoList = res.Data;
      }
    });
  }

  InsertUser() {
    this.submitted = true;

    if (this.userForm.invalid) {
      return;
    } else if (
      this.f.CONFIRMPASSWORD.value != null &&
      this.f.PASSWORD.value != this.f.CONFIRMPASSWORD.value
    ) {
      return;
    }
    var usercode = this.userForm.get('USERCODE').value;
    this._loginService.validateUsercode(usercode).subscribe((res: any) => {
      if (res.responseCode == 200) {
        const add = this.userForm.get('PORT_CODE') as FormArray;
        var port = '';
        add.value.forEach((element: any) => {
          port += element.CODE + ',';
        });
        this.userForm.get('PORT').setValue(port);
        this.userForm
          .get('CREATED_BY')
          .setValue(this._commonService.getUserCode());
        this._loginService
          .insertUser(JSON.stringify(this.userForm.value))
          .subscribe((res: any) => {
            if (res.responseCode == 200) {
              this._commonService.successMsg(
                'Your record has been inserted successfully !'
              );
              this.GetUserMasterList();
              this.closeBtn.nativeElement.click();
            }
          });
      } else {
        this._commonService.errorMsg(
          'Sorry ! This Usercode already exists, please enter a new code'
        );
        return;
      }
    });
  }

  GetUserMasterList() {
    this._commonService.destroyDT();

    this._loginService.getUserList().subscribe((res: any) => {
      this.isLoading = false;
      this.isLoading1 = false;
      if (res.ResponseCode == 200) {
        this.userList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  ClearForm() {
    this.userForm.reset();
    this.userForm.get('USERTYPE')?.setValue('');
    this.userForm.get('COUNTRYCODE')?.setValue('');
    this.userForm.get('ROLE_ID')?.setValue('');
    this.userForm.get('ORG_CODE')?.setValue('');
    this.userForm.get('DEPO')?.setValue('');
    this.userForm.get('PORT_CODE')?.setValue('');
    this.portList = [];
  }

  GetUserMasterDetails(USERCODE: string) {
    this._loginService.getUser(USERCODE).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.userForm.patchValue(res.Data);

        this.getDropdown('', res.Data.COUNTRYCODE);

        if (res.Data.USERTYPE == 'agent') {
          this.isDEPO = false;
          this.userForm.get('DEPO').disable();
        } else {
          this.isDEPO = true;
          this.userForm.get('DEPO').enable();
        }

        this.userForm.get('PASSWORD').disable();
        this.userForm.get('CONFIRMPASSWORD').disable();
      }
    });
  }

  updateUserMaster() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }

    const add = this.userForm.get('PORT_CODE') as FormArray;
    var port = '';
    add.value.forEach((element: any) => {
      port += element.CODE + ',';
    });
    this.userForm.get('PORT').setValue(port);

    this._loginService
      .updateUser(JSON.stringify(this.userForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been updated successfully !'
          );
          this.GetUserMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  deleteuserMaster(USERCODE: string) {
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
        this._loginService.deleteUser(USERCODE).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
            this.GetUserMasterList();
          }
        });
      }
    });
  }

  openModal(USERCODE: any = '') {
    this.submitted = false;
    this.isUpdate = false;
    this.ClearForm();

    this.userForm.get('PASSWORD').enable();
    this.userForm.get('CONFIRMPASSWORD').enable();

    this.isDEPO = false;
    this.userForm.get('DEPO').disable();

    if (USERCODE != '') {
      this.isUpdate = true;
      this.GetUserMasterDetails(USERCODE);
    }

    this.openModalPopup.nativeElement.click();
  }

  onchangeType(value: any) {
    this.userForm.get('DEPO').setValue('');
    if (value == 'depo') {
      this.isDEPO = true;
      this.userForm.get('DEPO').enable();
      this.userForm.get('ROLE_ID').setValue('3');
    } else if (value == 'agent' || value == 'admin') {
      if (value == 'agent') {
        this.userForm.get('ROLE_ID').setValue('1');
      }
      if (value == 'admin') {
        this.userForm.get('ROLE_ID').setValue('4');
      }
      this.isDEPO = false;
      this.userForm.get('DEPO').disable();
    }
  }

  onchangeDepo(event: any) {
    this.userForm.get('USERCODE').setValue(event.target.value);
  }
}
