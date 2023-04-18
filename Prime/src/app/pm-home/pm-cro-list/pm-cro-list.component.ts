import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CRO } from 'src/app/models/cro';
import { CommonService } from 'src/app/services/common.service';
import { CroService } from 'src/app/services/cro.service';

@Component({
  selector: 'app-pm-cro-list',
  templateUrl: './pm-cro-list.component.html',
  styleUrls: ['./pm-cro-list.component.scss'],
})
export class PmCroListComponent implements OnInit {
  filterForm: FormGroup;
  croList: any[] = [];
  cro: CRO = new CRO();
  isLoading: boolean = false;
  isLoading1: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _croService: CroService
  ) {}

  ngOnInit(): void {
    this.filterForm = this._formBuilder.group({
      CRO_NO: [''],
      CUSTOMER_NAME: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.getCROList();
  }

  Search() {
    var CRO_NO = this.filterForm.value.CRO_NO;
    var FROM_DATE = this.filterForm.value.FROM_DATE;
    var TO_DATE = this.filterForm.value.TO_DATE;

    if (CRO_NO == '' && FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.cro.CRO_NO = CRO_NO;
    this.cro.FROM_DATE = FROM_DATE;
    this.cro.TO_DATE = TO_DATE;
    this.isLoading = true;
    this.getCROList();
  }

  Clear() {
    this.filterForm.get('CRO_NO')?.setValue('');
    this.filterForm.get('FROM_DATE')?.setValue('');
    this.filterForm.get('TO_DATE')?.setValue('');

    this.cro.CRO_NO = '';
    this.cro.FROM_DATE = '';
    this.cro.TO_DATE = '';
    this.isLoading1 = true;
    this.getCROList();
  }

  getCROList() {
    this._commonService.destroyDT();
    this._croService.getCROListPM(this.cro).subscribe((res: any) => {
      this.croList = [];
      this.isLoading = false;
      this.isLoading1 = false;
      if (res.ResponseCode == 200) {
        if (res.Data.length > 0) {
          this.croList = res.Data;
        }
      }
      this._commonService.getDT();
    });
  }
}
