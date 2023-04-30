import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SlotOperator } from 'src/app/models/slot-operator';
import { CommonService } from 'src/app/services/common.service';
import { MasterService } from 'src/app/services/master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-slot-operator',
  templateUrl: './slot-operator.component.html',
  styleUrls: ['./slot-operator.component.scss'],
})
export class SlotOperatorComponent implements OnInit {
  slotForm: FormGroup;
  sForm: FormGroup;
  portList: any[] = [];
  portList1: any[] = [];
  slot: SlotOperator = new SlotOperator();
  submitted: boolean;
  isLoading: boolean = false;
  isUpdate: boolean;
  slotList: any[] = [];
  isLoading1: boolean = false;
  linerList: any[] = [];
  serviceList: any[] = [];
  serviceList1: any[] = [];
  dropdownSettings = {};
  selectedItems: any[] = [];
  selectedPortItems: any[] = [];

  @ViewChild('openModalPopup') openModalPopup: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;

  constructor(
    private _masterService: MasterService,
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
      searchPlaceholderText: 'Select',
      noDataAvailablePlaceholderText: 'No Records',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    this.slotForm = this._formBuilder.group({
      ID: [0],
      SLOT_OPERATOR: ['', Validators.required],
      SERVICES: [''],
      SERVICE: new FormControl(this.serviceList, Validators.required),
      LINER_CODE: ['', Validators.required],
      PORT_CODE: [''],
      PORT: new FormControl(this.portList, Validators.required),
      TERM: ['', Validators.required],
      STATUS: ['', Validators.required],
      CREATED_BY: [''],
    });

    this.sForm = this._formBuilder.group({
      SERVICE: [''],
      PORT: [''],
    });

    this.GetSlotMasterList();
    this.getDropdown();
    this.getPortDropdown();
  }

  get f() {
    return this.slotForm.controls;
  }

  getDropdown() {
    this._commonService.getDropdownData('PORT').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.portList1 = res.Data;
      }
    });

    this._commonService
      .getDropdownData('LINER_SERVICE', '', '')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.serviceList1 = res.Data;
        }
      });

    this._commonService.getDropdownData('LINER').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.linerList = res.Data;
      }
    });
  }

  getServiceDropdown(event: any, value: any = '') {
    this.serviceList = [];
    this.slotForm.get('SERVICE').setValue('');

    this._commonService
      .getDropdownData('LINER_SERVICE', '', value == '' ? event : value)
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.serviceList = res.Data;

          if (value != '') {
            var x = this.slotForm.get('SERVICES').value.split(',');
            var ss: any = [];
            x.forEach((element: any) => {
              if (element != '') {
                ss.push(this.serviceList.filter((x) => x.CODE === element)[0]);
              }
            });
            this.selectedItems = ss;
          }
        }
      });
  }

  getPortDropdown(value: any = '') {
    this.portList = [];
    this.slotForm.get('PORT').setValue('');

    this._commonService.getDropdownData('PORT').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.portList = res.Data;

        if (value != '') {
          var x = this.slotForm.get('PORT_CODE').value.split(',');
          var ss: any = [];
          x.forEach((element: any) => {
            if (element != '') {
              ss.push(this.portList.filter((x) => x.CODE === element)[0]);
            }
          });
          this.selectedPortItems = ss;
        }
      }
    });
  }

  InsertSlot() {
    this.submitted = true;

    if (this.slotForm.invalid) {
      return;
    }

    const add = this.slotForm.get('SERVICE') as FormArray;
    var service = '';
    add.value.forEach((element: any) => {
      service += element.CODE + ',';
    });
    this.slotForm.get('SERVICES').setValue(service);

    const add1 = this.slotForm.get('PORT') as FormArray;
    var port = '';
    add1.value.forEach((element: any) => {
      port += element.CODE + ',';
    });
    this.slotForm.get('PORT_CODE').setValue(port);

    this._masterService
      .insertSlot(JSON.stringify(this.slotForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been inserted successfully !'
          );
          this.GetSlotMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  GetSlotMasterList() {
    this._commonService.destroyDT();

    this._masterService.GetSlotMasterList(this.slot).subscribe((res: any) => {
      this.isLoading = false;
      this.isLoading1 = false;
      if (res.ResponseCode == 200) {
        this.slotList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  Search() {
    var SERVICE =
      this.sForm.value.SERVICE == null ? '' : this.sForm.value.SERVICE;
    var PORT = this.sForm.value.PORT == null ? '' : this.sForm.value.PORT;

    if (SERVICE == '' && PORT == '') {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.slot.SERVICE = SERVICE;
    this.slot.PORT = PORT;
    this.isLoading = true;
    this.GetSlotMasterList();
  }

  ClearForm() {
    this.slotForm.reset();
    this.slotForm.get('LINER_CODE')?.setValue('');
    this.slotForm.get('ID')?.setValue(0);
  }

  Clear() {
    this.sForm.get('PORT').setValue('');
    this.sForm.get('SERVICE').setValue('');
    this.slot = new SlotOperator();
    this.isLoading1 = true;
    this.GetSlotMasterList();
  }

  GetSlotMasterDetails(ID: number) {
    this._masterService.GetSlotMasterDetails(ID).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.slotForm.patchValue(res.Data);
        var liner = res.Data.LINER_CODE;
        this.getServiceDropdown('', liner);
        this.getPortDropdown('1');
      }
    });
  }

  updateSlotMaster() {
    this.submitted = true;
    if (this.slotForm.invalid) {
      return;
    }

    const add = this.slotForm.get('SERVICE') as FormArray;
    var service = '';
    add.value.forEach((element: any) => {
      service += element.CODE + ',';
    });
    this.slotForm.get('SERVICES').setValue(service);

    const add1 = this.slotForm.get('PORT') as FormArray;
    var port = '';
    add1.value.forEach((element: any) => {
      port += element.CODE + ',';
    });
    this.slotForm.get('PORT_CODE').setValue(port);

    this._masterService
      .UpdateSlotMasterList(JSON.stringify(this.slotForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'Your record has been updated successfully !'
          );
          this.GetSlotMasterList();
          this.closeBtn.nativeElement.click();
        }
      });
  }

  deleteSlotMaster(ID: number) {
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
        this._masterService.DeleteSlotMasterList(ID).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
            this.GetSlotMasterList();
          }
        });
      }
    });
  }

  openModal(ID: any = 0) {
    this.submitted = false;
    this.isUpdate = false;
    this.ClearForm();

    if (ID > 0) {
      this.isUpdate = true;
      this.GetSlotMasterDetails(ID);
    }

    this.openModalPopup.nativeElement.click();
  }
}
