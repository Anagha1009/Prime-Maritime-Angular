import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CRO } from 'src/app/models/cro';
import { CroService } from 'src/app/services/cro.service';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { CommonService } from 'src/app/services/common.service';
import * as XLSX from 'xlsx';
import { BlService } from 'src/app/services/bl.service';
import { Bl } from 'src/app/models/bl';
import { asLiteral } from '@angular/compiler/src/render3/view/util';
import { locale as english } from 'src/app/@core/translate/cro/en';
import { locale as hindi } from 'src/app/@core/translate/cro/hi';
import{locale as arabic} from 'src/app/@core/translate/cro/ar';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';

const pdfMake = require('pdfmake/build/pdfmake.js');
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-cro-list',
  templateUrl: './cro-list.component.html',
  styleUrls: ['./cro-list.component.scss'],
})
export class CroListComponent implements OnInit {
  isScroll: boolean = false;
  croList: any[] = [];
  croForm: FormGroup;
  croDetails: any;
  blForm: FormGroup;
  cro = new CRO();
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

  @ViewChild('openModal') openModal: ElementRef;
  @ViewChild('openModal1') openModal1: ElementRef;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _croService: CroService,
    private _commonService: CommonService,
    private _blService: BlService,
    private _coreTranslationService: CoreTranslationService
  ) {this._coreTranslationService.translate(english, hindi,arabic);}

  ngOnInit(): void {
    this.croForm = this._formBuilder.group({
      CRO_NO: [''],  
      CUSTOMER_NAME: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
      STATUS: [''],
    });

    this.getCROList();

    this.blForm = this._formBuilder.group({
      BL_NO: [''],
      SRR_ID: [''],
      SRR_NO: [''],
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
      BL_ISSUE_PLACE: [''],
      NO_OF_ORIGINAL_BL: [''],
      AGENT_CODE: [''],
      AGENT_NAME: [''],
      CREATED_BY: [''],
      CONTAINER_LIST: new FormArray([]),
      CONTAINER_LIST2: new FormArray([]),
    });
  }

  Search() {
    var CRO_NO = this.croForm.value.CRO_NO;
    var CUSTOMER_NAME = this.croForm.value.CUSTOMER_NAME;
    var STATUS = this.croForm.value.STATUS;
    var FROM_DATE = this.croForm.value.FROM_DATE;
    var TO_DATE = this.croForm.value.TO_DATE;

    if (
      CRO_NO == '' &&
      CUSTOMER_NAME == '' &&
      STATUS == '' &&
      FROM_DATE == '' &&
      TO_DATE == ''
    ) {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.cro.CRO_NO = CRO_NO;
    this.cro.CUSTOMER_NAME = CUSTOMER_NAME;
    this.cro.STATUS = STATUS;

    this.getCROList();
  }

  Clear() {
    this.croForm.get('CRO_NO')?.setValue('');
    this.croForm.get('CUSTOMER_NAME')?.setValue('');
    this.croForm.get('STATUS')?.setValue('');
    this.croForm.get('FROM_DATE')?.setValue('');
    this.croForm.get('TO_DATE')?.setValue('');

    this.cro.CRO_NO = '';
    this.cro.CUSTOMER_NAME = '';
    this.cro.STATUS = '';

    this.getCROList();
  }

  getCROList() {
    this.cro.AGENT_CODE = localStorage.getItem('usercode');

    this._croService.getCROList(this.cro).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.croList = res.Data;

        if (this.croList?.length >= 4) {
          this.isScroll = true;
        } else {
          this.isScroll = false;
        }
      }
    });
  }

  getCRODetails(CRO_NO: string) {
    var cro = new CRO();
    cro.AGENT_CODE = localStorage.getItem('usercode');
    cro.CRO_NO = CRO_NO;

    this._croService.getCRODetails(cro).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.croDetails = res.Data;
        this.generatePDF();
      }
    });
  }

  getContainerList(item: any) {
    const add = this.blForm.get('CONTAINER_LIST') as FormArray;
    add.push(item);
    console.log(item.value);
  }

  createBL() {
    this.blForm.get('BL_NO')?.setValue(this.getRandomNumber());

    var voyageNo = this.blForm.get('VOYAGE_NO')?.value;
    this.blForm.get('VOYAGE_NO')?.setValue(voyageNo.toString());

    var noBL = this.blForm.get('NO_OF_ORIGINAL_BL')?.value;
    this.blForm.get('NO_OF_ORIGINAL_BL')?.setValue(noBL.toString());

    this.blForm.get('AGENT_CODE')?.setValue(localStorage.getItem('usercode'));
    this.blForm.get('AGENT_NAME')?.setValue(localStorage.getItem('username'));
    this.blForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    console.log(JSON.stringify(this.blForm.value));
    this.generateBLPdf();
  }

  getRandomNumber() {
    var num = Math.floor(Math.random() * 1e16).toString();
    return 'BL' + num;
  }

  openBLModal(item: any) {
    this.blForm.patchValue(this.previewTable[0]);
    this.blForm.get('SRR_ID')?.setValue(item.SRR_ID);
    this.blForm.get('SRR_NO')?.setValue(item.SRR_NO);

    const add = this.blForm.get('CONTAINER_LIST2') as FormArray;

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

    this.openModal.nativeElement.click();
  }

  get f() {
    var c = this.blForm.get('CONTAINER_LIST2') as FormArray;
    return c.controls;
  }

  getf1(i: any) {
    return i;
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

  async generatePDF() {
    var tempArr = [];

    tempArr.push({
      TYPE: this.croDetails?.ContainerList[0].CONTAINER_TYPE,
      SIZE: this.croDetails?.ContainerList[0].CONTAINER_SIZE,
    });

    let docDefinition = {
      header: {
        text: 'Container Release Order',
        margin: [10, 10, 0, 0],
      },
      content: [
        {
          image: await this._commonService.getBase64ImageFromURL(
            'assets/img/logo_p.png'
          ),
          alignment: 'right',
          height: 50,
          width: 70,
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            [
              {
                text: this.croDetails?.CUSTOMER_NAME,
                bold: true,
              },
              { text: this.croDetails?.ADDRESS },
              { text: '6473463' },
            ],
            [
              {
                text: `Date: ${new Date().toLocaleString()}`,
                alignment: 'right',
              },
              {
                text: `CRO No : ${this.croDetails?.CRO_NO}`,
                alignment: 'right',
                color: '#17a2b8',
              },
            ],
          ],
        },
        {
          text: 'Booking Details',
          style: 'sectionHeader',
        },
        {
          columns: [
            [
              {
                text: 'Booking No:',
                margin: [0, 0, 0, 5],
                bold: true,
                fontSize: 10,
              },
              {
                text: 'Location:',
                margin: [0, 0, 0, 5],
                bold: true,
                fontSize: 10,
              },
              {
                text: 'Booking Party:',
                margin: [0, 0, 0, 5],
                bold: true,
                fontSize: 10,
              },
              {
                text: 'Email Id:',
                margin: [0, 0, 0, 5],
                bold: true,
                fontSize: 10,
              },
              {
                text: 'Contact No:',
                margin: [0, 0, 0, 5],
                bold: true,
                fontSize: 10,
              },
              {
                text: 'Valid Upto:',
                margin: [0, 0, 0, 5],
                bold: true,
                fontSize: 10,
              },
            ],
            [
              {
                text: this.croDetails?.BOOKING_NO,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: '-',
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: this.croDetails?.CUSTOMER_NAME,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              { text: this.croDetails?.EMAIL,
                margin:[0,0,0,5],
                fontsize:10,
              }
            ],
            [
              {
                text: 'Shipper Name:',
                margin: [0, 0, 0, 5],
                bold: true,
                fontSize: 10,
              },
              {
                text: 'Service Mode:',
                margin: [0, 0, 0, 5],
                bold: true,
                fontSize: 10,
              },
              {
                text: 'POL:',
                margin: [0, 0, 0, 5],
                bold: true,
                fontSize: 10,
              },
              {
                text: 'POD:',
                margin: [0, 0, 0, 5],
                bold: true,
                fontSize: 10,
              },
              {
                text: 'FPD:',
                margin: [0, 0, 0, 5],
                bold: true,
                fontSize: 10,
              },
              {
                text: 'Voyage:',
                margin: [0, 0, 0, 5],
                bold: true,
                fontSize: 10,
              },
            ],
            [
              {
                text: 'RTREcdfsgdfs',
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: 'CY/CY',
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: this.croDetails?.POL,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: this.croDetails?.POD,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: 'Mundra',
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: this.croDetails?.BookingDetails.VOYAGE_NO,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
            ],
          ],
        },
        {
          text: 'Container Details',
          style: 'sectionHeader',
        },
        {
          // optional
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              ['Type', 'Size', 'Qty', 'Service'],
              ...this.croDetails?.ContainerList.map((p: any) => [
                p.CONTAINER_TYPE,
                p.CONTAINER_SIZE,
                p.IMM_VOLUME_EXPECTED,
                p.SERVICE_MODE,
              ]),
            ],
          },
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
}
