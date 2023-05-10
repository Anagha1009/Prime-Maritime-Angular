import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Bl } from 'src/app/models/bl';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';
import { DoService } from 'src/app/services/do.service';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-new-do2',
  templateUrl: './new-do2.component.html',
  styleUrls: ['./new-do2.component.scss'],
})
export class NewDo2Component implements OnInit {
  isLoading: boolean = false;
  blNo: string = '';
  submitted: boolean = false;
  submitted1: boolean = false;
  isData: boolean = false;
  containerList: any[] = [];
  doForm: FormGroup;
  cpForm: FormGroup;
  isIGM: boolean = false;
  acceptanceLocationList: any[] = [];
  IcdList: any[] = [];
  clearingPartyList: any[] = [];
  blSurrenderedList: any[] = [];

  @ViewChild('chckAll') chckAll: ElementRef;
  @ViewChild('openBtn') openBtn: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;

  constructor(
    private _blService: BlService,
    private _commonService: CommonService,
    private _formBuilder: FormBuilder,
    private _mstService: MasterService,
    private _dOService: DoService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.getForm();
    if (this._commonService.getUser()?.countrycode == 'IN') {
      this.isIGM = true;
    }
    this.getDropdown();
    this.getClearingParty();
    this.getDOList();
  }

  getDOList() {
    this._commonService.destroyDT();
    var pod = this._commonService.getUser().port.replace(',', ' ');
    var orgCode = this._commonService.getUser().orgcode;

    this._blService.GetBLSurrenderedList(orgCode, pod).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.blSurrenderedList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  get f() {
    return this.doForm.controls;
  }

  get f2() {
    var c = this.doForm.get('CONTAINER_LIST') as FormArray;
    return c.controls;
  }

  get f1() {
    return this.cpForm.controls;
  }

  getForm() {
    this.doForm = this._formBuilder.group({
      BL_NO: [''],
      DO_NO: [''],
      ARRIVAL_DATE: ['', Validators.required],
      IGM_NO: ['', Validators.required],
      IGM_ITEM_NO: ['', Validators.required],
      IGM_DATE: ['', Validators.required],
      CLEARING_PARTY: ['', Validators.required],
      ACCEPTANCE_LOCATION: ['', Validators.required],
      LETTER_VALIDITY: ['', Validators.required],
      SHIPPING_TERMS: ['', Validators.required],
      AGENT_CODE: [''],
      AGENT_NAME: [''],
      CREATED_BY: [''],
      CONTAINER_LIST: new FormArray([]),
    });

    this.cpForm = this._formBuilder.group({
      ID: [0],
      NAME: ['', Validators.required],
      EMAIL_ID: ['', Validators.required],
      CONTACT: [''],
      ADDRESS: [''],
      LOCATION: ['', Validators.required],
      AGENT_CODE: [''],
      CREATED_BY: [''],
    });
  }

  getDropdown() {
    this.acceptanceLocationList = [];
    this._commonService
      .getDropdownData('ACCEPTANCE_LOCATION')
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.acceptanceLocationList = res.Data;
        }
      });
  }

  getClearingParty() {
    this.clearingPartyList = [];
    this._mstService.getCP().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.clearingPartyList = res.Data;
      }
    });
  }

  getBLDetails(value: any, blNo: any) {
    if (!value) {
      this._commonService.warnMsg(
        blNo +
          ' is not marked as surrendered yet ! Please mark this BL as surrender to create DO'
      );
    } else {
      this.blNo = blNo;

      var bl = new Bl();
      bl.AGENT_CODE = this._commonService.getUserCode();
      bl.BL_NO = this.blNo;
      bl.fromDO = true;

      this.isData = false;
      this.containerList = [];
      this._commonService.destroyDT1();
      this._blService.getContainerList(bl).subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.isData = true;
          this.containerList = res.Data;

          if (this.containerList.length == 0) {
            this._commonService.errorMsg(
              'Sorry ! None of the containers in this BL has DCHF Activity Completed !'
            );
            this.isData = false;
            this.blNo = '';
          }
          this._commonService.getDT1();
        }
      });
    }
  }

  oncheck(event: any, value = 0, containerNo: string) {
    const add = this.doForm.get('CONTAINER_LIST') as FormArray;

    if (value == 1) {
      if (event.target.checked) {
        add.clear();
        this.containerList.forEach((element: any) => {
          add.push(
            this._formBuilder.group({
              CONTAINER_NO: [element.CONTAINER_NO],
              BL_NO: [this.blNo],
            })
          );
        });

        Array.from(document.getElementsByClassName('chck')).forEach(
          (element: any) => {
            element.checked = true;
          }
        );
      } else {
        add.clear();

        Array.from(document.getElementsByClassName('chck')).forEach(
          (element: any) => {
            element.checked = false;
          }
        );
      }
    } else if (value == 2) {
      if (event.target.checked) {
        add.push(
          this._formBuilder.group({
            CONTAINER_NO: [containerNo],
            BL_NO: [this.blNo],
          })
        );
      } else {
        add.removeAt(
          add.value.findIndex(
            (m: { CONTAINER_NO: any }) => m.CONTAINER_NO === containerNo
          )
        );

        this.chckAll.nativeElement.checked = false;
      }
    }
  }

  backToList() {
    this.isData = false;
    this.clearForm;
    this.getDOList();
  }

  createDO() {
    if (this.doForm.value.CONTAINER_LIST.length == 0) {
      this._commonService.warnMsg('Please add atleast 1 Container !');
    } else {
      if (!this.isIGM) {
        this.doForm.get('IGM_NO').disable();
        this.doForm.get('IGM_ITEM_NO').disable();
        this.doForm.get('IGM_DATE').disable();
      }
      this.submitted = true;
      if (this.doForm.invalid) {
        return;
      }

      var doNo = this._commonService.getRandomNumber('DO');
      this.doForm.get('DO_NO')?.setValue(doNo);
      this.doForm.get('BL_NO')?.setValue(this.blNo);
      if (!this.isIGM) {
        this.doForm.get('IGM_DATE').enable();
        this.doForm.get('IGM_DATE').setValue(null);
      }
      this.doForm
        .get('AGENT_NAME')
        ?.setValue(this._commonService.getUserName());
      this.doForm
        .get('AGENT_CODE')
        ?.setValue(this._commonService.getUserCode());
      this.doForm
        .get('CREATED_BY')
        ?.setValue(this._commonService.getUser().role);
      this._dOService
        .postDODetails(JSON.stringify(this.doForm.value))
        .subscribe((res: any) => {
          if (res.responseCode == 200) {
            this._commonService.successMsg(
              'DO has been created successfully ! <br> Your DO No is :' + doNo
            );
            this._router.navigateByUrl('/home/operations/do-list');
          }
        });
    }
  }

  saveCP() {
    this.submitted1 = true;
    if (this.cpForm.invalid) {
      return;
    }
    this.cpForm.get('AGENT_CODE')?.setValue(this._commonService.getUserCode());
    this.cpForm.get('CREATED_BY')?.setValue(this._commonService.getUserName());

    this._mstService
      .postCP(JSON.stringify(this.cpForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this.closeBtn.nativeElement.click();
          this._commonService.successMsg(
            'Clearity Party has been saved successfully !'
          );
          this.getClearingParty();
        }
      });
  }

  clearForm() {
    this.doForm.reset();
    this.doForm.get('ACCEPTANCE_LOCATION').setValue('');
    this.doForm.get('CLEARING_PARTY').setValue('');
    this.doForm.get('SHIPPING_TERMS').setValue('');
  }
}
