import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Bl } from 'src/app/models/bl';
import { BlService } from 'src/app/services/bl.service';
import { CmService } from 'src/app/services/cm.service';
import { CommonService } from 'src/app/services/common.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-new-bl2',
  templateUrl: './new-bl2.component.html',
  styleUrls: ['./new-bl2.component.scss'],
})
export class NewBl2Component implements OnInit {
  onUpload: boolean = false;
  blForm: FormGroup;
  previewTable: any[];
  containerList: any[];
  isBLForm: boolean = false;
  isManual: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _cm: CmService,
    private _blService: BlService
  ) {}

  ngOnInit(): void {
    this.getForm();
  }

  getForm() {
    this.blForm = this._formBuilder.group({
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
      PRE_CARRIAGE_BY: [''],
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
      NO_OF_ORIGINAL_BL: [3],
      BL_STATUS: [''],
      BL_TYPE: [''],
      OG_TYPE: [''],
      OGView: [0],
      NNView: [0],
      AGENT_CODE: [''],
      AGENT_NAME: [''],
      CREATED_BY: [''],
      CONTAINER_LIST: [new Array([])],
      CONTAINER_LIST2: new FormArray([]),
    });
  }

  get blf() {
    return this.blForm.controls;
  }

  onFileChange(ev: any) {
    let workBook: any = null;
    let jsonData = null;
    const reader = new FileReader();
    var file = ev.target.files[0];

    var extension = file.name.split('.').pop();
    var array = ['csv', 'xls', 'xlsx'];

    if (
      ev.target.files[0].type ==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
    } else {
      this._commonService.warnMsg('Please Select Excel Format only');
      return;
    }

    if (file.size > 5000000) {
      this._commonService.warnMsg('Please upload file less than 5 mb..!');
      return;
    } else {
      var el = array.find((a) => a.includes(extension));

      if (el != null && el != '') {
        reader.onload = (event) => {
          const data = reader.result;
          workBook = XLSX.read(data, { type: 'binary', cellDates: true });

          if (workBook.SheetNames[0] != 'Sheet1') {
            this._commonService.warnMsg('Invalid File !');
            return;
          }

          jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
            const sheet = workBook.Sheets[name];
            initial[name] = XLSX.utils.sheet_to_json(sheet, { defval: '' });
            return initial;
          }, {});

          var keyArray = [
            'BOOKING_NO',
            'CRO_NO',
            'SHIPPER',
            'SHIPPER_ADDRESS',
            'CONSIGNEE',
            'CONSIGNEE_ADDRESS',
            'NOTIFY_PARTY',
            'NOTIFY_PARTY_ADDRESS',
            'PRE_CARRIAGE_BY',
            'PLACE_OF_RECEIPT',
            'VESSEL_NAME',
            'VOYAGE_NO',
            'PORT_OF_LOADING',
            'PORT_OF_DISCHARGE',
            'PLACE_OF_DELIVERY',
            'FINAL_DESTINATION',
            'MARKS_NOS',
            'DESC_OF_GOODS',
          ];

          var keyArray1 = [
            'CONTAINER_NO',
            'CONTAINER_TYPE',
            'SEAL_NO',
            'AGENT_SEAL_NO',
            'GROSS_WEIGHT',
            'MEASUREMENT',
          ];

          var keyXlArray: any = [];
          var keyXlArray1: any = [];

          Object.keys(jsonData['Sheet1'][0]).forEach(function (key) {
            keyXlArray.push(key);
          });

          Object.keys(jsonData['Sheet2'][0]).forEach(function (key) {
            keyXlArray1.push(key);
          });

          var result = this.isSameColumn(keyXlArray, keyArray);
          var result1 = this.isSameColumn(keyXlArray1, keyArray1);

          if (result && result1) {
            this.previewTable = [];
            this.containerList = [];

            this.previewTable = jsonData['Sheet1'];
            this.containerList = jsonData['Sheet2'];
            var isValid = true;

            this.previewTable.forEach((element) => {
              if (
                !this.checkNullEmpty([
                  element.BOOKING_NO,
                  element.CRO_NO,
                  element.SHIPPER,
                  element.SHIPPER_ADDRESS,
                  element.CONSIGNEE,
                  element.CONSIGNEE_ADDRESS,
                  element.PLACE_OF_RECEIPT,
                  element.VESSEL_NAME,
                  element.VOYAGE_NO,
                  element.PORT_OF_LOADING,
                  element.PORT_OF_DISCHARGE,
                  element.FINAL_DESTINATION,
                  element.MARKS_NOS,
                  element.DESC_OF_GOODS,
                ])
              ) {
                isValid = false;
              }
            });

            this.containerList.forEach((element) => {
              if (
                !this.checkNullEmpty([
                  element.CONTAINER_NO,
                  element.CONTAINER_TYPE,
                  element.SEAL_NO,
                  element.GROSS_WEIGHT,
                  element.MEASUREMENT,
                ])
              ) {
                isValid = false;
              }
            });

            if (isValid) {
              this.containerList.forEach((element) => {
                this._cm
                  .isValidContainer(element.CONTAINER_NO)
                  .subscribe((res) => {
                    if (res.responseCode == 500) {
                      this._commonService.warnMsg(
                        'One of the Container No doesnt match with the Master Data! Please insert valid Container No'
                      );
                      this.onUpload = false;
                    }
                  });
              });
              this.previewTable = this.previewTable.filter(
                (v, i, a) =>
                  a.findIndex(
                    (v2) => JSON.stringify(v2) === JSON.stringify(v)
                  ) === i
              );

              this._commonService.destroyDT();
              this.containerList = this.containerList.filter(
                (v, i, a) =>
                  a.findIndex(
                    (v2) => JSON.stringify(v2) === JSON.stringify(v)
                  ) === i
              );
              this.onUpload = true;
            } else {
              this._commonService.warnMsg('Incorrect data!');
            }
          } else {
            this._commonService.warnMsg('Invalid file !');
          }
        };
        reader.readAsBinaryString(file);
      } else {
        this._commonService.warnMsg('Only .xlsx or .csv files allowed');
      }
    }
  }

  checkNullEmpty(param: any) {
    var x = true;
    param.forEach((element: any) => {
      if (element == null || element == '' || element == undefined) {
        x = false;
      }
    });
    return x;
  }

  isSameColumn(arr1: any, arr2: any) {
    return $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0;
  }

  getBLForm() {
    if (!this.onUpload) {
      this._commonService.errorMsg('Please upload Shipping Instrunctions !');
      return;
    }

    this.isBLForm = true;
    this.blForm.patchValue(this.previewTable[0]);

    this._commonService.getDT();
  }

  saveDraft() {
    var blNo = this._commonService.getRandomNumber('BL');
    this.blForm.get('BL_NO').setValue(blNo);
    this.blForm.get('AGENT_CODE').setValue(this._commonService.getUserCode());
    this.blForm.get('AGENT_NAME').setValue(this._commonService.getUserName());
    this.blForm.get('CREATED_BY').setValue(this._commonService.getUser().role);

    var add = this.blForm.get('CONTAINER_LIST');
    add.setValue(this.containerList);

    var bl = new Bl();
    bl.AGENT_CODE = this._commonService.getUserCode();
    // bl.BOOKING_NO = this.blForm.get('BOOKING_NO')?.value;
    bl.BOOKING_NO = 'BK2023040314415945';

    this._blService.getSRRDetails(bl).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.blForm.get('SRR_ID')?.setValue(res.Data.ID);
        this.blForm.get('SRR_NO')?.setValue(res.Data.SRR_NO);

        console.log(JSON.stringify(this.blForm.value));
        this._blService.createBL(this.blForm.value).subscribe((res) => {
          if (res.responseCode == 200) {
            this._commonService.successMsg(
              'BL created successfully !<br> Your BL No is ' + blNo
            );
          }
        });
      }
    });
  }
}
