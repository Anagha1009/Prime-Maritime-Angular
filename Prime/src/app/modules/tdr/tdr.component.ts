import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TdrService } from 'src/app/services/tdr.service';
import { CommonService } from 'src/app/services/common.service';
import { TDR } from 'src/app/models/tdr';
import { locale as english } from 'src/app/@core/translate/tdr/en';
import { locale as hindi } from 'src/app/@core/translate/tdr/hi';
import { locale as arabic } from 'src/app/@core/translate/tdr/ar';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import * as xlsx from 'xlsx';
@Component({
  selector: 'app-tdr',
  templateUrl: './tdr.component.html',
  styleUrls: ['./tdr.component.scss'],
})
export class TdrComponent implements OnInit {
  submitted: boolean = false;
  tdrForm: FormGroup;
  tdrList: any[] = [];
  vesselList: any[] = [];
  slotoperatorList: any[] = [];
  voyageList: any[] = [];
  isLoading: boolean = false;

  @ViewChild('epltable', { static: false }) epltable: ElementRef;

  portList: any[] = [];

  constructor(
    private _tdrService: TdrService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, hindi, arabic);
  }

  ngOnInit(): void {
    this.tdrForm = this._formBuilder.group({
      VESSEL_NAME: ['', Validators.required],
      VOYAGE_NO: ['', Validators.required],
      POL: ['', Validators.required],
      TERMINAL: ['', Validators.required],
      ETA: ['', Validators.required],
      POB_BERTHING: ['', Validators.required],
      BERTHED: ['', Validators.required],
      OPERATION_COMMMENCED: ['', Validators.required],
      POB_SAILING: ['', Validators.required],
      SAILED: ['', Validators.required],
      ETD: ['', Validators.required],
      ETA_NEXTPORT: ['', Validators.required],
      CREATED_BY: [''],
    });

    this.getDropdown();
    this.GetTdrList();
  }

  get f() {
    return this.tdrForm.controls;
  }

  getDropdown() {
    this._commonService.getDropdownData('PORT').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.portList = res.Data;
      }
    });

    this._commonService.getDropdownData('VESSEL_NAME').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.vesselList = res.Data;
      }
    });

    this._commonService
      .getDropdownData('SLOT_OPERATOR')
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.slotoperatorList = res.Data;
        }
      });
  }

  getVoyageList(event: any) {
    this.tdrForm.get('VOYAGE_NO')?.setValue('');
    this.voyageList = [];
    this._commonService
      .getDropdownData('VOYAGE_NO', '', event)
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.voyageList = res.Data;
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

  InsertTdr() {
    debugger
    this.submitted = true;
    this.isLoading = true;
    if (this.tdrForm.invalid) {
      return;
    }
    this.tdrForm.get('CREATED_BY')?.setValue(this._commonService.getUserName());
    this._tdrService
      .InsertTdr(JSON.stringify(this.tdrForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg('TDR added successfully !');
          this.GetTdrList();
          this.exportToExcel();
          this.isLoading = false;
        }

      });
  }

  GetTdrList() {
    this._commonService.destroyDT();
    this.isLoading = true;
    var tdrModel = new TDR();
    tdrModel.CREATED_BY = this._commonService.getUserCode();
    this._tdrService
      .GetTdrList(tdrModel)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.tdrList = res.Data;
          if (this.tdrList.length > 0) {
            setTimeout(() => {
              this.isLoading = false;
            }, 20);
          }
        }
        this._commonService.getDT();

      });
  }

  ClearForm() {
    this.tdrForm.reset();
    this.tdrForm.get('VESSEL_NAME')?.setValue('');
    this.tdrForm.get('VOYAGE_NO')?.setValue('');
  }
}
