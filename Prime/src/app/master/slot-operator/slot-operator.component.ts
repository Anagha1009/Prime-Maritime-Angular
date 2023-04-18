import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SlotOperator } from 'src/app/models/slot-operator';
import { CommonService } from 'src/app/services/common.service';
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
  slot: SlotOperator = new SlotOperator();
  submitted: boolean;
  isLoading: boolean = false;
  isUpdate: boolean;
  slotList: any[] = [];
  isLoading1: boolean = false;

  @ViewChild('openModalPopup') openModalPopup: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;

  constructor(
    //private _slotService: ContainerService,
    private _commonService: CommonService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.slotForm = this._formBuilder.group({
      ID: [0],
      CONTAINER_NO: ['', Validators.required],
      CONTAINER_TYPE: ['', Validators.required],
      ONHIRE_DATE: ['', Validators.required],
      ONHIRE_LOCATION: ['', Validators.required],
      LEASED_FROM: ['', Validators.required],
      STATUS: ['', Validators.required],
    });

    this.sForm = this._formBuilder.group({
      STATUS: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.GetSlotMasterList();
    this.getDropdown();
  }

  get f() {
    return this.slotForm.controls;
  }

  getDropdown() {
    this._commonService.getDropdownData('PORT').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.portList = res.Data;
      }
    });
  }

  InsertSlot() {
    this.submitted = true;

    if (this.slotForm.invalid) {
      return;
    }

    // this._containerService
    //   .postContainer(JSON.stringify(this.containerForm.value))
    //   .subscribe((res: any) => {
    //     if (res.responseCode == 200) {
    //       this._commonService.successMsg(
    //         'Your record has been inserted successfully !'
    //       );
    //       this.GetContainerMasterList();
    //       this.closeBtn.nativeElement.click();
    //     }
    //   });
  }

  GetSlotMasterList() {
    this._commonService.destroyDT();

    // this._containerService
    //   .GetContainerMasterList(this.container)
    //   .subscribe((res: any) => {
    //     this.isLoading = false;
    //     this.isLoading1 = false;
    //     if (res.ResponseCode == 200) {
    //       this.containerList = res.Data;
    //     }
    //     this._commonService.getDT();
    //   });
  }

  Search() {
    var FROM_DATE =
      this.sForm.value.FROM_DATE == null ? '' : this.sForm.value.FROM_DATE;
    var TO_DATE =
      this.sForm.value.TO_DATE == null ? '' : this.sForm.value.TO_DATE;
    var STATUS = this.sForm.value.STATUS == null ? '' : this.sForm.value.STATUS;

    if (FROM_DATE == '' && TO_DATE == '' && STATUS == '') {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.slot.FROM_DATE = FROM_DATE;
    this.slot.TO_DATE = TO_DATE;
    this.slot.STATUS = STATUS;
    this.isLoading = true;
    this.GetSlotMasterList();
  }

  ClearForm() {
    this.slotForm.reset();
    this.slotForm.get('PORT')?.setValue('');
  }

  Clear() {
    this.sForm.reset();
    this.slot = new SlotOperator();
    this.isLoading1 = true;
    this.GetSlotMasterList();
  }

  GetSlotMasterDetails(ID: number) {
    // this._containerService
    //   .GetContainerMasterDetails(containerModel)
    //   .subscribe((res: any) => {
    //     if (res.ResponseCode == 200) {
    //       this.containerForm.patchValue(res.Data);
    //       this.containerForm
    //         .get('ONHIRE_DATE')
    //         ?.setValue(formatDate(res.Data.ONHIRE_DATE, 'yyyy-MM-dd', 'en'));
    //     }
    //   });
  }

  updateSlotMaster() {
    this.submitted = true;
    if (this.slotForm.invalid) {
      return;
    }

    // this._containerService
    //   .updateContainerMaster(JSON.stringify(this.containerForm.value))
    //   .subscribe((res: any) => {
    //     if (res.responseCode == 200) {
    //       this._commonService.successMsg(
    //         'Your record has been updated successfully !'
    //       );
    //       this.GetContainerMasterList();
    //       this.closeBtn.nativeElement.click();
    //     }
    //   });
  }

  deleteSlotMaster(containerId: number) {
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
        // this._containerService
        //   .deleteContainerMaster(containerId)
        //   .subscribe((res: any) => {
        //     if (res.ResponseCode == 200) {
        //       Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
        //       this.GetContainerMasterList();
        //     }
        //   });
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
