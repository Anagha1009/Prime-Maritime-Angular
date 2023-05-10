import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ColDef,
  ITextFilterParams,
  ValueFormatterParams,
} from 'ag-grid-community';
import { contains, param } from 'jquery';
import { filter, Observable } from 'rxjs';
import { CmService } from 'src/app/services/cm.service';
import { locale as english } from 'src/app/@core/translate/do/en';
import { locale as hindi } from 'src/app/@core/translate/do/hi';
import { locale as arabic } from 'src/app/@core/translate/do/ar';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-ct-list',
  templateUrl: './ct-list.component.html',
  styleUrls: ['./ct-list.component.scss'],
})
export class CtListComponent implements OnInit {
  previewDetails: boolean = false;
  previewNoData: boolean = false;
  conNo: any = '';
  ctList: any[] = [];

  //AGGrid
  public rowData: any[] = [];
  private gridApi: any;
  private gridColumnApi: any;
  defaultPageSize = 10;
  columnDefs: ColDef[];
  customFilterParams: ITextFilterParams = {
    filterOptions: ['contains'],
    debounceMs: 200,
    suppressAndOrCondition: true,
  } as ITextFilterParams;

  constructor(
    private _cmService: CmService,
    private _router: Router,
    private _coreTranslationService: CoreTranslationService,
    private _commonService: CommonService
  ) {
    this._coreTranslationService.translate(english, hindi, arabic);
  }

  ngOnInit(): void {
    this.columnDefs = [
      {
        field: 'BOOKING_NO',
        sortable: true,
        filter: true,
        filterParams: this.customFilterParams,
        valueFormatter: this.checkDataFormatter,
      },
      {
        field: 'CRO_NO',
        sortable: true,
        filter: true,
        filterParams: this.customFilterParams,
        valueFormatter: this.checkDataFormatter,
      },
      {
        field: 'CONTAINER_NO',
        sortable: true,
        filter: true,
        filterParams: this.customFilterParams,
        valueFormatter: this.checkDataFormatter,
      },
      {
        field: 'ACTIVITY',
        sortable: true,
        filter: true,
        filterParams: this.customFilterParams,
        valueFormatter: this.checkDataFormatter,
      },
      {
        field: 'PREV_ACTIVITY',
        sortable: true,
        filter: true,
        filterParams: this.customFilterParams,
        valueFormatter: this.checkDataFormatter,
      },
      {
        field: 'ACTIVITY_DATE',
        sortable: true,
        filter: true,
        filterParams: this.customFilterParams,
        valueFormatter: this.checkDataFormatter,
      },
      {
        field: 'LOCATION',
        sortable: true,
        filter: true,
        filterParams: this.customFilterParams,
        valueFormatter: this.checkDataFormatter,
      },
      {
        field: 'STATUS',
        sortable: true,
        filter: true,
        filterParams: this.customFilterParams,
        valueFormatter: this.checkDataFormatter,
      },
    ];
  }

  checkDataFormatter(params: ValueFormatterParams) {
    if (params.value == null) {
      return '-';
    } else if (params.value == '') {
      return '-';
    } else if (params.value != '') {
      return params.value;
    }
  }

  onPageSizeChanged(event: any) {
    this.gridApi.paginationSetPageSize(Number(event.target.value));
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.setDatasource(this.rowData);
  }

  getTrackingHistoryList() {
    this._commonService.destroyDT();

    this.previewDetails = false;
    this.previewNoData = false;
    if (this.conNo == '') {
      alert('Please enter container number');
    } else {
      this._cmService.getTrackingHistory(this.conNo).subscribe(
        (res: any) => {
          this.ctList = [];
          //this.isScroll = false;
          if (res.ResponseCode == 200) this._commonService.getDT();

          {
            if (res.Data?.length > 0) {
              this.ctList = res.Data;
              this.rowData = res.Data;
              this.previewDetails = true;
              // if (this.doList?.length >= 4) {
              //   this.isScroll = true;
              // } else {
              //   this.isScroll = false;
              // }
            } else {
              this.previewNoData = true;
            }
          }
          if (res.ResponseCode == 500) {
            this.previewNoData = true;
          }
        },
        (error: any) => {
          if (error.status == 401) {
            alert('You are not authorized to access this page, please login');
            this._router.navigateByUrl('login');
          }
        }
      );
    }
  }
}
