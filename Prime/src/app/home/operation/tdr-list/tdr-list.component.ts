import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TDR } from 'src/app/models/tdr';
import { CommonService } from 'src/app/services/common.service';
import { TdrService } from 'src/app/services/tdr.service';
import * as xlsx from 'xlsx';

@Component({
  selector: 'app-tdr-list',
  templateUrl: './tdr-list.component.html',
  styleUrls: ['./tdr-list.component.scss'],
})
export class TdrListComponent implements OnInit {
  filterForm: FormGroup;
  tdrList: any[] = [];
  tdr: TDR = new TDR();
  tdrDetails: any;

  @ViewChild('epltable', { static: false }) epltable: ElementRef;

  constructor(
    private _commonService: CommonService,
    private _formBuilder: FormBuilder,
    private _tdrService: TdrService
  ) {}

  ngOnInit(): void {
    this.filterForm = this._formBuilder.group({
      TDR_NO: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.getTDRList();
  }

  Search() {}

  Clear() {}

  getTDRList() {
    this._commonService.destroyDT();

    this._tdrService.GetTdrList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.tdrList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  getTDRDetails(tdrNo: string) {
    this._tdrService.GetTdrDetails(tdrNo).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.tdrDetails = res.Data;
        setTimeout(() => {
          this.exportToExcel();
        }, 20);
      }
    });
  }

  exportToExcel() {
    const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(
      this.epltable.nativeElement
    );

    for (var i in ws) {
      if (typeof ws[i] != 'object') continue;
      let cell = xlsx.utils.decode_cell(i);

      ws[i].s = {
        // styling for all cells
        font: {
          name: 'arial',
        },
        alignment: {
          vertical: 'center',
          horizontal: 'center',
          wrapText: '1', // any truthy value here
        },
        border: {
          right: {
            style: 'thin',
            color: '000000',
          },
          left: {
            style: 'thin',
            color: '000000',
          },
        },
      };

      if (cell.r == 0) {
        // first row
        ws[i].s.fill = {
          patternType: 'solid',
          fgColor: { rgb: 'b2b2b2' },
          bgColor: { rgb: 'b2b2b2' },
        };
      }
    }

    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'Tdr.xlsx');
  }
}
