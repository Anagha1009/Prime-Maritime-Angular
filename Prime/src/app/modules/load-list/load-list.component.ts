import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LOADLIST } from 'src/app/models/loadlist';
import { CommonService } from 'src/app/services/common.service';
import { LoadListService } from 'src/app/services/load-list.service';
import * as xlsx from 'xlsx';
import { locale as english } from 'src/app/@core/translate/Loadlist/en';
import { locale as hindi } from 'src/app/@core/translate/Loadlist/hi';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';


@Component({
  selector: 'app-load-list',
  templateUrl: './load-list.component.html',
  styleUrls: ['./load-list.component.scss'],
})
export class LoadListComponent implements OnInit {
  submitted: boolean = false;
  loadlistForm: FormGroup;
  loadList: any[] = [];
  VesselList: any[] = [];
  VoyageList: any[] = [];
  isLoading: boolean = false;

  @ViewChild('epltable', { static: false }) epltable: ElementRef;

  constructor(
    private _loadListService: LoadListService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _coreTranslationService: CoreTranslationService,
  ) {this._coreTranslationService.translate(english, hindi);}

  ngOnInit(): void {
    this.loadlistForm = this._formBuilder.group({
      VESSEL_NAME: ['',Validators.required],
      VOYAGE_NO: ['',Validators.required],
    });
    this.getDropdown();
  }

  get f(){
    return this.loadlistForm.controls;
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
    xlsx.writeFile(wb, 'loadlist.xlsx');
  }

  GetLoadList() {
    this.submitted=true
    this.isLoading = true;
    var loadListModel = new LOADLIST();
    loadListModel.VESSEL_NAME = this.loadlistForm.get('VESSEL_NAME')?.value;
    loadListModel.VOYAGE_NO = this.loadlistForm.get('VOYAGE_NO')?.value;

    this._loadListService.GetLoadList(loadListModel).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.loadList = res.Data;
        if (this.loadList.length > 0) {
          setTimeout(() => {
            this.exportToExcel();
            this.isLoading = false;
          }, 20);
        }
      }
    });
  }

  getDropdown() {
    this._commonService.getDropdownData('VESSEL_NAME').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.VesselList = res.Data;
      }
    });

    this._commonService.getDropdownData('VOYAGE_NO').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.VoyageList = res.Data;
      }
    });
  }
}
