import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DO } from 'src/app/models/do';
import { CommonService } from 'src/app/services/common.service';
import { DoService } from 'src/app/services/do.service';

@Component({
  selector: 'app-pm-do-list',
  templateUrl: './pm-do-list.component.html',
  styleUrls: ['./pm-do-list.component.scss'],
})
export class PmDoListComponent implements OnInit {
  filterForm: FormGroup;
  doList: any[] = [];
  do: DO = new DO();
  isLoading: boolean = false;
  isLoading1: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _doService: DoService
  ) {}

  ngOnInit(): void {
    this.filterForm = this._formBuilder.group({
      DO_NO: [''],
      CUSTOMER_NAME: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.getDOList();
  }

  Search() {
    var DO_NO = this.filterForm.value.DO_NO;
    var FROM_DATE = this.filterForm.value.FROM_DATE;
    var TO_DATE = this.filterForm.value.TO_DATE;

    if (DO_NO == '' && FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.do.DO_NO = DO_NO;
    this.do.FROM_DATE = FROM_DATE;
    this.do.TO_DATE = TO_DATE;
    this.isLoading = true;
    this.getDOList();
  }

  Clear() {
    this.filterForm.get('CRO_NO')?.setValue('');
    this.filterForm.get('FROM_DATE')?.setValue('');
    this.filterForm.get('TO_DATE')?.setValue('');

    this.do.DO_NO = '';
    this.do.FROM_DATE = '';
    this.do.TO_DATE = '';
    this.isLoading1 = true;
    this.getDOList();
  }

  getDOList() {
    this._commonService.destroyDT();
    this._doService.getDOListPM(this.do).subscribe((res: any) => {
      this.doList = [];
      this.isLoading = false;
      this.isLoading1 = false;
      if (res.ResponseCode == 200) {
        if (res.Data.length > 0) {
          this.doList = res.Data;
        }
      }
      this._commonService.getDT();
    });
  }
}
