import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TdrService } from 'src/app/services/tdr.service';
import { CommonService } from 'src/app/services/common.service';
import { locale as english } from 'src/app/@core/translate/tdr/en';
import { locale as hindi } from 'src/app/@core/translate/tdr/hi';
import { locale as arabic } from 'src/app/@core/translate/tdr/ar';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import { Router } from '@angular/router';

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
  voyageList: any[] = [];
  terminalList: any[] = [];
  isLoading: boolean = false;
  portList: any[] = [];

  constructor(
    private _tdrService: TdrService,
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _coreTranslationService: CoreTranslationService,
    private _router: Router
  ) {
    this._coreTranslationService.translate(english, hindi, arabic);
  }

  ngOnInit(): void {
    this.tdrForm = this._formBuilder.group({
      TDR_NO: [''],
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

  getTerminalList(event: any) {
    this.tdrForm.get('TERMINAL')?.setValue('');
    this.terminalList = [];
    this._commonService
      .getDropdownData('TERMINAL', event, '')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.terminalList = res.Data;
        }
      });
  }

  InsertTdr() {
    this.submitted = true;
    if (this.tdrForm.invalid) {
      return;
    }

    this.isLoading = true;
    var tdrNo = this._commonService.getRandomNumber('TDR');
    this.tdrForm.get('TDR_NO')?.setValue(tdrNo);
    this.tdrForm.get('CREATED_BY')?.setValue(this._commonService.getUserName());
    this._tdrService
      .InsertTdr(JSON.stringify(this.tdrForm.value))
      .subscribe((res: any) => {
        this.isLoading = false;
        if (res.responseCode == 200) {
          this._commonService.successMsg(
            'TDR added successfully ! <br>Your TDR No is ' + tdrNo
          );
          this._router.navigateByUrl('/home/operations/tdr-list');
        }
      });
  }

  ClearForm() {
    this.tdrForm.reset();
    this.tdrForm.get('VESSEL_NAME')?.setValue('');
    this.tdrForm.get('VOYAGE_NO')?.setValue('');
    this.tdrForm.get('POL')?.setValue('');
    this.tdrForm.get('TERMINAL')?.setValue('');
  }
}
