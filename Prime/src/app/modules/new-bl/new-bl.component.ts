import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { Bl } from 'src/app/models/bl';
import { BlService } from 'src/app/services/bl.service';
import { Router } from '@angular/router';

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
  ContainerList1: any[] = [
    {
      CONTAINER_NO: 'BHYT767675656',
      SEAL_NO: 'FGSFfgs',
      QTY: '1',
      DESC_OF_GOODS: ['sdsh sgdsvceg'],
      GROSS_WEIGHT: [44],
      MEASUREMENT: ['kg'],
    },
  ];
  isBLForm: boolean = false;
  tabs: string = '1';
  blNo: string = '';
  isSplit: boolean = false;
  srrId: any;
  srrNo: any;
  chargeList: any[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _blService: BlService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.blForm = this._formBuilder.group({
      BL_NO: [''],
      SRR_ID: [''],
      SRR_NO: [''],
      BOOKING_NO: [''],
      SHIPPER: [''],
      CONSIGNEE: [''],
      NOTIFY_PARTY: [''],
      PRE_CARRIAGE_BY: [''],
      PLACE_OF_RECEIPT: [''],
      VESSEL_NAME: [''],
      VOYAGE_NO: [''],
      PORT_OF_LOADING: [''],
      PORT_OF_DISCHARGE: [''],
      PLACE_OF_DELIVERY: [''],
      FINAL_DESTINATION: [''],
      TOTAL_CONTAINERS: [''],
      PREPAID_AT: [''],
      PAYABLE_AT: [''],
      BL_ISSUE_PLACE: [''],
      BL_ISSUE_DATE: [''],
      TOTAL_PREPAID: [''],
      NO_OF_ORIGINAL_BL: [''],
      AGENT_CODE: [''],
      AGENT_NAME: [''],
      CREATED_BY: [''],
      CONTAINER_LIST: new FormArray([]),
      CONTAINER_LIST2: new FormArray([]),
    });
  }

  getBLForm() {
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
          MARKS_NOS: [element.MARKS_NOS],
          DESC_OF_GOODS: [element.DESC_OF_GOODS],
          GROSS_WEIGHT: [element.GROSS_WEIGHT],
          MEASUREMENT: [element.MEASUREMENT.toString()],
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
              this._router.navigateByUrl('/home/quotation-list');
            }
          });
      }
    });

    this.generateBLPdf();
  }

  getBLDetails() {
    var BL = new Bl();
    BL.AGENT_CODE = localStorage.getItem('usercode');
    BL.BL_NO = this.blNo;

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
            MARKS_NOS: [element.MARKS_NOS],
            DESC_OF_GOODS: [element.DESC_OF_GOODS],
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
        add.removeAt(index);
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

    if (file.size > 5000000) {
      alert('Please upload file less than 5 mb..!');
      return;
    } else {
      var el = array.find((a) => a.includes(extension));

      if (el != null && el != '') {
        reader.onload = (event) => {
          const data = reader.result;
          workBook = XLSX.read(data, { type: 'binary', cellDates: true });
          jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
            const sheet = workBook.Sheets[name];
            initial[name] = XLSX.utils.sheet_to_json(sheet);
            return initial;
          }, {});
          const dataString = JSON.stringify(jsonData);

          var keyArray = [
            'BOOKING_NO',
            'SHIPPER',
            'CONSIGNEE',
            'NOTIFY_PARTY',
            'PRE_CARRIAGE_BY',
            'PLACE_OF_RECEIPT',
            'VESSEL_NAME',
            'VOYAGE_NO',
            'PORT_OF_LOADING',
            'PORT_OF_DISCHARGE',
            'PLACE_OF_DELIVERY',
            'FINAL_DESTINATION',
          ];

          var keyArray1 = [
            'CONTAINER_NO',
            'SEAL_NO',
            'MARKS_NOS',
            'DESC_OF_GOODS',
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
                  element.SHIPPER,
                  element.CONSIGNEE,
                  element.NOTIFY_PARTY,
                  element.PRE_CARRIAGE_BY,
                  element.PLACE_OF_RECEIPT,
                  element.VESSEL_NAME,
                  element.VOYAGE_NO,
                  element.PORT_OF_LOADING,
                  element.PORT_OF_DISCHARGE,
                  element.PLACE_OF_DELIVERY,
                  element.FINAL_DESTINATION,
                ])
              ) {
                isValid = false;
              }
            });

            this.containerList.forEach((element) => {
              if (
                !this.checkNullEmpty([
                  element.CONTAINER_NO,
                  element.SEAL_NO,
                  element.MARKS_NOS,
                  element.DESC_OF_GOODS,
                  element.GROSS_WEIGHT,
                  element.MEASUREMENT,
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
    return true;
    //return $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0;
  }

  async generateBLPdf() {
    let docDefinition = {
      // header: {
      //   text: 'Bill of Lading',
      //   margin: [10, 10, 0, 0],
      // },
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
              { text: 'JUBAIL CHEMICAL INDUSTRIES CO.(JANA)', fontSize: 9 },
              {
                text: 'P.O. BOX 10661 JUBAIL INDUSTRIAL CITY 31961 KINGDOM OF SAUDI ARABIA TEL : +966 3 358-5002 FAX : +966 3 358-0089',
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
              { text: 'GST GLOBAL SUPPLY FZ-LLC', fontSize: 9 },
              {
                text: 'B5-801-C ACADEMIC ZONE 01 BUSINESS CENTER 5, RAKEZ BUSINESS ZONE-FZ RAS AL KHAIMAH -UNITED ARAB EMIRATES',
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
              { text: 'JITEX', fontSize: 9 },
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
                    { text: 'JITEX', fontSize: 9 },
                  ],
                  [
                    {
                      text: 'Place of Receipt',
                      bold: true,
                      fontSize: 10,
                      margin: [0, 5, 0, 0],
                    },
                    { text: 'India', fontSize: 9 },
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
                    { text: 'Samudra/985', fontSize: 9 },
                  ],
                  [
                    {
                      text: 'Port of Loading',
                      bold: true,
                      fontSize: 10,
                      margin: [0, 5, 0, 0],
                    },
                    { text: 'Mumbai', fontSize: 9 },
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
                    { text: 'Dubai', fontSize: 9, margin: [0, 0, 0, 20] },
                  ],
                  [
                    {
                      text: 'Place of Delivery',
                      bold: true,
                      fontSize: 10,
                      margin: [0, 5, 0, 0],
                    },
                    { text: 'Dubai', fontSize: 9, margin: [0, 0, 0, 20] },
                  ],
                ],
              },
            ],
            [
              {
                image: await this._commonService.getBase64ImageFromURL(
                  './../../../assets/img/logo_p.png'
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
                text: 'BL No : BL76765656445',
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
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*'],
            body: [
              [
                { text: 'Container No', fontSize: 9 },
                { text: 'Seal No', fontSize: 9 },
                { text: 'No of Containers of pkgs.', fontSize: 9 },
                { text: 'Description of goods', fontSize: 9 },
                { text: 'Gross Weight', fontSize: 9 },
                { text: 'Measurement', fontSize: 9 },
              ],
              ...this.ContainerList1.map((p: any) => [
                { text: p.CONTAINER_NO, fontSize: 9 },
                { text: p.SEAL_NO, fontSize: 9 },
                { text: p.QTY, fontSize: 9 },
                { text: p.DESC_OF_GOODS, fontSize: 9 },
                { text: p.GROSS_WEIGHT, fontSize: 9 },
                { text: p.MEASUREMENT, fontSize: 9 },
              ]),
            ],
          },
        },
        {
          text: 'Total No. of Containers or packages (in words)',
          bold: true,
          fontSize: 10,
          margin: [0, 20, 0, 0],
        },
        { text: 'Ten (10) Containers', fontSize: 9, margin: [0, 0, 0, 20] },
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*'],
            body: [
              [
                { text: 'Freight and Charges', fontSize: 9 },
                { text: 'Revenue Tons', fontSize: 9 },
                { text: 'Rate Per', fontSize: 9 },
                { text: 'Prepaid', fontSize: 9 },
                { text: 'Collect', fontSize: 9 },
              ],
              // ...this.ContainerList1.map((p: any) => [
              //   { text: p.CONTAINER_NO, fontSize: 9 },
              //   { text: p.SEAL_NO, fontSize: 9 },
              //   { text: p.QTY, fontSize: 9 },
              //   { text: p.DESC_OF_GOODS, fontSize: 9 },
              //   { text: p.GROSS_WEIGHT, fontSize: 9 },
              //   { text: p.MEASUREMENT, fontSize: 9 },
              // ]),
            ],
          },
        },
        {
          text: '______________________________________________________________________________________________',
          margin: [0, 0, 0, 70],
        },
        {
          text: '______________________________________________________________________________________________',
          margin: [0, 0, 0, 0],
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
              { text: 'INDIA', fontSize: 9 },
            ],
            [
              {
                text: 'Payable at',
                bold: true,
                fontSize: 10,
                margin: [0, 5, 0, 0],
              },
              { text: 'DUBAI', fontSize: 9 },
            ],
            [
              {
                text: 'Place and date of issue',
                bold: true,
                fontSize: 10,
                margin: [0, 5, 0, 0],
              },
              { text: 'INDIA - 10/11/22', fontSize: 9 },
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
              { text: '45454 INR (currency)', fontSize: 9 },
            ],
            [
              {
                text: 'No of Original B(s)/L',
                bold: true,
                fontSize: 10,
                margin: [0, 5, 0, 0],
              },
              { text: '3', fontSize: 9 },
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
                text: 'ORIGINAL',
                bold: true,
                fontSize: 20,
                margin: [0, 5, 0, 0],
                color: '#f94449',
              },
            ],
          ],
        },
      ],
      styles: {
        sectionHeader: {
          bold: true,
          fontSize: 14,
          margin: [0, 15, 0, 15],
        },
      },
    };

    pdfMake.createPdf(docDefinition).open();
    // const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    // pdfDocGenerator.getBlob((blob: any) => {
    //   console.log(blob);
    // });
  }
}
