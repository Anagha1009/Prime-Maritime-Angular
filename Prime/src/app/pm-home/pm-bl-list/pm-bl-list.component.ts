import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Bl } from 'src/app/models/bl';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-pm-bl-list',
  templateUrl: './pm-bl-list.component.html',
  styleUrls: ['./pm-bl-list.component.scss'],
})
export class PmBlListComponent implements OnInit {
  filterForm: FormGroup;
  blList: any[] = [];
  bl: Bl = new Bl();
  isLoading: boolean = false;
  isLoading1: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _blService: BlService
  ) {}

  ngOnInit(): void {
    this.filterForm = this._formBuilder.group({
      BL_NO: [''],
      CUSTOMER_NAME: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.getBLList();
  }

  Search() {
    var BL_NO = this.filterForm.value.BL_NO;
    var FROM_DATE = this.filterForm.value.FROM_DATE;
    var TO_DATE = this.filterForm.value.TO_DATE;

    if (BL_NO == '' && FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.bl.BL_NO = BL_NO;
    this.bl.FROM_DATE = FROM_DATE;
    this.bl.TO_DATE = TO_DATE;
    this.isLoading = true;
    this.getBLList();
  }

  Clear() {
    this.filterForm.get('BL_NO')?.setValue('');
    this.filterForm.get('FROM_DATE')?.setValue('');
    this.filterForm.get('TO_DATE')?.setValue('');

    this.bl.CRO_NO = '';
    this.bl.FROM_DATE = '';
    this.bl.TO_DATE = '';
    this.isLoading1 = true;
    this.getBLList();
  }

  getBLList() {
    this._commonService.destroyDT();
    this._blService.getBLListPM().subscribe((res: any) => {
      this.blList = [];
      this.isLoading = false;
      this.isLoading1 = false;
      if (res.ResponseCode == 200) {
        if (res.Data.length > 0) {
          this.blList = res.Data;
        }
      }
      this._commonService.getDT();
    });
  }
}
