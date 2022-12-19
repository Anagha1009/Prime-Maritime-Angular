import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TdrService } from 'src/app/services/tdr.service';
import { CommonService } from 'src/app/services/common.service';
import { TDR } from 'src/app/models/tdr';
import { locale as english } from 'src/app/@core/translate/tdr/en';
import { locale as hindi } from 'src/app/@core/translate/tdr/hi';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';

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
  portList: any[] = [];

  constructor(
    private _tdrService: TdrService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, hindi);
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

  InsertTdr() {
    this.submitted = true;
    if (this.tdrForm.invalid) {
      return;
    }
    this.tdrForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    this._tdrService
      .InsertTdr(JSON.stringify(this.tdrForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your record has been submitted successfully !');
          this.GetTdrList();
        }
      });
  }

  GetTdrList() {
    var tdrModel = new TDR();
    tdrModel.CREATED_BY = localStorage.getItem('usercode');

    this._tdrService.GetTdrList(tdrModel).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.tdrList = res.Data;
      }
    });
  }
}
