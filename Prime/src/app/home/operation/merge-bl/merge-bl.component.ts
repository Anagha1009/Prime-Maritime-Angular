import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Bl, MergeBl } from 'src/app/models/bl';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-merge-bl',
  templateUrl: './merge-bl.component.html',
  styleUrls: ['./merge-bl.component.scss'],
})
export class MergeBlComponent implements OnInit {
  mergeForm: FormGroup;
  mergeBLForm: FormGroup;
  submitted: boolean = false;
  submitted1: boolean = false;
  hideHistory: boolean = true;
  showF1Form: boolean = true;
  isMergeBL: boolean = false;
  polList: any[] = [];
  podList: any[] = [];
  voyageList: any[] = [];
  vesselList: any[] = [];
  blHistoryList: any[] = [];
  blmergeList: any[] = [];
  minDate: any = '';

  constructor(
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _blService: BlService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.getDropdown();

    this.mergeForm = this._formBuilder.group({
      PORT_OF_LOADING: ['', Validators.required],
      PORT_OF_DISCHARGE: ['', Validators.required],
      VESSEL_NAME: ['', Validators.required],
      VOYAGE_NO: ['', Validators.required],
      SHIPPER: ['', Validators.required],
      CONSIGNEE: ['', Validators.required],
      NOTIFY_PARTY: [''],
      BL_HISTORY_LIST: new FormArray([]),
      BL_MERGE_LIST: new FormArray([]),
    });

    this.mergeBLForm = this._formBuilder.group({
      BLType: [true],
      BL_NO: [''],
      SRR_ID: [''],
      SRR_NO: [''],
      BOOKING_NO: ['', Validators.required],
      CRO_NO: ['', Validators.required],
      SHIPPER: ['', Validators.required],
      SHIPPER_ADDRESS: ['', Validators.required],
      CONSIGNEE: ['', Validators.required],
      CONSIGNEE_ADDRESS: ['', Validators.required],
      NOTIFY_PARTY: ['', Validators.required],
      NOTIFY_PARTY_ADDRESS: ['', Validators.required],
      PRE_CARRIAGE_BY: ['', Validators.required],
      PLACE_OF_RECEIPT: ['', Validators.required],
      VESSEL_NAME: ['', Validators.required],
      VOYAGE_NO: ['', Validators.required],
      PORT_OF_LOADING: ['', Validators.required],
      PORT_OF_DISCHARGE: ['', Validators.required],
      PLACE_OF_DELIVERY: ['', Validators.required],
      FINAL_DESTINATION: ['', Validators.required],
      MARKS_NOS: ['', Validators.required],
      DESC_OF_GOODS: ['', Validators.required],
      TOTAL_CONTAINERS: [''],
      PREPAID_AT: [''],
      PAYABLE_AT: [''],
      BL_ISSUE_PLACE: ['', Validators.required],
      BL_ISSUE_DATE: ['', Validators.required],
      TOTAL_PREPAID: [0],
      NO_OF_ORIGINAL_BL: [0, Validators.required],
      BL_STATUS: [''],
      BL_TYPE: [''],
      OG_TYPE: [''],
      OGView: [0],
      NNView: [0],
      AGENT_CODE: [''],
      AGENT_NAME: [''],
      CREATED_BY: [''],
      CREATED_DATE: [new Date()],
      CONTAINER_LIST: new FormArray([]),
      //CONTAINER_LIST2: new FormArray([]),
    });

    this.minDate = formatDate(new Date(), 'dd-MM-yyyy', 'en');
  }

  getDropdown() {
    var countrycode: any = this._commonService.getUser().countrycode;
    this._commonService.getDropdownData('PORT').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.polList = res.Data;
      }
    });

    this._commonService.getDropdownData('PORT').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.podList = res.Data;
      }
    });

    this._commonService.getDropdownData('VESSEL_NAME').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.vesselList = res.Data;
      }
    });
  }

  getVoyageList(event: any) {
    this.mergeForm.get('VOYAGE_NO')?.setValue('');
    this.voyageList = [];
    this._commonService
      .getDropdownData('VOYAGE_NO', '', event)
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.voyageList = res.Data;
        }
      });
  }

  cancelBL() {
    this.mergeForm.get('PORT_OF_LOADING').setValue('');
    this.mergeForm.get('PORT_OF_DISCHARGE').setValue('');
    this.mergeForm.get('SHIPPER').setValue('');
    this.mergeForm.get('CONSIGNEE').setValue('');
    this.mergeForm.get('VESSEL_NAME').setValue('');
    this.mergeForm.get('VOYAGE_NO').setValue('');
    this.mergeForm.get('NOTIFY_PARTY').setValue('');
  }

  resetMergeBL() {
    this.mergeBLForm.reset();
    const add = this.mergeForm.get('BL_MERGE_LIST') as FormArray;
    add.clear();
    this.showF1Form = false;
    this.hideHistory = false;
    this.isMergeBL = false;
  }
  searchBL() {
    this.submitted = true;
    console.log(JSON.stringify(this.mergeForm.value));
    if (this.mergeForm.invalid) {
      return;
    }

    var mergeBl = new MergeBl();
    mergeBl.POL = this.mergeForm.get('PORT_OF_LOADING').value;
    mergeBl.POD = this.mergeForm.get('PORT_OF_DISCHARGE').value;
    mergeBl.SHIPPER = this.mergeForm.get('SHIPPER').value;
    mergeBl.CONSIGNEE = this.mergeForm.get('CONSIGNEE').value;
    mergeBl.VESSEL_NAME = this.mergeForm.get('VESSEL_NAME').value;
    mergeBl.VOYAGE_NO = this.mergeForm.get('VOYAGE_NO').value;
    mergeBl.NOTIFY_PARTY = this.mergeForm.get('NOTIFY_PARTY').value;

    this._blService.getBLForMerge(mergeBl).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        if (res.Data.length != 0) {
          this.blHistoryList = res.Data;

          //pushing it in formarray
          const add = this.mergeForm.get('BL_HISTORY_LIST') as FormArray;
          add.clear();
          this.blHistoryList.forEach((element) => {
            add.push(
              this._formBuilder.group({
                BL_NO: [element.BL_NO],
                BL_ISSUE_DATE: [element.BL_ISSUE_DATE],
                BL_ISSUE_PLACE: [element.BL_ISSUE_PLACE],
                PORT_OF_LOADING: [element.PORT_OF_LOADING],
                PORT_OF_DISCHARGE: [element.PORT_OF_DISCHARGE],
                VESSEL_NAME: [element.VESSEL_NAME],
                VOYAGE_NO: [element.VOYAGE_NO],
                SHIPPER: [element.SHIPPER],
                CONSIGNEE: [element.CONSIGNEE],
                //BL_STATUS:[element.BL_STATUS]
              })
            );
          });
          //
          this.showF1Form = false;
          this.hideHistory = false;
        } else {
          this._commonService.warnMsg('No Records Found!');
        }
      }
    });
  }

  getContainerList(item: any, event: any, index: number) {
    console.log(item);
    console.log(index);
    if (item == 1) {
      const add = this.mergeForm.get('BL_HISTORY_LIST') as FormArray;
      const add1 = this.mergeForm.get('BL_MERGE_LIST') as FormArray;

      if (event.target.checked) {
        add.controls.forEach((control) => {
          add1.push(control);
        });

        for (var i: number = 0; i < add.length; i++) {
          (document.getElementById('chck' + i) as HTMLInputElement).checked =
            true;
        }
      } else {
        add1.clear();
        for (var i: number = 0; i < add.length; i++) {
          (document.getElementById('chck' + i) as HTMLInputElement).checked =
            false;
        }
      }
    } else {
      const add = this.mergeForm.get('BL_MERGE_LIST') as FormArray;
      if (event.target.checked) {
        add.push(item);
      } else {
        // add.removeAt(index);
        add.removeAt(
          add.value.findIndex(
            (m: { BL_NO: any }) => m.BL_NO === item.value.BL_NO
          )
        );
      }
    }
  }

  get f() {
    return this.mergeForm.controls;
  }

  get m() {
    var c = this.mergeForm.get('BL_HISTORY_LIST') as FormArray;
    return c.controls;
  }

  get m1() {
    var c = this.mergeBLForm.get('CONTAINER_LIST') as FormArray;
    return c.controls;
  }

  get blf() {
    return this.mergeBLForm.controls;
  }

  getf1(i: any) {
    return i;
  }

  getf2(i: any) {
    return i;
  }

  mergeBL() {
    if (this.mergeForm.get('BL_MERGE_LIST').value.length < 2) {
      this._commonService.warnMsg('Please select atleast 2 BL to merge');
      return;
    }

    this.mergeBLForm
      .get('PORT_OF_LOADING')
      .setValue(this.mergeForm.get('PORT_OF_LOADING').value);
    this.mergeBLForm
      .get('PORT_OF_DISCHARGE')
      .setValue(this.mergeForm.get('PORT_OF_DISCHARGE').value);
    this.mergeBLForm
      .get('VESSEL_NAME')
      .setValue(this.mergeForm.get('VESSEL_NAME').value);
    this.mergeBLForm
      .get('VOYAGE_NO')
      .setValue(this.mergeForm.get('VOYAGE_NO').value);
    this.mergeBLForm
      .get('SHIPPER')
      .setValue(this.mergeForm.get('SHIPPER').value);
    this.mergeBLForm
      .get('CONSIGNEE')
      .setValue(this.mergeForm.get('CONSIGNEE').value);
    this.mergeBLForm
      .get('NOTIFY_PARTY')
      .setValue(this.mergeForm.get('NOTIFY_PARTY').value);

    const formArray = this.mergeForm.get('BL_MERGE_LIST') as FormArray;
    console.log(formArray);
    console.log('Bl merge list' + this.blmergeList);

    const add = this.mergeBLForm.get('CONTAINER_LIST') as FormArray;
    add.clear();

    for (var i = 0; i < formArray.value.length; i++) {
      var BL = new Bl();
      BL.AGENT_CODE = this._commonService.getUserCode();
      BL.BL_NO = this.mergeForm.value.BL_MERGE_LIST[i].BL_NO;

      this._blService.getBLDetails(BL).subscribe((res: any) => {
        //responsecode 200 wala condition dalo
        if (res.ResponseCode == 200) {
          var contList: any[] = res.Data.CONTAINER_LIST;

          const add = this.mergeBLForm.get('CONTAINER_LIST') as FormArray;
          //add.clear();
          contList.forEach((element) => {
            add.push(
              this._formBuilder.group({
                CONTAINER_NO: [element.CONTAINER_NO],
                CONTAINER_TYPE: [element.CONTAINER_TYPE],
                //CONTAINER_SIZE: [element.CONTAINER_SIZE],
                SEAL_NO: [element.SEAL_NO],
                AGENT_SEAL_NO: [element.SEAL_NO],
                GROSS_WEIGHT: [element.GROSS_WEIGHT],
                MEASUREMENT: [element.MEASUREMENT?.toString()],
                MARKS_NOS: [element.MARKS_NOS],
                DESC_OF_GOODS: [element.DESC_OF_GOODS],
              })
            );
          });

          this.mergeBLForm
            .get('TOTAL_CONTAINERS')
            .setValue(this.mergeBLForm.get('CONTAINER_LIST').value.length);
        }
      });
    }

    this.hideHistory = true;
    this.showF1Form = false;
    this.isMergeBL = true;
  }

  validate2P(param: any, e: any) {
    if (param == 'PREPAID_AT' && e.length > 0) {
      this.mergeBLForm.get('PREPAID_AT').enable();
      this.mergeBLForm.get('PAYABLE_AT').disable();
    } else if (param == 'PREPAID_AT' && e.length == 0) {
      this.mergeBLForm.get('PREPAID_AT').disable();
      this.mergeBLForm.get('PAYABLE_AT').enable();
    } else if (param == 'PAYABLE_AT' && e.length > 0) {
      this.mergeBLForm.get('PREPAID_AT').disable();
      this.mergeBLForm.get('PAYABLE_AT').enable();
    } else if (param == 'PAYABLE_AT' && e.length == 0) {
      this.mergeBLForm.get('PREPAID_AT').enable();
      this.mergeBLForm.get('PAYABLE_AT').disable();
    }
  }

  createBL() {
    this.submitted1 = true;
    if (this.mergeBLForm.invalid) {
      return;
    }

    if (
      this.mergeBLForm.get('PREPAID_AT').value == null ||
      this.mergeBLForm.get('PREPAID_AT').value == ''
    ) {
      if (
        this.mergeBLForm.get('PAYABLE_AT').value == null ||
        this.mergeBLForm.get('PAYABLE_AT').value == ''
      ) {
        alert('Please enter either Prepaid-At or Payable-At !');
        return;
      }
    }

    this.mergeBLForm.get('BL_NO')?.setValue(this.getRandomNumber());
    this.mergeBLForm.get('BLType')?.setValue('Draft');
    this.mergeBLForm.get('BL_STATUS')?.setValue('Drafted');

    var voyageNo = this.mergeBLForm.get('VOYAGE_NO')?.value;
    this.mergeBLForm.get('VOYAGE_NO')?.setValue(voyageNo.toString());

    var noBL = this.mergeBLForm.get('NO_OF_ORIGINAL_BL')?.value;
    this.mergeBLForm.get('NO_OF_ORIGINAL_BL')?.setValue(noBL.toString());

    this.mergeBLForm
      .get('AGENT_CODE')
      ?.setValue(this._commonService.getUserCode());
    this.mergeBLForm
      .get('AGENT_NAME')
      ?.setValue(this._commonService.getUserName());
    this.mergeBLForm
      .get('CREATED_BY')
      ?.setValue(this._commonService.getUserName());

    var bl = new Bl();
    bl.AGENT_CODE = this._commonService.getUserCode();
    bl.BL_NO = '';
    bl.BOOKING_NO = this.mergeBLForm.get('BOOKING_NO')?.value;

    //newcode
    this.mergeBLForm.get('PREPAID_AT').enable();
    this.mergeBLForm.get('PAYABLE_AT').enable();
    //
    console.log(JSON.stringify(this.mergeBLForm.value));
    this._blService.getSRRDetails(bl).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.mergeBLForm.get('SRR_ID')?.setValue(res.Data.ID);
        this.mergeBLForm.get('SRR_NO')?.setValue(res.Data.SRR_NO);
        console.log(this.mergeBLForm.get('SRR_ID')?.value);
        console.log(this.mergeBLForm.get('SRR_NO')?.value);

        this._blService
          .createBL(JSON.stringify(this.mergeBLForm.value))
          .subscribe((res: any) => {
            if (res.responseCode == 200) {
              //this._router.navigateByUrl('/home/new-bl');
              this._commonService.successMsg('BL created Successfully');
              const add = this.mergeBLForm.get('CONTAINER_LIST') as FormArray;
              add.clear();
              this._router.navigateByUrl('/home/operations/new-bl');
            }
          });
        //this.ContainerDescription();
      }
    });
  }

  getRandomNumber() {
    var num = Math.floor(Math.random() * 1e16).toString();
    return 'BL' + num;
  }
}
