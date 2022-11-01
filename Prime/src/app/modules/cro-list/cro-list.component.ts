import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CRO } from 'src/app/models/cro';
import { CroService } from 'src/app/services/cro.service';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { CommonService } from 'src/app/services/common.service';
import * as XLSX from 'xlsx';

const pdfMake = require('pdfmake/build/pdfmake.js');
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-cro-list',
  templateUrl: './cro-list.component.html',
  styleUrls: ['./cro-list.component.scss'],
})
export class CroListComponent implements OnInit {
  croForm: FormGroup;
  isScroll: boolean = false;
  croList: any[] = [];
  croDetails: any;
  blForm: FormGroup;
  onUpload: boolean = false;
  previewTable: any[] = [];

  @ViewChild('openModal') openModal: ElementRef;
  @ViewChild('openModal1') openModal1: ElementRef;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _croService: CroService,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.getCROList();

    this.blForm = this._formBuilder.group({
      SHIPPER: [''],
      CONSIGNEE: [''],
      NOTIFY_PARTY: [''],
      PRE_CARRIAGE_BY: [''],
      PLACE_OF_RECEIPT: [''],
      VESSEL_NAME: [''],
      PORT_OF_LOADING: [''],
      PORT_OF_DISCHARGE: [''],
      PLACE_OF_DELIVERY: [''],
      FINAL_DESTINATION: [''],
    });
  }

  getCROList() {
    var cro = new CRO();
    cro.AGENT_CODE = localStorage.getItem('usercode');

    this._croService.getCROList(cro).subscribe((res: any) => {
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

  getBLDetails() {}

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

  createBL() {
    console.log(JSON.stringify(this.blForm.value));
  }

  openBLModal() {
    this.blForm.patchValue(this.previewTable[0]);
    this.openModal.nativeElement.click();
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
            './../../../assets/img/logo_p.png'
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
              { text: 'a@shds.sfdf' },
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
              { text: 'sfd@ytrstdr', margin: [0, 0, 0, 5], fontSize: 10 },
              { text: '7687675', margin: [0, 0, 0, 5], fontSize: 10 },
              { text: '10/22/23', margin: [0, 0, 0, 5], fontSize: 10 },
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
            this.previewTable = jsonData['Sheet1'];
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

            if (isValid) {
              this.previewTable = this.previewTable.filter(
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
