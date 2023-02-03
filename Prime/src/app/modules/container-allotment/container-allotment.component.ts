import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CRO } from 'src/app/models/cro';
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
  containerDropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings = {};
  containerList: any[] = [];
  isCRO: boolean = false;
  bookingNo: any;
  isrecord: boolean = true;
  croDetails: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _croService: CroService,
    private _depoService: DepoService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    // this.containerDropdownList = [
    //   { item_id: 1, item_text: 'SIKU3034664' },
    //   { item_id: 2, item_text: 'TLLU8316901' },
    //   { item_id: 3, item_text: 'TCKU2125749' },
    //   { item_id: 4, item_text: 'SEGU1759710' },
    //   { item_id: 5, item_text: 'SEGU1900639' },
    //   { item_id: 6, item_text: 'TCLU3387545' },
    //   { item_id: 7, item_text: 'SIKU2952032' },
    //   { item_id: 8, item_text: 'SEGU1561659' },
    //   { item_id: 9, item_text: 'SEGU1706269' },
    //   { item_id: 10, item_text: 'VSBU2058560' },
    //   { item_id: 11, item_text: 'GESU1163666' },
    //   { item_id: 12, item_text: 'SEGU1552683' },
    //   { item_id: 13, item_text: 'SIKU3060792' },
    //   { item_id: 14, item_text: 'SIKU3040374' },
    //   { item_id: 15, item_text: 'TLLU8398406' },
    // ];

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
      maxHeight: 197,
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
      TO_LOCATION: [''],
      MOVEMENT_DATE: [''],
      DEPO_CODE: [''],
      CREATED_BY: [''],
      CONTAINER_LIST1: new FormControl(
        this.containerDropdownList,
        Validators.required
      ),
      CONTAINER_LIST: new FormArray([]),
    });

    this.getAvailableContainerList();
  }

  get f() {
    return this.containerForm.controls;
  }

  getAvailableContainerList() {
    var depocode: any = localStorage.getItem('usercode');
    this._depoService
      .getAvailableContainerListForDepo(depocode)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.containerDropdownList = res.Data;
        }
      });
  }

  saveContainer() {
    debugger;
    this.containerList = this.containerForm.get('CONTAINER_LIST1')?.value;
  }

  insertContainer() {
    const add = this.containerForm.get('CONTAINER_LIST') as FormArray;

    this.containerList.forEach((element) => {
      add.push(
        this._formBuilder.group({
          CONTAINER_NO: [element.CONTAINER_NO],
        })
      );
    });

    this.containerForm
      .get('CREATED_BY')
      ?.setValue(localStorage.getItem('username'));

    this.containerForm
      .get('DEPO_CODE')
      ?.setValue(localStorage.getItem('usercode'));

    this.containerForm.get('BOOKING_NO')?.setValue(this.bookingNo);

    this._depoService
      .createContainer(JSON.stringify(this.containerForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Container is alloted successfully');
          this._router.navigateByUrl('/home/container-allotment-list');
        }
      });
  }

  getDetails() {
    this.isCRO = false;

    var cro = new CRO();
    cro.CRO_NO = this.croNo;
    this.containerForm.get('CRO_NO')?.setValue(this.croNo);
    this._croService.getCRODetails(cro).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.croDetails = res.Data;
        this.bookingNo = res.Data.BOOKING_NO;
        this.isCRO = true;
        this.isrecord = true;
      } else {
        this.isCRO = false;
        this.isrecord = false;
      }
    });
  }
}
