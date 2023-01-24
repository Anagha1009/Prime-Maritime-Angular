import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { Bl } from 'src/app/models/bl';
import { BlService } from 'src/app/services/bl.service';
import { Router } from '@angular/router';
import $ from 'jquery';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import { locale as english } from 'src/app/@core/translate/bl/en';
import { locale as hindi } from 'src/app/@core/translate/bl/hi';
import { locale as arabic } from 'src/app/@core/translate/bl/ar';

const pdfMake = require('pdfmake/build/pdfmake.js');
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-new-bl',
  templateUrl: './new-bl.component.html',
  styleUrls: ['./new-bl.component.scss'],
})
export class NewBlComponent implements OnInit {
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
  blHistoryList:any[]=[];
  hideHistory:boolean=false;

  constructor(
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _blService: BlService,
    private _router: Router,
    private _coreTranslationService: CoreTranslationService
  ) {this._coreTranslationService.translate(english, hindi, arabic);}

  ngOnInit(): void {
    this.blForm = this._formBuilder.group({
      BLType: [true],
      BL_NO: [''],
      SRR_ID: [''],
      SRR_NO: [''],
      BOOKING_NO: [''],
      SHIPPER: [''],
      SHIPPER_ADDRESS: [''],
      CONSIGNEE: [''],
      CONSIGNEE_ADDRESS: [''],
      NOTIFY_PARTY: [''],
      NOTIFY_PARTY_ADDRESS: [''],
      PRE_CARRIAGE_BY: [''],
      PLACE_OF_RECEIPT: [''],
      VESSEL_NAME: [''],
      VOYAGE_NO: [''],
      PORT_OF_LOADING: [''],
      PORT_OF_DISCHARGE: [''],
      PLACE_OF_DELIVERY: [''],
      FINAL_DESTINATION: [''],
      MARKS_NOS: [''],
      DESC_OF_GOODS: [''],
      TOTAL_CONTAINERS: [''],
      PREPAID_AT: [''],
      PAYABLE_AT: [''],
      BL_ISSUE_PLACE: [''],
      BL_ISSUE_DATE: [''],
      TOTAL_PREPAID: [''],
      NO_OF_ORIGINAL_BL: [''],
      BL_STATUS:[''],
      AGENT_CODE: [''],
      AGENT_NAME: [''],
      CREATED_BY: [''],
      CONTAINER_LIST: new FormArray([]),
      CONTAINER_LIST2: new FormArray([]),
    });

    this.getBLHistory();
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
      alert('Please upload Shipping Instructions !');
      return;
    }

    this.hideHistory=true;
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
          AGENT_SEAL_NO:[element.AGENT_SEAL_NO]
        })
      );
    });

    this.isBLForm = true;
    this.isSplit = false;

    this.blForm.get('TOTAL_CONTAINERS')?.setValue(this.containerList.length);
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

  createBL() {
    if (this.isSplit) {
      this.blForm.get('BL_NO')?.setValue(this.blNo + '-1');
    } else {
      this.blForm.get('BL_NO')?.setValue(this.getRandomNumber());
    }

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
    var bl = new Bl();
    bl.AGENT_CODE = localStorage.getItem('usercode');
    bl.BL_NO = this.isSplit ? this.blNo : '';
    bl.BOOKING_NO = !this.isSplit ? this.blForm.get('BOOKING_NO')?.value : '';

    this._blService.getSRRDetails(bl).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.blForm.get('SRR_ID')?.setValue(res.Data.ID);
        this.blForm.get('SRR_NO')?.setValue(res.Data.SRR_NO);
        this._blService
          .createBL(JSON.stringify(this.blForm.value))
          .subscribe((res: any) => {
            if (res.responseCode == 200) {
              //  this._router.navigateByUrl('/home/quotation-list');
            }
          });
      }
    });

    this.ContainerDescription();
  }

  getBLDetailsForEdit(BLNO:any){
    this.hideHistory=true;
    var BL = new Bl();
    BL.AGENT_CODE = localStorage.getItem('usercode');
    BL.BL_NO = BLNO;

    this._blService.getBLDetails(BL).subscribe((res: any) => {
      this.blForm.patchValue(res.Data);

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
            GROSS_WEIGHT: [element.GROSS_WEIGHT],
            MEASUREMENT: [element.MEASUREMENT?.toString()],
          })
        );
      });

      this.isBLForm = true;
      this.isSplit = false;

      this.blForm.get('TOTAL_CONTAINERS')?.setValue(this.containerList.length);
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
    var BL = new Bl();
    BL.AGENT_CODE = localStorage.getItem('usercode');
    BL.BL_NO = this.blNo;

    this._blService.getBLDetails(BL).subscribe((res: any) => {
      if(res.ResponseCode==200){
        this.hideHistory=true;
        this.blForm.patchValue(res.Data);

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
              GROSS_WEIGHT: [element.GROSS_WEIGHT],
              MEASUREMENT: [element.MEASUREMENT?.toString()],
            })
          );
        });

        this.isBLForm = true;
        this.isSplit = true;

        this.blForm.get('TOTAL_CONTAINERS')?.setValue(contList.length);
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
      else if(res.ResponseCode==500){
        alert("Sorry, the specified BL No. doesn't exist! Try entering an existing BL No. to split")
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
      alert('Please Select Excel Format only');
      return;
    }

    if (file.size > 5000000) {
      alert('Please upload file less than 5 mb..!');
      return;
    } else {
      var el = array.find((a) => a.includes(extension));

      if (el != null && el != '') {
        reader.onload = (event) => {
          debugger;
          const data = reader.result;
          workBook = XLSX.read(data, { type: 'binary', cellDates: true });

          if (workBook.SheetNames[0] != 'Sheet1') {
            alert('Invalid File !');
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
              alert('Incorrect data!');
            }
          } else {
            alert('Invalid file !');
          }
        };
        reader.readAsBinaryString(file);
      } else {
        alert('Only .xlsx or .csv files allowed');
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

  viewBL(BLNO:any){
    var BL = new Bl();
    BL.AGENT_CODE = localStorage.getItem('usercode');
    BL.BL_NO = BLNO;

    this._blService.getBLDetails(BL).subscribe((res: any) => {
      this.blForm.patchValue(res.Data);

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
            GROSS_WEIGHT: [element.GROSS_WEIGHT],
            MEASUREMENT: [element.MEASUREMENT?.toString()],
          })
        );
      });
      this.ContainerDescription();
    });

  }

  ContainerDescription() {
    this._commonService
      .getDropdownData('CONTAINER_TYPE')
      .subscribe((res: any) => {
        debugger;
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
    const add = this.blForm.get('CONTAINER_LIST2') as FormArray;
    this.ContainerList1 = [];
    this.ContainerList1.push(add.value);

    let docDefinition = {
      pageMargins: [40, 30, 40, 30],

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
                fontSize: 10,
                margin: [0, 5, 0, 0],
              },
              { text: this.blForm.value.SHIPPER.toUpperCase(), fontSize: 9 },
              {
                text: this.blForm.value.SHIPPER_ADDRESS.toUpperCase(),
                fontSize: 9,
              },
              {
                text: '______________________________________________',
              },
              {
                text: 'Consignee',
                bold: true,
                fontSize: 10,
                margin: [0, 5, 0, 0],
              },
              { text: this.blForm.value.CONSIGNEE.toUpperCase(), fontSize: 9 },
              {
                text: this.blForm.value.CONSIGNEE_ADDRESS.toUpperCase(),
                fontSize: 9,
              },
              {
                text: '______________________________________________',
              },
              {
                text: 'Notify Party',
                bold: true,
                fontSize: 10,
                margin: [0, 5, 0, 0],
              },
              {
                text: this.blForm.value.NOTIFY_PARTY.toUpperCase(),
                fontSize: 9,
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
                      fontSize: 10,
                      margin: [0, 5, 0, 0],
                    },
                    {
                      text: this.blForm.value.PRE_CARRIAGE_BY.toUpperCase(),
                      fontSize: 9,
                    },
                  ],
                  [
                    {
                      text: 'Place of Receipt',
                      bold: true,
                      fontSize: 10,
                      margin: [0, 5, 0, 0],
                    },
                    {
                      text: this.blForm.value.PLACE_OF_RECEIPT.toUpperCase(),
                      fontSize: 9,
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
                      fontSize: 10,
                      margin: [0, 5, 0, 0],
                    },
                    {
                      text:
                        this.blForm.value.VESSEL_NAME.toUpperCase() +
                        '/' +
                        this.blForm.value.VOYAGE_NO.toUpperCase(),
                      fontSize: 9,
                    },
                  ],
                  [
                    {
                      text: 'Port of Loading',
                      bold: true,
                      fontSize: 10,
                      margin: [0, 5, 0, 0],
                    },
                    {
                      text: this.blForm.value.PORT_OF_LOADING.toUpperCase(),
                      fontSize: 9,
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
                      text: 'Port Of Discharge',
                      bold: true,
                      fontSize: 10,
                      margin: [0, 5, 0, 0],
                    },
                    {
                      text: this.blForm.value.PORT_OF_DISCHARGE.toUpperCase(),
                      fontSize: 9,
                      margin: [0, 0, 0, 20],
                    },
                  ],
                  [
                    {
                      text: 'Place of Delivery',
                      bold: true,
                      fontSize: 10,
                      margin: [0, 5, 0, 0],
                    },
                    {
                      text: this.blForm.value.PLACE_OF_DELIVERY.toUpperCase(),
                      fontSize: 9,
                      margin: [0, 0, 0, 20],
                    },
                  ],
                ],
              },
            ],
            [
              {
                image: await this._commonService.getBase64ImageFromURL(
                  'assets/img/logo_p.png'
                ),
                alignment: 'right',
                height: 50,
                width: 90,
                margin: [0, 0, 0, 10],
              },
              {
                text: 'Bill of Lading',
                alignment: 'right',
              },
              {
                text: 'BL No :' + this.blForm.value.BL_NO.toUpperCase(),
                alignment: 'right',
                color: '#17a2b8',
                margin: [0, 0, 0, 5],
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
            ],
          ],
        },
        {
          table: {
            headerRows: 1,
            body: [
              [
                {
                  text: 'Container Numbers, Seal Numbers and Marks',
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: 'Description of Packages and Goods',
                  fontSize: 9,
                  bold: true,
                },
                { text: 'Gross Cargo Weight', fontSize: 9, bold: true },
                { text: 'Measurement', fontSize: 9, bold: true },
              ],
              ...this.containerTypeList.map((p: any) => [
                {},
                { text: p.length + ' X ' + p[0]?.CONTAINER_TYPE, fontSize: 9 },
                {},
                {},
              ]),
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
          text: 'Total No. of Containers or packages (in words)',
          bold: true,
          fontSize: 10,
          margin: [0, 20, 0, 0],
        },
        { text: this.containerList.length, fontSize: 9 },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1 },
          ],
          margin: [0, 20, 0, 20],
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*'],
            body: [
              [
                { text: 'Freight and Charges', fontSize: 9, bold: true },
                { text: 'Revenue Tons', fontSize: 9, bold: true },
                { text: 'Rate Per', fontSize: 9, bold: true },
                { text: 'Prepaid', fontSize: 9, bold: true },
                { text: 'Collect', fontSize: 9, bold: true },
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
          margin: [0, 20, 0, 0],
        },
        {
          columns: [
            [
              {
                text: 'Ex. Rate',
                bold: true,
                fontSize: 10,
                margin: [0, 5, 0, 0],
              },
              { text: '', fontSize: 9 },
            ],
            [
              {
                text: 'Prepaid at',
                bold: true,
                fontSize: 10,
                margin: [0, 5, 0, 0],
              },
              { text: this.blForm.value.PREPAID_AT, fontSize: 9 },
            ],
            [
              {
                text: 'Payable at',
                bold: true,
                fontSize: 10,
                margin: [0, 5, 0, 0],
              },
              { text: this.blForm.value.PAYABLE_AT, fontSize: 9 },
            ],
            [
              {
                text: 'Place and date of issue',
                bold: true,
                fontSize: 10,
                margin: [0, 5, 0, 0],
              },
              {
                text:
                  this.blForm.value.BL_ISSUE_PLACE +
                  '-' +
                  this.blForm.value.BL_ISSUE_DATE,
                fontSize: 9,
              },
            ],
          ],
        },
        {
          text: '______________________________________________________________________________________________',
        },
        {
          columns: [
            [
              {
                text: 'Total Prepaid',
                bold: true,
                fontSize: 10,
                margin: [0, 5, 0, 0],
              },
              {
                text: this.blForm.value.TOTAL_PREPAID + 'INR (currency)',
                fontSize: 9,
              },
            ],
            [
              {
                text: 'No of Original B(s)/L',
                bold: true,
                fontSize: 10,
                margin: [0, 5, 0, 0],
              },
              { text: this.blForm.value.NO_OF_ORIGINAL_BL, fontSize: 9 },
            ],
            [
              {
                text: '',
                bold: true,
                fontSize: 10,
                margin: [0, 5, 0, 0],
              },
              { text: '', fontSize: 9 },
            ],
            [
              {
                text: '',
                bold: true,
                fontSize: 10,
                margin: [0, 5, 0, 0],
              },
              { text: '', fontSize: 9 },
            ],
          ],
        },
        {
          text: '______________________________________________________________________________________________',
          margin: [0, 0, 0, 20],
        },
        {
          columns: [
            [
              {
                text: 'SHIPPED on board the Vessel',
                bold: true,
                fontSize: 10,
                margin: [0, 5, 0, 0],
              },
              { text: '', fontSize: 9 },
            ],
            [
              {
                text: 'By',
                bold: true,
                fontSize: 10,
                margin: [0, 5, 0, 0],
              },
              { text: '---------------------------------', fontSize: 9 },
            ],
            [
              {
                text: 'For PRIME MARITIME',
                bold: true,
                fontSize: 10,
                margin: [0, 0, 0, 15],
              },
              { text: 'As Agents for the carrier', fontSize: 9 },
              { text: '--------------------------------------' },
              { text: 'PRIME MARITIME DWC-LLC' },
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
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*'],
            body: [
              [
                { text: 'Container No', fontSize: 9 },
                { text: 'Seal No', fontSize: 9 },
                { text: 'No of Containers or pkgs.', fontSize: 9 },
                { text: 'Description of goods', fontSize: 9 },
                { text: 'Gross Weight', fontSize: 9 },
                { text: 'Measurement', fontSize: 9 },
              ],
              ...this.ContainerList1[0].map((p: any) => [
                { text: p.CONTAINER_NO, fontSize: 9 },
                { text: p.SEAL_NO, fontSize: 9 },
                { text: '4', fontSize: 9 },
                { text: p.DESC_OF_GOODS, fontSize: 9 },
                { text: p.GROSS_WEIGHT, fontSize: 9 },
                { text: p.MEASUREMENT, fontSize: 9 },
              ]),
            ],
          },
        },
      ],
      footer: (currentPage: any, pageCount: any) => {
        var t = {
          layout: 'noBorders',
          fontSize: 8,
          margin: [25, 0, 25, 0],
          table: {
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
      styles: {
        sectionHeader: {
          bold: true,
          fontSize: 14,
          margin: [0, 15, 0, 15],
        },
      },
    };

    pdfMake.createPdf(docDefinition).open();
  }
}
