import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { Bl } from 'src/app/models/bl';
import { BlService } from 'src/app/services/bl.service';
import { Router } from '@angular/router';
import $ from 'jquery';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import { locale as english } from 'src/app/@core/translate/bl/en';
import { locale as hindi } from 'src/app/@core/translate/bl/hi';
import { locale as arabic } from 'src/app/@core/translate/bl/ar';
import { formatDate } from '@angular/common';
import { PageBreak } from 'pdfmake/interfaces';
import { Column } from 'ag-grid-community';
import { layouts } from 'chart.js';
import { ClientRequest } from 'http';
import { truncateSync } from 'fs';

const pdfMake = require('pdfmake/build/pdfmake.js');
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-new-bl',
  templateUrl: './new-bl.component.html',
  styleUrls: ['./new-bl.component.scss'],
})
export class NewBlComponent implements OnInit {
  editBL: boolean = false;
  submitted: boolean = false;
  croNo: string = '';
  blForm: FormGroup;
  onUpload: boolean = false;
  previewTable: any[] = [];
  containerList: any[] = [];
  ContainerList1: any[] = [];
  isBLForm: boolean = false;
  tabs: string = '1';
  blNo: string = '';
  isSplit: boolean = false;
  srrId: any;
  srrNo: any;
  chargeList: any[] = [];
  allContainerType: any[] = [];
  containerTypeList: any[] = [];
  blHistoryList: any[] = [];
  hideHistory: boolean = false;
  minDate: any = '';

  constructor(
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _blService: BlService,
    private _router: Router,
    private _coreTranslationService: CoreTranslationService
  ) { this._coreTranslationService.translate(english, hindi, arabic); }

  ngOnInit(): void {
    this.blForm = this._formBuilder.group({
      BLType: [true],
      BL_NO: [''],
      SRR_ID: [''],
      SRR_NO: [''],
      BOOKING_NO: [''],
      CRO_NO: [''],
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
      PREPAID_AT: ['', Validators.required],
      PAYABLE_AT: ['', Validators.required],
      BL_ISSUE_PLACE: ['', Validators.required],
      BL_ISSUE_DATE: ['', Validators.required],
      TOTAL_PREPAID: [0, Validators.required],
      NO_OF_ORIGINAL_BL: [0, Validators.required],
      BL_STATUS: [''],
      AGENT_CODE: [''],
      AGENT_NAME: [''],
      CREATED_BY: [''],
      CONTAINER_LIST: new FormArray([]),
      CONTAINER_LIST2: new FormArray([]),
    });
    this.minDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.getBLHistory();

  }

  get blf() {
    return this.blForm.controls;
  }

  getBLHistory() {
    this._commonService.destroyDT();
    this._blService.getBLHistory(localStorage.getItem('usercode')).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.blHistoryList = res.Data;
      }
      this._commonService.getDT();
    });
  }

  getBLForm() {

    if (this.previewTable.length == 0) {
      this._commonService.warnMsg("Please upload Shipping Instructions !");
      return;
    }

    this.hideHistory = true;
    this.editBL = false;
    this.blForm.patchValue(this.previewTable[0]);
    const add = this.blForm.get('CONTAINER_LIST2') as FormArray;

    add.clear();
    this.containerList.forEach((element) => {
      add.push(
        this._formBuilder.group({
          CONTAINER_NO: [element.CONTAINER_NO],
          CONTAINER_TYPE: [element.CONTAINER_TYPE],
          CONTAINER_SIZE: [element.CONTAINER_SIZE],
          SEAL_NO: [element.SEAL_NO],
          GROSS_WEIGHT: [element.GROSS_WEIGHT],
          MEASUREMENT: [element.MEASUREMENT.toString()],
          AGENT_SEAL_NO: [element.AGENT_SEAL_NO]
        })
      );
    });

    this.isBLForm = true;
    this.isSplit = false;

    this.blForm.get('TOTAL_CONTAINERS')?.setValue(this.containerList.length);
    this.blForm.get('BL_ISSUE_DATE')?.setValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
    var bl = new Bl();
    bl.AGENT_CODE = localStorage.getItem('usercode');
    bl.BL_NO = this.isSplit ? this.blNo : '';
    bl.BOOKING_NO = !this.isSplit ? this.blForm.get('BOOKING_NO')?.value : '';

    this._blService.getSRRDetails(bl).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.blForm.get('SRR_ID')?.setValue(res.Data.ID);
        this.blForm.get('SRR_NO')?.setValue(res.Data.SRR_NO);

        this.chargeList = res.Data.SRR_RATES;
      }
    });
  }

  updateBL() {
    debugger;
    this.submitted = true;
    console.log(JSON.stringify(this.blForm.value));
    if (this.blForm.invalid) {
      return;
    }

    var bltypevalue = this.blForm.get('BLType')?.value;
    this.blForm.get('BLType')?.setValue(bltypevalue ? 'Original' : 'Draft');
    this.blForm.get('BL_STATUS')?.setValue(bltypevalue ? 'Finalized' : 'Drafted');

    var voyageNo = this.blForm.get('VOYAGE_NO')?.value;
    this.blForm.get('VOYAGE_NO')?.setValue(voyageNo.toString());

    console.log(JSON.stringify(this.blForm.value));
    this._blService
      .updateBL(JSON.stringify(this.blForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this._commonService.successMsg("BL updated Successfully");

          this.getBLHistory();
          this.tabs = '1';
          this.isBLForm = false;
          this.hideHistory = false;

          //this.ContainerDescription();
          this.generateBLPdf();

        }
      });

  }
  createBL() {
    debugger;
    this.submitted = true;
    if (this.blForm.invalid) {
      return;
    }
    this.editBL = false;

    // if (this.isSplit) {
    //   this.blForm.get('BL_NO')?.setValue(this.blNo + '-1');
    // } else {
    //   this.blForm.get('BL_NO')?.setValue(this.getRandomNumber());
    // }

    this.blForm.get('BL_NO')?.setValue(this.getRandomNumber());
    var bltypevalue = this.blForm.get('BLType')?.value;
    this.blForm.get('BLType')?.setValue(bltypevalue ? 'Original' : 'Draft');
    this.blForm.get('BL_STATUS')?.setValue(bltypevalue ? 'Finalized' : 'Drafted');

    var voyageNo = this.blForm.get('VOYAGE_NO')?.value;
    this.blForm.get('VOYAGE_NO')?.setValue(voyageNo.toString());

    var noBL = this.blForm.get('NO_OF_ORIGINAL_BL')?.value;
    this.blForm.get('NO_OF_ORIGINAL_BL')?.setValue(noBL.toString());

    this.blForm.get('AGENT_CODE')?.setValue(localStorage.getItem('usercode'));
    this.blForm.get('AGENT_NAME')?.setValue(localStorage.getItem('username'));
    this.blForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    if (!this.isSplit) {
      const add = this.blForm.get('CONTAINER_LIST2') as FormArray;
      const add1 = this.blForm.get('CONTAINER_LIST') as FormArray;

      add.controls.forEach((control) => {
        add1.push(control);
      });
    }
    if (this.isSplit) {
      const add = this.blForm.get('CONTAINER_LIST') as FormArray;
      if (add.length <= 0) {
        this._commonService.warnMsg("Please select atleast one container to split BL");
        return;
      }
      console.log("MY cont list:", JSON.stringify(this.blForm.get('CONTAINER_LIST')?.value));

    }
    var bl = new Bl();
    bl.AGENT_CODE = localStorage.getItem('usercode');
    bl.BL_NO = this.isSplit ? this.blNo : '';
    bl.BOOKING_NO = !this.isSplit ? this.blForm.get('BOOKING_NO')?.value : '';

    console.log(JSON.stringify(this.blForm.value));
    this._blService.getSRRDetails(bl).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.blForm.get('SRR_ID')?.setValue(res.Data.ID);
        this.blForm.get('SRR_NO')?.setValue(res.Data.SRR_NO);
        console.log(this.blForm.get('SRR_ID')?.value);
        console.log(this.blForm.get('SRR_NO')?.value);

        this._blService
          .createBL(JSON.stringify(this.blForm.value))
          .subscribe((res: any) => {
            if (res.responseCode == 200) {
              //this._router.navigateByUrl('/home/new-bl');
              this._commonService.successMsg("BL created Successfully");
              this.getBLHistory();
              this.tabs = '1';
              this.isBLForm = false;
              this.hideHistory = false;

              //this.ContainerDescription();
              this.generateBLPdf();

            }
          });
        //this.ContainerDescription();
      }
    });




  }

  getBLDetailsForEdit(BLNO: any) {
    this.hideHistory = true;
    this.editBL = true;

    var BL = new Bl();
    BL.AGENT_CODE = localStorage.getItem('usercode');
    BL.BL_NO = BLNO;

    this._blService.getBLDetails(BL).subscribe((res: any) => {
      this.blForm.patchValue(res.Data);

      this.blForm.get('BL_ISSUE_DATE')?.setValue(formatDate(this.blForm.get('BL_ISSUE_DATE')?.value, 'yyyy-MM-dd', 'en'));
      var contList: any[] = res.Data.CONTAINER_LIST;

      const add = this.blForm.get('CONTAINER_LIST2') as FormArray;

      add.clear();
      contList.forEach((element) => {
        add.push(
          this._formBuilder.group({
            CONTAINER_NO: [element.CONTAINER_NO],
            CONTAINER_TYPE: [element.CONTAINER_TYPE],
            CONTAINER_SIZE: [element.CONTAINER_SIZE],
            SEAL_NO: [element.SEAL_NO],
            AGENT_SEAL_NO: [element.SEAL_NO],
            GROSS_WEIGHT: [element.GROSS_WEIGHT],
            MEASUREMENT: [element.MEASUREMENT?.toString()],
          })
        );
      });

      this.isBLForm = true;
      this.isSplit = false;

      this.blForm.get('TOTAL_CONTAINERS')?.setValue(contList.length);
      this.blForm.get('MARKS_NOS')?.setValue(contList[0]?.MARKS_NOS);
      this.blForm.get('DESC_OF_GOODS')?.setValue(contList[0]?.DESC_OF_GOODS);
      console.log("edit bl:" + JSON.stringify(this.blForm.value));
      var bl = new Bl();
      bl.AGENT_CODE = localStorage.getItem('usercode');
      bl.BL_NO = this.isSplit ? BLNO : '';
      bl.BOOKING_NO = !this.isSplit ? this.blForm.get('BOOKING_NO')?.value : '';

      this._blService.getSRRDetails(bl).subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.blForm.get('SRR_ID')?.setValue(res.Data.ID);
          this.blForm.get('SRR_NO')?.setValue(res.Data.SRR_NO);

          this.chargeList = res.Data.SRR_RATES;
        }
      });
    });


  }

  getBLDetails() {
    this.editBL = false;
    var BL = new Bl();
    BL.AGENT_CODE = localStorage.getItem('usercode');
    BL.BL_NO = this.blNo;

    this._blService.getBLDetails(BL).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        // this.hideHistory=true;
        this.blForm.patchValue(res.Data);
        if (this.blForm.get('BL_STATUS')?.value == 'Drafted') {
          this._commonService.warnMsg("Drafted BL cannot be Split!");
          return;
        }
        this.blForm.get('BL_ISSUE_DATE')?.setValue(formatDate(this.blForm.get('BL_ISSUE_DATE')?.value, 'yyyy-MM-dd', 'en'));
        var contList: any[] = res.Data.CONTAINER_LIST;

        if (contList.length == 1) {
          this._commonService.warnMsg("BL with one container can't be split!");
          return;
        }

        const add = this.blForm.get('CONTAINER_LIST2') as FormArray;

        add.clear();
        contList.forEach((element) => {
          add.push(
            this._formBuilder.group({
              CONTAINER_NO: [element.CONTAINER_NO],
              CONTAINER_TYPE: [element.CONTAINER_TYPE],
              CONTAINER_SIZE: [element.CONTAINER_SIZE],
              SEAL_NO: [element.SEAL_NO],
              AGENT_SEAL_NO: [element.SEAL_NO],
              GROSS_WEIGHT: [element.GROSS_WEIGHT],
              MEASUREMENT: [element.MEASUREMENT?.toString()],
            })
          );
        });

        this.isBLForm = true;
        this.isSplit = true;

        this.blForm.get('TOTAL_CONTAINERS')?.setValue(contList.length);
        this.blForm.get('MARKS_NOS')?.setValue(contList[0]?.MARKS_NOS);
        this.blForm.get('DESC_OF_GOODS')?.setValue(contList[0]?.DESC_OF_GOODS);
        var bl = new Bl();
        bl.AGENT_CODE = localStorage.getItem('usercode');
        bl.BL_NO = this.isSplit ? this.blNo : '';
        bl.BOOKING_NO = !this.isSplit ? this.blForm.get('BOOKING_NO')?.value : '';

        this._blService.getSRRDetails(bl).subscribe((res: any) => {
          if (res.ResponseCode == 200) {
            this.blForm.get('SRR_ID')?.setValue(res.Data.ID);
            this.blForm.get('SRR_NO')?.setValue(res.Data.SRR_NO);

            this.chargeList = res.Data.SRR_RATES;
          }
        });
        this.hideHistory = true;

      }
      else if (res.ResponseCode == 500) {
        this._commonService.errorMsg("Sorry, the specified BL No. doesn't exist! Try entering an existing BL No. to split");
      }
    });
  }

  get f() {
    var c = this.blForm.get('CONTAINER_LIST2') as FormArray;
    return c.controls;
  }

  getf1(i: any) {
    return i;
  }

  getRandomNumber() {
    var num = Math.floor(Math.random() * 1e16).toString();
    return 'BL' + num;
  }

  getContainerList(item: any, event: any, index: number) {
    if (item == 1) {
      const add = this.blForm.get('CONTAINER_LIST2') as FormArray;
      const add1 = this.blForm.get('CONTAINER_LIST') as FormArray;

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
      const add = this.blForm.get('CONTAINER_LIST') as FormArray;
      if (event.target.checked) {
        add.push(item);
      } else {
        // add.removeAt(index);
        add.removeAt(
          add.value.findIndex(
            (m: { CONTAINER_NO: any }) =>
              m.CONTAINER_NO === item.value.CONTAINER_NO
          )
        );
      }
    }
  }

  onFileChange(ev: any) {
    let workBook: any = null;
    let jsonData = null;
    const reader = new FileReader();
    var file = ev.target.files[0];

    var extension = file.name.split('.').pop();
    var array = ['csv', 'xls', 'xlsx'];

    debugger;
    if (
      ev.target.files[0].type ==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
    } else {
      this._commonService.warnMsg("Please Select Excel Format only");
      return;
    }

    if (file.size > 5000000) {
      this._commonService.warnMsg("Please upload file less than 5 mb..!");
      return;
    } else {
      var el = array.find((a) => a.includes(extension));

      if (el != null && el != '') {
        reader.onload = (event) => {
          debugger;
          const data = reader.result;
          workBook = XLSX.read(data, { type: 'binary', cellDates: true });

          if (workBook.SheetNames[0] != 'Sheet1') {
            this._commonService.warnMsg("Invalid File !");
            return;
          }

          jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
            const sheet = workBook.Sheets[name];
            initial[name] = XLSX.utils.sheet_to_json(sheet);
            return initial;
          }, {});

          const dataString = JSON.stringify(jsonData);

          var keyArray = [
            'BOOKING_NO',
            'CRO_NO',
            'SHIPPER',
            'SHIPPER_ADDRESS',
            'CONSIGNEE',
            'CONSIGNEE_ADDRESS',
            'NOTIFY_PARTY',
            'PRE_CARRIAGE_BY',
            'PLACE_OF_RECEIPT',
            'VESSEL_NAME',
            'VOYAGE_NO',
            'PORT_OF_LOADING',
            'PORT_OF_DISCHARGE',
            'PLACE_OF_DELIVERY',
            'FINAL_DESTINATION',
            'NOTIFY_PARTY_ADDRESS',
            'MERCHANT_REFERENCE_NO',
            'MARKS_NOS',
            'DESC_OF_GOODS',
          ];

          var keyArray1 = [
            'CONTAINER_NO',
            'CONTAINER_TYPE',
            'CONTAINER_SIZE',
            'SEAL_NO',
            'GROSS_WEIGHT',
            'MEASUREMENT',
            'AGENT_SEAL_NO'
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
                  element.NOTIFY_PARTY,
                  element.PRE_CARRIAGE_BY,
                  element.PLACE_OF_RECEIPT,
                  element.VESSEL_NAME,
                  element.VOYAGE_NO,
                  element.PORT_OF_LOADING,
                  element.PORT_OF_DISCHARGE,
                  element.PLACE_OF_DELIVERY,
                  element.FINAL_DESTINATION,
                  element.NOTIFY_PARTY_ADDRESS,
                  element.MERCHANT_REFERENCE_NO,
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
                  element.CONTAINER_SIZE,
                  element.SEAL_NO,
                  element.GROSS_WEIGHT,
                  element.MEASUREMENT,
                  element.AGENT_SEAL_NO
                ])
              ) {
                isValid = false;
              }
            });

            if (isValid) {
              this.previewTable = this.previewTable.filter(
                (v, i, a) =>
                  a.findIndex(
                    (v2) => JSON.stringify(v2) === JSON.stringify(v)
                  ) === i
              );

              this.containerList = this.containerList.filter(
                (v, i, a) =>
                  a.findIndex(
                    (v2) => JSON.stringify(v2) === JSON.stringify(v)
                  ) === i
              );

              this.onUpload = true;
            } else {
              this._commonService.warnMsg("Incorrect data!");
            }
          } else {
            this._commonService.warnMsg("Invalid file !");
          }
        };
        reader.readAsBinaryString(file);
      } else {
        this._commonService.warnMsg("Only .xlsx or .csv files allowed");
      }
    }
  }

  containsObject(obj: any, list: any) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (JSON.stringify(list[i]) == JSON.stringify(obj)) {
        return true;
      }
    }

    return false;
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

  viewBL(BLNO: any) {
    var BL = new Bl();
    BL.AGENT_CODE = localStorage.getItem('usercode');
    BL.BL_NO = BLNO;

    this._blService.getBLDetails(BL).subscribe((res: any) => {
      this.blForm.patchValue(res.Data);
      console.log("BL FORM", JSON.stringify(this.blForm.value));

      var contList: any[] = res.Data.CONTAINER_LIST;

      const add = this.blForm.get('CONTAINER_LIST2') as FormArray;

      add.clear();
      contList.forEach((element) => {
        add.push(
          this._formBuilder.group({
            CONTAINER_NO: [element.CONTAINER_NO],
            CONTAINER_TYPE: [element.CONTAINER_TYPE],
            CONTAINER_SIZE: [element.CONTAINER_SIZE],
            SEAL_NO: [element.SEAL_NO],
            MARKS_NOS: [element.MARKS_NOS],
            DESC_OF_GOODS: [element.DESC_OF_GOODS],
            GROSS_WEIGHT: [element.GROSS_WEIGHT],
            MEASUREMENT: [element.MEASUREMENT?.toString()],
          })
        );
      });
      if(this.blForm.get('BL_STATUS')?.value=='Finalized'){
        this.blForm.get('BLType')?.setValue('Original');
      }
      else{
        this.blForm.get('BLType')?.setValue('Draft');
      }
      this.generateBLPdf();
      //this.ContainerDescription();
    });

  }

  ContainerDescription() {
    debugger;
    console.log("within container desc");
    this._commonService
      .getDropdownData('CONTAINER_TYPE')
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.allContainerType = res.Data;

          this.containerTypeList = [];
          this.allContainerType.map((x) => {
            if (this.containerList.some((y) => y.CONTAINER_TYPE === x.CODE)) {
              this.containerTypeList.push(
                this.containerList.filter((y) => y.CONTAINER_TYPE === x.CODE)
              );
            }
          });
          this.generateBLPdf();
        }
      });
  }

  async generateBLPdf() {
    if (this.isSplit) {
      const add = this.blForm.get('CONTAINER_LIST') as FormArray;
      this.ContainerList1 = [];
      this.ContainerList1.push(add.value);
      this.ContainerList1 = this.ContainerList1.flat();
    }
    else {
      const add1 = this.blForm.get('CONTAINER_LIST2') as FormArray;
      this.ContainerList1 = [];
      this.ContainerList1.push(add1.value);
      this.ContainerList1 = this.ContainerList1.flat();

    }
    let docDefinition = {
      pageMargins: [40, 20, 40, 20],

      content: [

        {
          columns: [
            [
              {
                text: '______________________________________________',
              },
              {
                text: 'Shipper',
                bold: true,
                fontSize: 9,
                margin: [0, 2, 0, 0],

              },
              { text: this.blForm.value.SHIPPER.toUpperCase(), fontSize: 7 },
              {
                text: this.blForm.value.SHIPPER_ADDRESS.toUpperCase(),
                fontSize: 7,
                margin: [0, 0, 0, 15],
              },
              {
                text: '______________________________________________',
              },
              {
                text: 'Consignee',
                bold: true,
                fontSize: 9,
                margin: [0, 2, 0, 0],
              },
              { text: this.blForm.value.CONSIGNEE.toUpperCase(), fontSize: 7 },
              {
                text: this.blForm.value.CONSIGNEE_ADDRESS.toUpperCase(),
                fontSize: 7,
                margin: [0, 0, 0, 15],
              },
              {
                text: '______________________________________________',
              },
              {
                text: 'Notify Party',
                bold: true,
                fontSize: 9,
                margin: [0, 2, 0, 0],
              },
              {
                text: this.blForm.value.NOTIFY_PARTY.toUpperCase(),
                fontSize: 7,
                margin: [0, 0, 0, 15],
              },
              {
                text: '______________________________________________',
              },
              {
                columns: [
                  [
                    {
                      text: 'Pre Carriage By',
                      bold: true,
                      fontSize: 9,
                      margin: [0, 2, 0, 0],
                    },
                    {
                      text: this.blForm.value.PRE_CARRIAGE_BY.toUpperCase(),
                      fontSize: 7,
                    },
                  ],
                  [
                    {
                      text: '|     Place of Receipt',
                      bold: true,
                      fontSize: 9,
                      margin: [0, 2, 0, 0],
                    },
                    {
                      text: this.blForm.value.PLACE_OF_RECEIPT.toUpperCase(),
                      fontSize: 7,
                      margin: [13, 0, 0, 0],
                    },
                  ],
                ],
              },
              {
                text: '______________________________________________',
              },
              {
                columns: [
                  [
                    {
                      text: 'Ocean Vessel/Voy No.',
                      bold: true,
                      fontSize: 9,
                      margin: [0, 2, 0, 0],
                    },
                    {
                      text:
                        this.blForm.value.VESSEL_NAME.toUpperCase() +
                        '/' +
                        this.blForm.value.VOYAGE_NO.toUpperCase(),
                      fontSize: 7,
                    },
                  ],
                  [
                    {
                      text: '|     Port of Loading',
                      bold: true,
                      fontSize: 9,
                      margin: [0, 2, 0, 0],
                    },
                    {
                      text: this.blForm.value.PORT_OF_LOADING.toUpperCase(),
                      fontSize: 7,
                      margin: [13, 0, 0, 0],
                    },
                  ],
                ],
              },
              // {
              //   text: '______________________________________________',
              // },
              // {
              //   columns: [
              //     [
              //       {
              //         text: 'Port Of Discharge',
              //         bold: true,
              //         fontSize: 10,
              //         margin: [0, 2, 0, 0],
              //       },
              //       {
              //         text: this.blForm.value.PORT_OF_DISCHARGE.toUpperCase(),
              //         fontSize: 9,
              //         margin: [0, 0, 0, 20],
              //       },
              //     ],
              //     [
              //       {
              //         text: 'Place of Delivery',
              //         bold: true,
              //         fontSize: 10,
              //         margin: [0, 2, 0, 0],
              //       },
              //       {
              //         text: this.blForm.value.PLACE_OF_DELIVERY.toUpperCase(),
              //         fontSize: 9,
              //         margin: [0, 0, 0, 20],
              //       },
              //     ],
              //   ],
              // },
            ],

            [
              {
                text: 'B/L No. ' + this.blForm.value.BL_NO.toUpperCase(),
                alignment: 'right',
                fontSize: 8,
                margin: [0, 0, 0, 5],
              },
              {
                image: await this._commonService.getBase64ImageFromURL(
                  'assets/img/logo_p.png'
                ),
                alignment: 'center',
                height: 50,
                width: 90,
                margin: [0, 0, 0, 10],
              },
              {
                text: 'BILL OF LADING',
                bold: true,
                fontSize: 15,
                alignment: 'center',
              },
              {
                text:
                  'Received by the Carrier from the shipper in apparent good order and condition, unless otherwise indicated ' +
                  'herein the Goods or the container(s) or package (s) said to be contain the cargo herein mentioned to be carried subject to all the terms and conditions ' +
                  'appearing on the face and back of the Bill of Lading by vessel named herein or any substitute at the Carriers ' +
                  'option and or other means of transport from the place of receipt or the port of loading to the port of discharge or ' +
                  'the place of delivery shown herein and there to be delivered unto order or assigns. If ' +
                  'required by the Carrier, the Bill of Lading duly endorsed must be surrendered in exchange for the ' +
                  'Goods or delivery order,',
                alignment: 'left',
                fontSize: 7,
              },
              {
                text:
                  'In accepting the Bill of Lading, the Merchant agrees to be bound by all the stipulations ' +
                  'exceptions, terms and conditions on the face and back hereoff, whether wriiten,typed,stamped ' +
                  'or printed as fully as if signed by the Merchant, any local custom or priviledge to the ' +
                  'contrary notwithstanding and agrees that all agreements or freight engagements for and in ' +
                  'connection with the carriage of the Goods are superseded by the Bill of Lading ',
                alignment: 'left',
                fontSize: 7,
              },
              {
                text:
                  'In witness whereof the undersigned, on behalf of Prime Maritime the Master and the owner of ' +
                  'the Vessel, has signed the no of Bill(s) of Lading stated below all of this tenor and date, ' +
                  'one of which being accomplished, the others to stand void. ',
                alignment: 'left',
                fontSize: 7,
              },

              // {
              //   text: '______________________________________________',
              // },
            ],
          ],

        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1 },
          ],
          margin: [0, 10, 0, 0],
        },
        {
          columns: [
            [
              {
                text: 'Port Of Discharge',
                bold: true,
                fontSize: 9,
                margin: [0, 2, 0, 0],
                width: 10
              },
              {
                text: this.blForm.value.PORT_OF_DISCHARGE.toUpperCase(),
                fontSize: 7,
                margin: [0, 0, 0, 20],
                width: 10
              },


            ],
            // {
            //   canvas: [
            //     { type: 'line', x1: 0, y1: 15, x2: 0, y2: 0, lineWidth: 1 },
            //   ],
            //   margin: [0, 0, 0, 0],

            // },
            [
              {
                text: '|      Place of Delivery',
                bold: true,
                fontSize: 9,
                margin: [0, 2, 0, 0],
              },
              {
                text: this.blForm.value.PLACE_OF_DELIVERY.toUpperCase(),
                fontSize: 7,
                margin: [17, 0, 80, 20],
              },
            ],
            [
              { text: '', fontSize: 8 },
            ],
            [
              {
                text: "|*Final Destination (for the Merchant" + "'s ref.)",
                bold: true,
                fontSize: 8,
                margin: [20, 2, 0, 0],
              },
              {
                text: this.blForm.value.FINAL_DESTINATION.toUpperCase(),
                fontSize: 7,
                margin: [25, 2, 0, 0],
              },

            ],


          ],

        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1 },
          ],
          margin: [0, 0, 0, 0],
        },
        {
          table: {
            headerRows: 1,
            heights: [15, 15, 15, 15, 15, 15, 15, 15, 15],
            body: [
              [
                {
                  text: 'Container No.',
                  fontSize: 8,
                  bold: true,
                  heights: 3,
                },
                {
                  text: 'Seal No.\nMarks and Numbers',
                  fontSize: 8,
                  bold: true,
                  heights: 3,
                },
                {
                  text: 'No. of Contai-\nners or pkgs.',
                  fontSize: 8,
                  bold: true,
                  heights: 3,
                },
                {
                  text: 'Kind of packages; description fo goods',
                  fontSize: 8,
                  bold: true,
                  heights: 3,
                },
                { text: 'Gross Weight', fontSize: 9, bold: true, heights: 3, },
                { text: 'Measurement', fontSize: 9, bold: true, heights: 3, },

              ],
              ...this.ContainerList1.slice(Math.max(this.ContainerList1.length - 5, 0)).map((p: any) => [
                { text: p.CONTAINER_NO, fontSize: 9 },
                { text: p.SEAL_NO + '-' + p.MARKS_NOS, fontSize: 9 },
                { text: '   -', fontSize: 9 },
                { text: p.DESC_OF_GOODS, fontSize: 9 },
                { text: p.GROSS_WEIGHT, fontSize: 9 },
                { text: p.MEASUREMENT, fontSize: 9 },

              ]),
              [{ text: ' ', fontSize: 9 }, { text: ' ', fontSize: 9 }, { text: ' ', fontSize: 9 }, { text: ' ', fontSize: 9 }, { text: ' ', fontSize: 9 }, { text: ' ', fontSize: 9 }],
              [{ text: '', fontSize: 9 }, { text: '', fontSize: 9 }, { text: '', fontSize: 9 }, { text: '', fontSize: 9 }, { text: '', fontSize: 9 }, { text: '', fontSize: 9 }],
              [{ text: '', fontSize: 9 }, { text: '', fontSize: 9 }, { text: '', fontSize: 9 }, { text: '', fontSize: 9 }, { text: '', fontSize: 9 }, { text: '', fontSize: 9 }],
              [{ text: '', fontSize: 9 }, { text: '', fontSize: 9 }, { text: '', fontSize: 9 }, { text: '', fontSize: 9 }, { text: '', fontSize: 9 }, { text: '', fontSize: 9 }],
            ],
          },
          layout: {
            hLineWidth: function (i: any, node: any) {
              return 0;
            },
            vLineWidth: function (i: any, node: any) {
              return i === 0 || i === node.table.widths.length ? 0 : 1;
            },
            hLineColor: function (i: any, node: any) {
              return '';
            },
            vLineColor: function (i: any, node: any) {
              return '';
            },
            hLineStyle: function (i: any, node: any) {
              return 0;
            },
            vLineStyle: function (i: any, node: any) {
              return { dash: { length: 4 } };
            },

          },
        },
        {
          text: 'Total No. of Containers\nor Packages (in words)  ' + this.containerList.length,
          bold: true,
          fontSize: 8,
          margin: [0, 20, 0, 3],
        },
        // { text: this.containerList.length, fontSize: 9 },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1 },
          ],
          margin: [0, 0, 0, 0],
        },
        {
          table: {
            heights: 15,
            headerRows: 1,
            widths: [140, '*', 95, '*', '*'],
            body: [
              [
                { text: 'Freight and Charges', fontSize: 8, bold: true },
                { text: 'Revenue Tons', fontSize: 8, bold: true },
                { text: 'Rate                 Per', fontSize: 8, bold: true },
                { text: 'Prepaid', fontSize: 8, bold: true },
                { text: 'Collect', fontSize: 8, bold: true },
              ],
              ['', '', '', '', ''],
              ['', '', '', '', ''],
              ['', '', '', '', ''],
              ['', '', '', '', ''],
            ],
          },
          layout: {
            hLineWidth: function (i: any, node: any) {
              return 0;
            },
            vLineWidth: function (i: any, node: any) {
              return i === 0 || i === node.table.widths.length ? 0 : 1;
            },
            hLineColor: function (i: any, node: any) {
              return '';
            },
            vLineColor: function (i: any, node: any) {
              return '';
            },
            hLineStyle: function (i: any, node: any) {
              return 0;
            },
            vLineStyle: function (i: any, node: any) {
              return { dash: { length: 4 } };
            },
          },
        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1 },
          ],
          margin: [0, 0, 0, 0],
        },
        {
          // columns:[
          //   [
          //     [
            
          //       {
          //         width:20,
          //         table: {
          //           widths: [50],
          //           headerRows: 1,
          //           heights: 60,
          //           body: [
          //             [{text: 'Ex. Rate', fontSize: 8, bold: true }],
                      
          //           ],
                    
          //         },
  
          //       },
          //       {
          //         width:20,
          //         table: {
          //           //widths: [20, 20],
          //           headerRows: 1,
          //           heights: 30,
          //           body: [
          //             [
          //             { text: 'Prepaid at\n' + this.blForm.value.PREPAID_AT, fontSize: 8, bold: true },
          //             { text: 'Payable at\n' + this.blForm.value.PAYABLE_AT, fontSize: 8, bold: true }],
          //             [
          //             { text: 'Total prepaid in local currency\n' + this.blForm.value.TOTAL_PREPAID, fontSize: 8, bold: true },
          //             { text: 'No. of original B(s)/L\n' + this.blForm.value.NO_OF_ORIGINAL_BL, fontSize: 8, bold: true }],
          //           ],
          //         },
  
          //       },
  
          //     ],
              

          //   ],
          //   [
          //     {
          //       text: 'Place and date of issue\n' + this.blForm.value.BL_ISSUE_PLACE + '-' + formatDate(this.blForm.value.BL_ISSUE_DATE, 'yyyy-MM-dd', 'en'),
          //       bold: true,
          //       fontSize: 8,
          //       margin: [2, 2, 0, 0],
          //       width:5,
          //     },


          //   ]
          // ],
          columns:[
            {
              table: {
                widths: [50,270],
                headerRows: 1,
                heights: 30,
                body: [
                  [{text: 'Ex. Rate', fontSize: 8, bold: true },
                  {
                    //layout: 'noBorders',
                    layout:'headerLineOnly',
                    table: {
                      widths: [125, 125],
                      headerRows: 1,
                      heights: 30,
                      body: [
                        [
                        { text: 'Prepaid at\n' + this.blForm.value.PREPAID_AT, fontSize: 8, bold: true },
                        { text: 'Payable at\n' + this.blForm.value.PAYABLE_AT, fontSize: 8, bold: true }],
                        [
                        { text: 'Total prepaid in local currency\n' + this.blForm.value.TOTAL_PREPAID, fontSize: 8, bold: true },
                        { text: 'No. of original B(s)/L\n' + this.blForm.value.NO_OF_ORIGINAL_BL, fontSize: 8, bold: true }],
                      ],
                    },

                  }
                   
                  ],
                  
                  
                ],
              },
              

            },
            // [
            //   {
            //     table: {
            //       widths: [50],
            //       headerRows: 1,
            //       heights: 60,
            //       body: [
            //         [{text: 'Ex. Rate', fontSize: 8, bold: true }],

                    
            //       ],
            //     },

            //   },
            // ],
            
            [

              {
                text: 'Place and date of issue\n' + this.blForm.value.BL_ISSUE_PLACE + '-' + formatDate(this.blForm.value.BL_ISSUE_DATE, 'yyyy-MM-dd', 'en'),
                bold: true,
                fontSize: 8,
                margin: [2, 2, 0, 0],
                width:10,
              },

            ]
            
            

          ]
          

        },
        // {
        //   columns: [
        //     [
        //       {
        //         text: 'Ex. Rate',
        //         bold: true,
        //         fontSize: 8,
        //         margin: [0, 5, 0, 0],
        //       },
        //       { text: '', fontSize: 8 },
        //     ],
        //     [
        //       {
        //         text: 'Prepaid at',
        //         bold: true,
        //         fontSize: 8,
        //         margin: [0, 5, 0, 0],
        //       },
        //       { text: this.blForm.value.PREPAID_AT, fontSize: 8 },
        //     ],
        //     [
        //       {
        //         text: 'Payable at',
        //         bold: true,
        //         fontSize: 8,
        //         margin: [0, 5, 0, 0],
        //       },
        //       { text: this.blForm.value.PAYABLE_AT, fontSize: 8 },
        //     ],
        //     [
        //       {
        //         text: 'Place and date of issue',
        //         bold: true,
        //         fontSize: 8,
        //         margin: [0, 5, 0, 0],
        //       },
        //       {
        //         text:
        //           this.blForm.value.BL_ISSUE_PLACE +
        //           '-' +
        //           formatDate(this.blForm.value.BL_ISSUE_DATE, 'yyyy-MM-dd', 'en'),
        //         fontSize: 8,
        //       },
        //     ],
        //   ],
        // },
        // {
        //   text: '______________________________________________________________________________________________',
        // },
        // {
        //   columns: [
        //     [
        //       {
        //         text: 'Total Prepaid',
        //         bold: true,
        //         fontSize: 8,
        //         margin: [0, 5, 0, 0],
        //       },
        //       {
        //         text: this.blForm.value.TOTAL_PREPAID + 'INR (currency)',
        //         fontSize: 8,
        //       },
        //     ],
        //     [
        //       {
        //         text: 'No of Original B(s)/L',
        //         bold: true,
        //         fontSize: 8,
        //         margin: [0, 5, 0, 0],
        //       },
        //       { text: this.blForm.value.NO_OF_ORIGINAL_BL, fontSize: 8 },
        //     ],
        //     [
        //       {
        //         text: '',
        //         bold: true,
        //         fontSize: 10,
        //         margin: [0, 5, 0, 0],
        //       },
        //       { text: '', fontSize: 9 },
        //     ],
        //     [
        //       {
        //         text: '',
        //         bold: true,
        //         fontSize: 10,
        //         margin: [0, 5, 0, 0],
        //       },
        //       { text: '', fontSize: 9 },
        //     ],
        //   ],
        // },
        // {
        //   text: '______________________________________________________________________________________________',
        //   margin: [0, 0, 0, 20],
        // },
        {
          columns: [
            [
              {
                text: 'SHIPPED on board the Vessel',
                bold: true,
                fontSize: 8,
                margin: [0, 5, 0, 0],
              },
              { text: '', fontSize: 8 },
            ],
            [
              { text: '', fontSize: 8 },
            ],
            [
              {
                text: 'For PRIME MARITIME',
                bold: true,
                fontSize: 13,
                margin: [0, 5, 0, 15],
              },

            ],
          ],
        },
        {
          columns: [
            [
              {
                text: 'Date',
                bold: true,
                fontSize: 10,
                margin: [0, 5, 0, 0],
              },
              { text: '10/11/22', fontSize: 9 },
            ],
            [
              {
                text: 'By',
                bold: true,
                fontSize: 8,
                margin: [0, 5, 0, 0],
              },
              { text: '_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _', fontSize: 8 },
            ],
            [
              { text: 'As Agents for the carrier', fontSize: 8, margin: [0, 0, 0, 0], },
              { text: '_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _', fontSize: 8, margin: [0, 0, 0, 0] },
              { text: 'PRIME MARITIME DWC-LLC', fontSize: 10, margin: [0, 0, 0, 0], },

            ],
          ],
        },
        {
          columns: [
            [
              {
                text: this.blForm.get('BLType')?.value,
                bold: true,
                fontSize: 20,
                margin: [0, 5, 0, 0],
                color: '#f94449',
              },
            ],
          ],
        },
        {
          pageBreak: 'before',
          columns: [
            [
              {
                text: 'United Liner Shipping Services LLP',
                bold: true,
                fontSize: 10,
                margin: [180, 0, 0, 0],
              },
              {
                text: 'C/o Samudera Shipping Line (India) Pvt Ltd, 402, Rustomjee Aspiree,\nOff Eastern Express Highway,Sion East, Mumbai 400 022, Maharashtra, India',
                bold: false,
                fontSize: 7,
                margin: [150, 2, 0, 0],
              },
              {
                text: 'CIN :AAC-1451',
                bold: true,
                fontSize: 9,
                margin: [230, 3, 0, 0],
              },
              {
                text: 'State Code: 27 State Name :Maharashtra',
                bold: true,
                fontSize: 8,
                margin: [183, 3, 0, 0],
              },
              {
                text: 'GSTN Code :27AADFU8796Q1ZX',
                bold: true,
                fontSize: 8,
                margin: [200, 3, 0, 0],
              },
              {
                canvas: [
                  { type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1 },
                ],
                margin: [0, 10, 0, 0],
              },

              {
                //padding:[0,500,0,0],
                //style:'tableHeight',
                table: {
                  //heights: [15],
                  headerRows: 1,
                  body: [
                    [
                      {
                        text: 'Container No.',
                        fontSize: 8,
                        bold: true,
                      },
                      {
                        text: 'Seal No.\nMarks and Numbers',
                        fontSize: 8,
                        bold: true,
                      },
                      {
                        text: 'No. of Contai-\nners or pkgs.',
                        fontSize: 8,
                        bold: true,
                      },
                      {
                        text: 'Kind of packages; description fo goods',
                        fontSize: 8,
                        bold: true,
                      },
                      { text: 'Gross Weight', fontSize: 9, bold: true },
                      { text: 'Measurement', fontSize: 9, bold: true },

                    ],
                    // [{text:'M',fontSize:9},{text:'M',fontSize:9},{text:'M',fontSize:9},{text:'M',fontSize:9},{text:'M',fontSize:9},{text:'M',fontSize:9}],
                    // [{text:'M',fontSize:9},{text:'M',fontSize:9},{text:'M',fontSize:9},{text:'M',fontSize:9},{text:'M',fontSize:9},{text:'M',fontSize:9}],
                    // [{text:'M',fontSize:9},{text:'M',fontSize:9},{text:'M',fontSize:9},{text:'M',fontSize:9},{text:'M',fontSize:9},{text:'M',fontSize:9}],
                    // [{text:'M',fontSize:9},{text:'M',fontSize:9},{text:'M',fontSize:9},{text:'M',fontSize:9},{text:'M',fontSize:9},{text:'M',fontSize:9}],
                    ...this.ContainerList1.slice(5).map((p: any) => [
                      { text: p.CONTAINER_NO, fontSize: 9 },
                      { text: p.SEAL_NO + '-' + p.MARKS_NOS, fontSize: 9 },
                      { text: '   -', fontSize: 9 },
                      { text: p.DESC_OF_GOODS, fontSize: 9 },
                      { text: p.GROSS_WEIGHT, fontSize: 9 },
                      { text: p.MEASUREMENT, fontSize: 9 },

                    ]),
                    [{ text: ' ', fontSize: 9, heights: 140 }, { text: ' ', fontSize: 9, heights: 140 }, { text: ' ', fontSize: 9, heights: 140 }, { text: ' ', fontSize: 9, heights: 140 }, { text: ' ', fontSize: 9, heights: 140 }, { text: ' ', fontSize: 9, heights: 140 }],

                  ],
                },
                layout: {
                  hLineWidth: function (i: any, node: any) {
                    return 0;
                  },
                  vLineWidth: function (i: any, node: any) {
                    return i === 0 || i === node.table.widths.length ? 0 : 1;
                  },
                  hLineColor: function (i: any, node: any) {
                    return '';
                  },
                  vLineColor: function (i: any, node: any) {
                    return '';
                  },
                  hLineStyle: function (i: any, node: any) {
                    return 0;
                  },
                  vLineStyle: function (i: any, node: any) {
                    return { dash: { length: 4 } };
                  },
                },

              },

              {
                canvas: [
                  { type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1 },
                ],
                margin: [0, 0, 0, 0],
              },
              {
                columns: [
                  [
                    {
                      text: 'SHIPPED on board the Vessel',
                      bold: true,
                      fontSize: 8,
                      margin: [0, 5, 0, 0],
                    },
                    { text: '', fontSize: 8 },
                  ],
                  [
                    { text: '', fontSize: 8 },
                  ],
                  [
                    {
                      text: 'For PRIME MARITIME',
                      bold: true,
                      fontSize: 13,
                      margin: [0, 5, 0, 15],
                    },

                  ],
                ],
              },
              {
                columns: [
                  [
                    {
                      text: 'Date',
                      bold: true,
                      fontSize: 10,
                      margin: [0, 5, 0, 0],
                    },
                    { text: '10/11/22', fontSize: 9 },
                  ],
                  [
                    {
                      text: 'By',
                      bold: true,
                      fontSize: 8,
                      margin: [0, 5, 0, 0],
                    },
                    { text: '_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _', fontSize: 8 },
                  ],
                  [
                    { text: 'As Agents for the carrier', fontSize: 8, margin: [0, 0, 0, 0], },
                    { text: '_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _', fontSize: 8, margin: [0, 0, 0, 0] },
                    { text: 'PRIME MARITIME DWC-LLC', fontSize: 10, margin: [0, 0, 0, 0], },

                  ],
                ],
              },
            ],

          ],

        },
        {
          pageBreak: 'before',
          columns: [
            [
              {
                text:
                  '1. (@Befination) The following words both on the face and back hereo! have the meanings hereby assigned.\n' +
                  '(@ “Cartier” means, Prime Maritime and the Vessel and/or her owner\n' +
                  '© Includes the shipper, consi signee, owner oft rT ‘ofthis Blof Lading.\n' +
                  '(©) "Goods" means the cargo described on the face of this Bll of Lading and, ifthe cargo is packed into container(s) supplied or by or' +
                  '‘onbehalf ofthe merchantincludes the container(s) as well\n' +
                  '(@)__"Vesser"includes vessel ship, craft, tighter or other means of transport which is or shall be substituted in whole ori part, for vessel' +
                  'named onthe facenereot.\n' +
                  '2 ae Gime Paramount) (1) The Bl of acing sll have eect subject to the provalona fale to VI nctusve ote international Se of Aug ‘called the Hague Rules),\n' +
                  'Wich shel be doomed tobe Incorportedierin ard netting heres corained shales Seemed a Surrender by the carrier of any of the rights nod or immunities under the said Hague Rules,\n' +
                  'Th monetary us mardonod i th Hague Pulser this of Lach ae be kan be ofthe: ‘concemed (2)inso coming within the ‘or atthe place of Gelvery giving legal fore wth or without madlcation tothe sald Hague Rules, this Bil of Lacing isto have effect subject tothe sald provisions as ifthe said provisions were insetted herein verbatim, and if any stipulations herein shall wholy or in part contravene the said tcedneten ‘of Lading shall be read as ifthe said stipulations (but only the extent that k shall so contravene and no further) were el\n' +
                  '(Governing Law Jurisdiction) The contract evidenced by or contained in this Bill of Lading shal be governed by the law of Scape entay rote ne, ‘andany action thereunder shall be brought before the court of Singapore.\n' +
                  '4 ompftimaton Statutes) Nothing in is Bi of Lacing shal operate to tor daprve the Cae of any statutory protection of' +
                  'Sionptoncraneaten any autre y yap laaws, statutes or regulations of any countri' +
                  '5. (SubC Agents and The Carr ah to sub-' +
                  'contract on anyon whe oy pa ie fac Serge of carriage of the Goods and any and all duties whatsoever' +
                  'undertaken by the carrier in relating to the Goods. The merchants shallindemnify the Carrier against any claims which may be made upon' +
                  'the carrier by any servant agent or sub-contractor of the carrier in relation to the claim agents any such person made by the Merchant.' +
                  'Without prelsion to the forsgcing, Every such servant agent and sub-cortractor shal have the bene fall povsions erin forthe' +
                  '‘benefit otthe Carrier asi such provisions were expressly for their benefit, and it entering into this contract the Carrier, to the extent of those' +
                  'bonnet onyenh omberaauasom age archi reuctestneagsaninocotec' +
                  '&. 9 (Route of Transport () The Goods may atthe Cariors be' +
                  'by the vessel and or any other means of transport by and or ai and by any route whatsoever, whether oF not such Toutes he diet.' +
                  'siveraed cnt (2) The vena atl have Ina ala /o says pe) wheter echelon @) The Vessel' +
                  'shall have liberty to either with or without the goods on board, and before or after proceeding towards the port of discharge, adjust' +
                  'careaeree ae chs een Parana fake po ten iy doc apa vars rea tes lS or' +
                  'embrark or ke stores at cor without' +
                  'Pits ow orbe towed, an saver stmptto savelve ot propery (any actontaxen byte Caer unde sare shalbececmedto' +
                  'Included within the contractual carriage and such action or delay resulting there form shall not be deemed to be a deviation should be' +
                  '‘be held liable in respect of such action, the Carrier shall to the full benefit of ll rightand' +
                  'oe eiaes' +
                  '(Responsibility) (1) The Carrier shall not be responsible for loss of or damage to the Goods occurring before receipt of the Goods' +
                  'bynadariatine ducal cater part cadre hve neCara ane pertoldecargourpace tocar) ncasak' +
                  'Is estab shed by the Merchart, hal ioss of damage fo orn connecton wih the Goods occured ring the period om the recip bythe' +
                  'a ere eg ee eee eco inery the |' +
                  'ubjecto the thi of Lading such loss Yo Wihrespectio' +
                  'oss ordamage occurring during time to atthe port ofloading to' +
                  'they let the sea terminal at the portof discharge and also of dur roMoUs os subsoqusn perder canagsby comer nisnd' +
                  'water ways toe the extent prescribed by the Hague Rules as pi' +
                  'toga damage oczurng ung tehan dng storage ofcartage ote Goody asub-coiato or agen oth Carter oteeenta' +
                  'Which sue h subcontractor or agent woul the Merchant if he' +
                  'Marchant in oopect of such hening, storage ot carage' +
                  'Gontained athe Carers oftoes upon request ofthe Merchant of (i incase canntbe proveed where the Goods were when the 03s of' +
                  'damage occured, tho loss or damage shal be deemed to have occured ine Couse of carage by wat’ and the Carer shal be' +
                  'tesponsible to the extent prescribed by the Hague Rules. (3) Not withstanding Article 7. (2) hereof, the Carrier does unto undertake than' +
                  'the Goods be responsible for any direct or indirect loss or damage which is caused through delay (4) The column "Final Destination’ on' +
                  'the lace hereotis solely for and the Carriers ‘ofthe Goods case' +
                  'Stratis rh Sotbothepotoranowrporpecetcoey' +
                  '{Liberties (1) ary shuation whatsoever, whether of not esting or anttpated befor commencement or during the transport,' +
                  'Miichintho usgonentefte Carrier aching forthe purpose a his Atle any person charged wit the transport of sale keeping ofthe' +
                  'Goods) () has ver 01 fey esto danger iu oss clay or whatsoever nature tothe Vessel, avehicle, the' +
                  'Carrier any person, the goods commerce oF continus the faneport fo decharge pe Goods arihe port dscharge erie elven the' +
                  'Goods at the place of delivery by the route and in the manner originally intended by the Carrier, (a) at any time shall be entitled to unpack' +
                  'the container(s) or otherwise dispose of the Vessel, a vehicle or other means of transport at the place of receipt or port of loading shall be' +
                  '‘entitled to cancel the cor tract of carriage without compensation and to require the Merchant to take delivery of them and upto his failure to' +
                  'do 20, o warehouse or place them anywhere athe rik and tem stay place selected by the carat he dek and expense ofthe' +
                  'Merchant, and/or (ithe Goods are ioaded onthe Vessel, a vehicle or othe of 1ge, shall be entitledto' +
                  'od o any part thereo tay porto lace selected by te Cal her orto cary them back the pet of recep and (her echarse' +
                  'thom Any score ander (@ x (d above shal conse complete andl deiveryandul permarce of this contract, and the carrier' +
                  'thereatter be freed from any res hereunder' +
                  'viLictaor other means of transportwhether or not approaching enter inter the portof discharge orto reach the place ol.' +
                  '‘elivery or afempting or commencing to alecharge, shall be entited to discharge the Goods or any pat theteot at any por st place' +
                  'selected by the Carr orto cary hem backo the pot of lading or place of rsceptand (her lscharge ther. Ary actions under () oF (2)' +
                  'shal consttne complete and fral delvery and ful periormance of tis contract and the carrier thereafter be feed fom any' +
                  'feoponsblty Porunder (hf ator storage; Goshuge er ary clone aceotang wo the receding paragraph the Carler makes' +
                  'rrangementso Hore an or wanatip andor orward the Goods ti agree tat he sal oso as agent ony for anc atthe sole vak and' +
                  '‘expenses of the Merchant without any liability whatsoever in respect of such agency and the Merchant shall reimburse the courier' +
                  'forthwith upon demand all extra freight charges and extra expense thereby incurred (3) The stations referred to in paragraph (1) above' +
                  'shall include but shall not be limited to those cause by the existence of apprehension of war declared or undeciared hostilties warlke or' +
                  'boligerent acts o operations rots civi commotions or Sie ck cones nome oben a aoa aa OS' +
                  'place or interdict or of or ‘sanitary or other similar or' +
                  'Fark, lockouts or oper labour toutes whethe’ paral or general and wheter of not involving employees of the Carrier or his sub-' +
                  'delivery or other handling of the Goods, evidence or dischases; bad weather shallow water, ice, landship or other obstacles or labour or' +
                  '{acts for loading in navigation >nnavigaiono potter manera ets Spats , rival rune, pos cea, topp=0e,' +
                  'loading ‘or other ven by any' +
                  'department ied cry person mctig or sr ring 1 scl Wh abosty of it To ghe such onger Greco, reguatons,' +
                  '18. {Peak Cargo) 1) The Cary hasthe ight cary the goods in contane(s) under deck or on deck (2) when the Goods are earned' +
                  'ton deck, the Carer shal not be required to specaly no, mak of stamp an statements of Yon deck stowage on te face here, eny' +
                  'oriarynetwittanding. The Goods ao cared shal be sje io te Hague ules proved form Ace 2herectand' +
                  'the stowage of such goods that constiite under deck stowage all Purposes including general average.) The car shal not be' +
                  'liable in any capacity whatsoever for any non-delivery, misdelivery, and delay or loss or damage to the goods which are carried on deck' +
                  "‘and specially statedhereinto be so carried, whether or not caused by the carrier's negligence or the Vesse's unseaworthiness." +
                  '16. _ (Live Animals and Plants) The Carrier shall not be responsible for any accident, disease, mortality, loss or damage, to live' +
                  'animals, birds, reptiles and fish and plants arising or resulting from any cause whatsoever including the Carrier"s negligence or the' +
                  '‘unseaworthness, and shall have the benefit ofall the provisions of the Bllof Lading, except those inconsistent with the provisions' +
                  'ofthis Article.' +
                  '17. (Valuable Goods) The Carrier shall not be lable to any loss or damage to or in connection with platinum, gold, siNver, Jewellery,' +
                  'pris stones, precious neta, recciciopes, precios chemicals, Duin, sped currency negotiable numer, cuts, ei' +
                  'ing, d , works of art, curious, ‘of every nature or any other valuable goods whatso-' +
                  'eh ncn gone rng paricur va ce he rchar, une ewe rare and vate ihe goods hate been declared in' +
                  '‘wring by the Merchant before receipt of the Goods by the Carrier, and the sameis insertedin this Bill of Lading and ad valorem treighthas.' +
                  'soreness' +
                  '(Heavy Lit) (1) The weight ofa single pace of package exceeding 2.240 bs. gross must be declared by the Merchant in ving' +
                  'teins fost by must be marked clearly and durably on the outside of the plece or package in letters and figures not less' +
                  'than to inches high. @) in case ofthe Merchants fare n his obligations under the prooseding paragraph, the Cari shal not be' +
                  'tesponsible for any loss or damage to or in connection with the Goods, and at the same time the Merchant shall be liable for loss or' +
                  "damage to any property Injury arising as a resutt of the Merchant's said fallure and shall indemnity the Carrier against any kind of loss of" +
                  'liabilty suffered or incurred by the Cartier as a resuitof such failure.' +
                  '19. (Delivery by Marks) (1) The Carrier shall not be liable for failure of or delay in delivery in accordance with marks unless such marks' +
                  'shal have been clearly and Gurebly stamped or marked upon the Goods, package(s) and Coniainera) by the Merchant before thy are' +
                  'by the Carrier in letters and numbers not less than two inches high, together with names of the port of discharge and place of' +
                  'sei, (2) In no circumstances shall the carrier be responsible for delivery in accordance with other than leading The' +
                  'chant warrantto the carrier that the marks on the Goods, ‘and Container(s) correspondito the marks snewn on this Billo' +
                  'Liang and asolnal eopecs compl whales and rguatonetnctcea ne porto echargor place of Solver and shalom' +
                  '‘the Carrier against al loss, damage, expense, penalties and fines arising or resulting from incorreotness or incompleteness thereot. (4)' +
                  'gods which cannot be dented a to marks and numbers, cargo eweeping, Equi eskive and ioe unclaimed goods not oberwise' +
                  'for shall be {forthe very to proportions' +
                  'toany apparent shorage oss ofweightor Samage, anc such goose pars thereat shallbeaccopser asta andcompleteceivery' +
                  '20. (Delivery) (1) The Carrier shall have the right to deliver the goods at any time from or at the Vessels side, custom-house,' +
                  'Warehouse, whart,quay or any other place designated by the Carer wifin the goographiclimis ofthe portot discharge pace of delivery' +
                  "‘shown on the face hereot. (?.) In any case the Carrier's responsibilty shall cease when the Goods have been delivered to the Merchant or" +
                  'inland carers orany the! person ented to recslve ie © goods on his beha atthe place designated bythe Caer Delivery ofthe goods' +
                  'tothe custody of customs o any other anor shall conetiitefnalecharge othe Carers reeponsbity hereunder. (3)Incaue the' +
                  'cargo received bythe Carers contaner (s) into which entenis have been packed by or on behalf ot the Merchant, the Carrer hall oniy' +
                  'be {for delivery of the total number of container(s) shown on the face hereof, and shall not be required to unpack the' +
                  'Contos) shownontelaseheest andshallnatbe required tounpack the containers) and deliver the conten hereotin accordance' +
                  "with brands, marks, numbers, sizes or typés of packages or pieces, provides, however, that atthe Carrier's absolute discretion and upon" +
                  'the Mera ana ning acing the Carr ieae day the sched cate of al fe Vous a he poo' +
                  'med, containers) may Be unpacked and the contents thereot may be delvered by the Carer one ormore receivers' +
                  'inacvotance win inwriten Nations inwnich cas fie seal efthe container) is ntact atthe time of unpacking al the Caciers' +
                  'obligations hereunder shall be deemed to have been discharged and the Carrier shall not be responsible for any loss or damage to the' +
                  'onkanis asing or resulting from auch delvery and the Merchant shall be Inble fr an appropriate acjustmert ol the eight and any' +
                  'jonal charges incurred. (4) in case the Goods have been| ‘container(s): provided, however, that at the carriers absolute' +
                  'clnereton and eabjerto pit srrangemert baween fe snpper ante Carre Oo ds may the Merchantin container(s)' +
                  'inwnion casei he contains are delivered by the Crier wth sealniact such delveryshallbe deemed as full and complete' +
                  "cof the carrier's obligations! andthe Carer saline! be esponsibieforany oss or damage to te contents ofthe containers) @)" +
                  'Optional delivery shall be granted only when arranged prior to the time of receipt of the goods and so expressly provided herein The' +
                  'merchant deiringto aval im sel ofthe option so expressed must give notice in wring tothe Carrer tte st por of call ofthe Vessel' +
                  '‘named in the option at least 48 hours prior to the Vessels arrival there otherwise the Goods shall be landed at any ofthe optional ports at' +
                  "‘any of the optional ports at carrier's option and the Carriers responsibilty shallthen ceases." +
                  '21. (Transhipment and forwarding) (1) Whether arranged before hand or not. the Carrier shall be at iberty without notice to carry the' +
                  'ode wholy of pary by the named on any other vessel() craft or ather means of anspor by water, land or aid, whether owned of' +
                  'Operated by the carrier or others. The cartier may under any c-rcumstances wi Glacharge the Goods or any pat of place ot' +
                  'transhipment and store the same a float or ashore and then forward the same by any means of transport (2) In case the Goods herein' +
                  'specter found athe pt of char place of lverr Fn bo mca, ‘they when found, may be forwarded to their' +
                  "intended port of discharge or place of delivery at te Carrier's (expense but the Carrier shall not be liable for any loss, damage, delay or" +
                  'depreciation arising from such forwarding.' +
                  '22, {Fee} The Carte shallot be responste tor any loss or damage othe Goods arsngoreuting fom re oocunng at any te' +
                  'andeventhough betoreloadingoon oraftsrdecharge trom the Vesoe!urless caused bythe acualfaul or privy pon t' +
                  '23. {len The Carter shat have alan on the Goods, when shal survive delvry, oral eight, dead righ damages,' +
                  'loss, charges, expenses and any other sums: forthe account ofthe Merchantunter ti Biot' +
                  'by puble auctor without not to the merchant. Won suet tna foods te proceed fat cover Tie amount ce and ne Gout and' +
                  '‘expenses incurred, the Carrier shall entitied to recover the deficit from the Merchant.',
                alignment: 'left',
                fontSize: 4.9,
              },

            ],
            [
              {
                text:
                  '(2) If the Goods are unclaimed during a reasonable' +
                  'time, or whenever in the Carriers opinion, the Goods willbecome deteriorated, decayed or worthless the Carrier may, athis discretion and.' +
                  'subject ths len andwihout any responsibly aching oi, se, ‘abandon or otherwise dispose of such Goods solely atthe riskand' +
                  'expense ofthe Merchant,' +
                  '24. ‘and Charges) (1) Freight may be calculated onthe basis ofthe particuars ofthe Goods tumished by the Merchant who' +
                  'shallbe deemed tohave guaranteed to the carrier the acouracy of the contents, weight, measure or value as furnished by nim, at thetime' +
                  '‘of receipt of the Goods by the Carrier, but the Carrier may, for the purpose of ascertain the actual particulars, at any time, open the' +
                  '‘package(@) and examine contents, weight, measure and value of the Goods at the isk and expense olthe Merchant In' +
                  '‘case of incorrect destaration ofthe contents, measure of value of the Goods, the Merchant shall be lable for and bound to pay to' +
                  '{he Carir(s) te balance o eight between the freight charged and hel which would have been due find the correct details been gven' +
                  'plus(s) as any by way of liquidated and the port of discharge or place of delivery named herein shall be considered as completely carried' +
                  '{gn receipt othe Goods by he Carat Whether the heightbe stated or intended obs prepaid oto be colected at destination The Carer' +
                  'Shale riod wal Gite et charyew cue wether actually pald or not, and to receive and retain them irrevocably' +
                  'under a he Voasol anc the Goods be Ips or not or tne voyage be broken up or usvaled' +
                  'abandoned atary sage of eerie rack Ful eight shall oe pad on damaged ot unsound Goode Tre payment ot eight andor' +
                  '‘charges shaU be made in full and in cash without any offset, counterclaim or decution. Where freights payable at the port of discharge or' +
                  'place of delivery, such freight and all other charges shall be paid in the currency named in this bill of Lading or at carriers option in other' +
                  '{grrency subject to regulations ofthe freight conference cancemed or custom atthe place of payment (4) Goods once received by the' +
                  'Carrier cannot be taken away of of by the Merchant except upon the Catier consent and against payment of fl right and' +
                  'reason or and/' +
                  'Many’' +
                  'Suggeatonaryingiscone rts nt done, the same sale deemed tobe nla wihin the conracal cage ana shal natoemed' +
                  "° {Unknown Clause) Any reference on the face heteof of mark's numbers, description, quality, quantity, guage. weight, measure," +
                  'ature, kind, valugand any other patoulas ofthe goods i an umished by tne Merchant, and the carrier shal not be responsible forthe' +
                  'racy hereot. The Merchant warrants to the Carrier than the particulars furnished by him are correct and shall indemnify the Carrier' +
                  'againstallioss, damage, expence,labily, penalties andfines areing orresutingtom inacouracy hereot' +
                  '10. (Use ef Container) (1) Where the Goods receipt of which is acknowiedgad on the face of this Bill of Lading are not already packed' +
                  'Pe come RSS the Carrier shall beat liberty to pack andcarry them in any type of containeris)..' +
                  '{Carrier Container) (1) The Merchant shall assume full responsibilty for and shall indemnity the Carrier against any loss of or' +
                  'damage tne Caters cotainar@) are ober equipments) which occurs whe Inthe possesion or contol ofthe Merchant, Ne agerts' +
                  'orinland carriers by or on behalf ol the Merchant (2) The carrier shallin no event be lable for and the Merchant shail indemnity' +
                  'nt hold the carer harmless rom and against any los of or damage to property of cher persone or nk to cher persone caused by' +
                  "the Carrier's contamer(s) or the contents thereof during handling by or while in the possession or control of the Merchant, his agents or" +
                  'inland carriers engaged by or onbehatf ofthe Merchant.' +
                  '12, (Container Packed by Merchant) ifthe Cargo received by the Carrier is container(s) into which contents have been packed or on' +
                  'behalf fhe Merchant (1) his Bil of Laing s prima facia evidence ofthe recept only ofthe receipt only ofthe numberof containers) as' +
                  'tuhown on the| of, and the order and dary Ree fog nese ae eee' +
                  'and kind of packages or places description, ua, arty, guage, Yk ight, measure, nature, kind:' +
                  '‘no accepts no esponsboy in respects teteot, ane @) the Merchant warrants the atthe storage cf he congonts of containers) and the' +
                  'closing and scaling are safe and proper and also warrants that the container(s) and contents thereof are sultable for handling and carriage' +
                  "in accordance with the terms hereof including Artcle 15; n the event-of the merchant's breach of said warranties, the Carrier shall not be" +
                  'responabeforany os ofr amageto rin connection withthe Goods resulting fom sad breach said breach andthe Merchantshallbe' +
                  'liable for loss ot or damage to any other propery, or tor personal injury or the any other or events' +
                  'and ehalinderviy the Carioraganat any tnd of oe o laity euered or cred by te Carter on sccaunt of hw sud sestot ot' +
                  '‘events, and (3) the Merchant shall Inspect the container(s) when the same are furnished by or on behatf of the Carrier, and they shall be' +
                  'deemed as full and complete performance of the Carriers obligations hereunder and container(s) and to Inspect the contents of the' +
                  'container(s) without notice to the Merchant at such time and place as the carrier may deem necessary and all expense incurred therefrom' +
                  'Khali be bome by the Merchant; in case the scale of container(s) are broken by the customs or other authorities for inspection of the' +
                  'contents of the said container(s) the Carver shall not be liable for any loss, damage, expenses or any other consequences arising or' +
                  'tesutingthersform.' +
                  '13. (Special container) (1) The Carrier shall not undertake to carry the Goods in reftigerated, heated, insulated, ventlased or any' +
                  'other setta containers) packed by or on behalf of he Merchant ae auch bu the Carer wil reat such Goods for coraine() only as' +
                  '‘ordinary goods or dry container(s) respectively, unless special arrangements for the carriage of such Goods or contamer(s) have' +
                  'freight as lity' +
                  'Suppllod by or on bona othe Merchant Ae regards the ‘Goods which have been agreed fo be cared in speclalcortaner() the' +
                  'Cartier shall exercise due diligence to maintain the facilites ofthe special container(s) while they are in his actual' +
                  'Shall not be liable for any kn of loss or damage to the Goods caused iy iaton Sotacta,defongemort or breakage’ facies ot te' +
                  'ccontainer(s) (3) If the Goods have been packed into container(s) by the Carrier and the particular temperature range' +
                  'requested by he Merchants Isorted inthis Blof Lading the Cari wil ste thermostatic controle tin the requested temperature' +
                  'range, but does not ‘of such temperature inside the container(s) (4) i the cargo recelved by the Carrer is' +
                  'Itai carat ow acorns avebeon pat ‘or on behalf of the Merchant itis the obligation of the Merchant to' +
                  '‘show the contents properly and act the thermostatic controls: ie Carriers shall not be lable for any loss or damage to the Goods' +
                  'steing ur ol resiing fom the Merchants Talure 0 auch Obkgsa and further does not querartos the metrsenence othe tended' +
                  '‘temperature inside the containor(s).' +
                  '14. ,{Dangerous Goods, Contraband) (1) The Carrier undertake to the Goode of any expose, ifanmabl,rectactie' +
                  "jng, noxious, hazardous, poisonous, injurious or dangerous nature only upon the Carrier's acceptance of a" +
                  "triton applcation By the Merchant forthe eariage of such Goode, euch application mux sceustaly stato the rahse'neme, aban" +
                  '‘classification of the Goods as welki as the methods of rendering them innocuous withthe full names and addresses of the shipper and the' +
                  'consignee, @) The Merchant shal undertake that te nature ofthe goods oe ton he preceding paragraph i distinct” and' +
                  'ermanenty masked a and shall' +
                  'reamed by oy anes or or by te Cari) ¥ the goods ere ato have bean' +
                  '‘ecelved by the carrer whhout complying with the paragraph (1) or 2) above orthe goods ae foundts be cortraband or prohbted by any' +
                  'laws ot regulations ofthe port ol loading, discharge or ealor any place or waters during the transport, tho carer shal be ented to have' +
                  'rendered Innocuous, thrown overboad of discharged or otherwise disposed of at the Carriers discretion without' +
                  '‘ompertation and ve Merchant shall fable for and indent te Our egelnteny kind toss, damage olay tncuding oes of' +
                  'freight and any expenses director indrecty vsing auto or resulting from such Goods (4) The Catret may exercises of enjoy ine rght' +
                  'orbenett ‘under the thatthe received in' +
                  'agai' +
                  'for any oss: by the Carrie through such taking away or disposal. the Goods are not available when the' +
                  'ready toload, tv Camas relved otany obligation taloed such through auch akg away or pave the goode are otevaebie wren' +
                  'the Vessel is ready to load, the Carrier is relieved! of any obligation to load such goods' +
                  'mace and dead feign shall be pad by the Mersnan’ the Merchant shal Se table or and indemny the Carr agalnt al uve,' +
                  'dias, ives and charges Including consular fees levied on the Goods, oF all ines andor loss sustained or incurred by te Cari in' +
                  'the ply with lows and regulations of any government of' +
                  'Publ autores connection wnt good oto procure consular Board of eat ctor coifats escapee Goose The' +
                  'Merchant shall be liable for turn freight and charges on the goods reused exportation or importation by any government or pubke' +
                  'authors the carers of te opinion that te Geode stand in need ef sorting, nepecting, mending or repelra or recondBoning or' +
                  'otherwise require protecting of earring for the Carrier may carry out such work at the cost and expense of the Merchant. The Merchant' +
                  'authorizes the carrierto pay and/or incur all.such charges and expenses and todo any matters mentioned above at the expense olandas' +
                  'agents forthe Merchant and Goods (6) The shipper, consignee, owner of fhe goods, and elder of ts BM of acing sha booty and' +
                  'severally Habe to the Carer for the payment ofa right and the performance of the obligation of each of them' +
                  'hereur' +
                  '25. ee ee ee an' +
                  'wing the Carte atthe pot of thre place of delivery before or atthe ime of delveryorthe Goods ortinelasor damage bent' +
                  'apparent, within days delivery, the goods shall be deemedto have been delivered as described in this Bill of Lading (2) tn any' +
                  'even the Carer shall be discharged fom al labily in respect ot nor delwery, misdelivey, delay, loss or Gamage ures suits ought' +
                  '‘within one yearafter delivery of Goods orthe date when the Goods should have been delivered.' +
                  "26. tL Liability) (1 for which the Carrler may be liable shall be adjusted and settled on the bass! ofthe Merchant's" +
                  '‘net invoice cost, plus freight and insurance premium, f paid in no event shall the Carrier be liable for any loss of profit or any cor' +
                  'loss (2) As for as the loss of or damage to or in connection with the Goods occurred during the part of carriage to which the Hague Rules' +
                  'Sha apply () the Carr shall not be lable or loss on damage nan amcunt exceeding 100.00 Bish Sterng per package orunt uniess' +
                  'the value of the Goods higher than this amount nas been declared in wring by the Merchant before lue of the Goods per' +
                  'package or unit value, the value shall tobethe dusand Cariers abit Hey,' +
                  'shall not exceed the declared value. Any partial loss or damage shall be adjusted pro rate on the basis ot such declared value. In case the' +
                  'declared value is market ‘than the actual value the carrier shall in no event be liable to pay any compensation, and (i) where the' +
                  'cargo has been either Into containers) or untized into similar article(s) of transport by or on behalf of the Merchant, itis expr' +
                  'agreed thal ne umber of such containers) or sim artice() of ransport show on the face Hered shale considered-as he number' +
                  "ofthe package's) or units(s) forthe purpose of the application of the limitation of labilty provided for herein." +
                  '27. _ (General Average, New Jason Clause) (1) General average shall be adjusted, stated and settled at Jakarta or any other port or' +
                  'place at the Carriers option according to the york Antwerp Rules, 1974 and as to matters not provided for by these rules, according tothe' +
                  'laws and usages of the port or place of adjustment, and in the currency selected by the Cartier. The general average statement shal be' +
                  'prepared by the adjusters appointed by Cartier. Average agreement or bond and stich cash depo: ‘may deem sufcient' +
                  '‘cover the estimated contributions of the Goods any salvage and special charges thereon and any other additional securities as the carrie' +
                  '‘may required shall be furnished by the merchant to the Cartier before delivery of the goods. The shipper by accepting this Bill of Lading' +
                  'ressly wires and renounces Articles 700 ofthe code of commence of indonesis. (2)inthe event of accident danger, damage or disaster' +
                  'before or after commencement of the voyage, resulting from any cause whatsoever, whether due to negligence ornot, for which or forthe' +
                  'consequence of which the carrier is not responsible by statuette, contract or otherwise, the goods and the Merchant shall jointly and' +
                  'server contribute wi the Caerin General average othe payment ct any secures locscf expenses ofa general average nature that' +
                  'be made or incurred, and shall pay shalvage and special charges incurred in respect of the Goods. Ifa salving ship is owned or' +
                  '‘operated by the Carrer, salvage shall be paidfor as fully and in the same manner as if such salving ship belongedto strangers.' +
                  '28. (Both Blame Collision) Ifthe vessel comes into collision with another ship as a result ol the negligence of the other ship and any' +
                  '‘ct, neglect of default of the Master, mariner, pilot or the servant of ths owner of the vessel in the navigation in the management of the' +
                  '\Vesoo| the Merchant shal indemnify the Carer againsal loss or laity which might beineurted drecty or ndircty tothe ther or non' +
                  '‘carrying ship or her owners as part oftheir claim against the carrying Vessel or the owner thereot. The foroe ions shall also' +
                  'apply where the owners, operators or those in charge of any ship or ships or objects other than, or in addition to the colliding ships or' +
                  'objects are at fauttin respectofa collision or contract.' +
                  '(Local Clause) in case this Bill of Lading covers the Goods moving to or from the U.S.A. and iit shall bs adjusted that the Hague' +
                  'Rules do nt given this Bil of Ladin. () Arie 16 a.nd Arica 15(8) neeotshalbe replaced bythe following terms "Wh espectio ve' +
                  'bird, reptiles and fish and plants and the goods carried on deck and stated herein to be so carried, al risks of loss or damage by' +
                  'perlsinhoretin or incidental to such carriage shall be borne by the merchant, but inall other respect in connection with the custody and' +
                  '‘carriage of such goods, the Carrier shall ave benefit of the provisions of the carriage of Good by Sea Act, 1996 of the U.S.A. notwith-' +
                  'standing Section 1(c) thereof and of al the terms and conditions of this Bill Lading except those inconsistents with the provisions of this' +
                  '‘Article and @) the works {00.00 Bish String in Act 26 herect shal be substuted bythe words S00 Lawl currency otthe US.A. and' +
                  '(8) Article 7(2) (if) hereof shall be replaced by the following terms "Save as covered by (i) above with respect to loss or dé ‘occunng' +
                  'during the handling, storage of carriage of the Goods by the sub-contractor of agent of the Carrier, to the extent to which such sub-' +
                  'contractor or agent would have been liable to the Merchant ithe had made a direct and separate cortract with the Merchant in respect of' +
                  '‘such handling, storage or carriage, provided, however, that ititis not approved or authorized under any applicable laws, rules or regula' +
                  'ier to undertake such handling, storags or carriage under his own responsibilty, the Carrier shall only be liable for' +
                  'with paragraph (1) and 1 above becomes dangerous tote Caro: Veen crge,pereone andlor ela propty. (6) The carerhasthe tions forthe' +
                  'rightto inspect the contents olth jatanytime iyatthe risk' +
                  'andexpense ofthe Merchant.' +
                  'rocuring such handing. Storage or carriage unde his o"vn responsibilty, the Caer shall only be Hable for procuring such handling' +
                  'any persons authorized by competent governmental agencies to engage therein and for auaranteeing the' +
                  'perormance tereofby such carr or personunderthetcortactanc tos',
                alignment: 'left',
                fontSize: 4.9,
              },

            ]
          ]

        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          fontSize: 14,
          margin: [0, 15, 0, 15],
        },
        tableHeight: {
          margin: [0, 0, 0, 0]

        }
      },
      footer: (currentPage: any, pageCount: any) => {
        var t = {
          layout: 'noBorders',
          fontSize: 8,
          margin: [25, 0, 25, 0],
          table: {
            heights: 100,
            widths: ['*', '*'],
            body: [
              [

                {
                  text: 'Page  ' + currentPage.toString() + ' of ' + pageCount,
                },
              ],
            ],
          },

        };

        return t;
      },

    };

    pdfMake.createPdf(docDefinition).open();
  }
}
