import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Bl } from 'src/app/models/bl';
import { CRO } from 'src/app/models/cro';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';
import { CroService } from 'src/app/services/cro.service';
import { DepoService } from 'src/app/services/depo.service';

@Component({
  selector: 'app-container-allotment',
  templateUrl: './container-allotment.component.html',
  styleUrls: ['./container-allotment.component.scss'],
})
export class ContainerAllotmentComponent implements OnInit {
  croNo: string = '';
  containerForm: FormGroup;
  filterForm: FormGroup;
  containerDropdownList: any[] = [];
  dropdownSettings = {};
  croDetails: any;
  containerAllotmentList: any[] = [];
  currentDate: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private _croService: CroService,
    private _depoService: DepoService,
    private _blService: BlService,
    private _commonService: CommonService
  ) {}

  @ViewChild('openModal2') openModal2: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeBtn1') closeBtn1: ElementRef;

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'ID',
      textField: 'CONTAINER_NO',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 170,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Select Container',
      noDataAvailablePlaceholderText: 'No Container Present',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    this.containerForm = this._formBuilder.group({
      BOOKING_NO: [''],
      CRO_NO: [''],
      DEPO_CODE: [''],
      CREATED_BY: [''],
      CONTAINER_LIST1: new FormControl(
        this.containerDropdownList,
        Validators.required
      ),
      CONTAINER_LIST: new FormArray([]),
    });

    this.filterForm = this._formBuilder.group({
      CONTAINER_NO: [''],
      CUSTOMER_NAME: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
      STATUS: [''],
    });

    this.getAvailableContainerList();
    this.getContainerAllotedList();
    this.currentDate = this._commonService.getcurrentDate(new Date());
  }

  get f() {
    return this.containerForm.controls;
  }

  get f1() {
    const add = this.containerForm.get('CONTAINER_LIST') as FormArray;
    return add.controls;
  }

  getAvailableContainerList() {
    this._depoService
      .getAvailableContainerListForDepo(this._commonService.getUserCode())
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.containerDropdownList = res.Data;
        }
      });
  }

  saveContainer(event: any, value = 0) {
    var containerList = this.containerForm.get('CONTAINER_LIST1')?.value;
    const add = this.containerForm.get('CONTAINER_LIST') as FormArray;

    if (value == 1) {
      add.clear();
      event.forEach((element: any) => {
        add.push(
          this._formBuilder.group({
            CONTAINER_NO: [element.CONTAINER_NO],
            TO_LOCATION: [''],
            MOVEMENT_DATE: [''],
          })
        );
      });
    } else if (value == 2) {
      add.clear();
    } else {
      var i = containerList.findIndex((x: any) => x.ID === event.ID);
      if (i == -1) {
        add.removeAt(
          add.value.findIndex(
            (m: { CONTAINER_NO: any }) => m.CONTAINER_NO === event.CONTAINER_NO
          )
        );
      } else {
        add.push(
          this._formBuilder.group({
            CONTAINER_NO: [event.CONTAINER_NO],
            TO_LOCATION: [''],
            MOVEMENT_DATE: [''],
          })
        );
      }
    }
  }

  copyValue(value: any) {
    if (value == 'location') {
      var location = this.f1[0].value.TO_LOCATION;
      this.containerForm.value.CONTAINER_LIST.forEach(
        (element: { TO_LOCATION: any }) => {
          element.TO_LOCATION = location;
        }
      );
    }

    if (value == 'date') {
      var date = this.f1[0].value.MOVEMENT_DATE;
      this.containerForm.value.CONTAINER_LIST.forEach(
        (element: { MOVEMENT_DATE: any }) => {
          element.MOVEMENT_DATE = date;
        }
      );
    }

    this.containerForm
      .get('CONTAINER_LIST')
      ?.setValue(this.containerForm.value.CONTAINER_LIST);
  }

  insertContainer() {
    this.containerForm
      .get('CREATED_BY')
      ?.setValue(this._commonService.getUserName());
    this.containerForm
      .get('DEPO_CODE')
      ?.setValue(this._commonService.getUserCode());
    this.containerForm.get('BOOKING_NO')?.setValue(this.croDetails?.BOOKING_NO);

    this._depoService
      .createContainer(JSON.stringify(this.containerForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg('Container is alloted successfully');
          this.closeBtn1.nativeElement.click();
          this.getContainerAllotedList();
        }
      });
  }

  getDetails() {
    var cro = new CRO();
    cro.CRO_NO = this.croNo;
    this.containerForm.get('CRO_NO')?.setValue(this.croNo);
    this._croService.getCRODetails(cro).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.croDetails = res.Data;
        this.openModal2.nativeElement.click();
      }
    });
  }

  getContainerAllotedList() {
    var bl = new Bl();
    bl.AGENT_CODE = '';
    bl.DEPO_CODE = this._commonService.getUserCode();
    this._commonService.destroyDT();
    this.containerAllotmentList = [];
    this._blService.getContainerList(bl).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        if (res.Data.length > 0) {
          this.containerAllotmentList = res.Data;
        }
        this._commonService.getDT();
      }
    });
  }
}
