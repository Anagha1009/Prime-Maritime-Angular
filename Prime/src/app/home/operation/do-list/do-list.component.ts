import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Bl } from 'src/app/models/bl';
import { DO } from 'src/app/models/do';
import { BlService } from 'src/app/services/bl.service';
import { DoService } from 'src/app/services/do.service';
import { locale as english } from 'src/app/@core/translate/do/en';
import { locale as hindi } from 'src/app/@core/translate/do/hi';
import { locale as arabic } from 'src/app/@core/translate/do/ar';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import { CommonService } from 'src/app/services/common.service';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { formatDate } from '@angular/common';

const pdfMake = require('pdfmake/build/pdfmake.js');
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-do-list',
  templateUrl: './do-list.component.html',
  styleUrls: ['./do-list.component.scss'],
})
export class DoListComponent implements OnInit {
  dO = new DO();
  doList: any[] = [];
  containerList: any[] = [];
  doContainers: any[] = [];
  isScroll: boolean = false;
  doListForm: FormGroup;
  previewNoData: boolean = false;
  previewList: boolean = false;
  isLoading: boolean = false;
  itemPdf: any;
  blDetails: any;

  constructor(
    private _dOService: DoService,
    private _blService: BlService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _coreTranslationService: CoreTranslationService,
    private _cs: CommonService
  ) {
    this._coreTranslationService.translate(english, hindi, arabic);
  }

  ngOnInit(): void {
    this.doListForm = this._formBuilder.group({
      DO_NO: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });
    this.getDOList();
  }

  getDOList() {
    this.previewList = false;
    this.previewNoData = false;

    this.dO.AGENT_CODE = this._cs.getUserCode();
    this.dO.OPERATION = 'GET_DOLIST';
    this.isLoading = true;
    this._dOService.getDOList(this.dO).subscribe(
      (res: any) => {
        this.doList = [];
        this.isScroll = false;
        if (res.hasOwnProperty('Data')) {
          if (res.Data?.length > 0) {
            this.doList = res.Data;
            this.previewList = true;
            this.isLoading = false;
            if (this.doList?.length >= 4) {
              this.isScroll = true;
            } else {
              this.isScroll = false;
            }
          }
        }
        if (res.ResponseCode == 500) {
          this.previewNoData = true;
          this.isLoading = false;
        }
      },
      (error: any) => {
        if (error.status == 401) {
          alert('You are not authorized to access this page, please login');
          this._router.navigateByUrl('login');
        }
      }
    );
  }

  Search() {
    var DO_NO = this.doListForm.value.DO_NO;
    var FROM_DATE = this.doListForm.value.FROM_DATE;
    var TO_DATE = this.doListForm.value.TO_DATE;
    if (DO_NO == '' && FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
      return;
    }
    this.dO.DO_NO = DO_NO;
    this.dO.DO_DATE = FROM_DATE;
    this.dO.DO_VALIDITY = TO_DATE;

    this.getDOList();
  }

  Clear() {
    this.doListForm.get('DO_NO')?.setValue('');
    this.doListForm.get('FROM_DATE')?.setValue('');
    this.doListForm.get('TO_DATE')?.setValue('');

    this.dO.DO_NO = '';
    this.dO.DO_DATE = '';
    this.dO.DO_VALIDITY = '';

    this.getDOList();
  }

  getDODetails(doNo: any) {
    localStorage.setItem('DO_NO', doNo);
    this._router.navigateByUrl('home/operations/do-details');
  }

  viewDoPdf(item: any, isDo: boolean) {
    this.itemPdf = item;
    this.doContainers = [];
    var bl = new Bl();
    bl.DO_NO = this.itemPdf.DO_NO;
    this._blService.getContainerList(bl).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.doContainers = res.Data;
        if (isDo) {
          this.generateDOPdf();
        } else {
          this.generateELPdf();
        }
      }
    });
  }

  async generateDOPdf() {
    let docDefinition = {
      pageMargins: [40, 30, 40, 30],
      content: [
        {
          layout: 'noBorders',
          table: {
            widths: [70, 350, 60],
            headerRows: 1,
            heights: 30,
            body: [
              [
                { text: ' ', fontSize: 8, bold: true },
                {
                  text: 'PRIME MARITIME',
                  bold: true,
                  fontSize: 16,
                  alignment: 'center',
                  margin: [0, 0, 0, 7],
                },
                {
                  image: await this._cs.getBase64ImageFromURL(
                    'assets/img/logo_p.png'
                  ),
                  height: 40,
                  width: 100,
                  margin: [0, 0, 0, 0],
                },
              ],
            ],
          },
        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1 },
          ],
          margin: [0, 10, 0, 10],
        },
        {
          text: 'DELIVERY ORDER',
          bold: true,
          fontSize: 12.5,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            [
              {
                text: 'D.O.No. : ' + this.itemPdf.DO_NO,
                bold: false,
                fontSize: 9,
              },
            ],
            [
              {
                text:
                  'D.O.Date: ' +
                  formatDate(this.itemPdf.DO_DATE, 'dd-MM-yyyy', 'en'),
                bold: false,
                fontSize: 9,
                alignment: 'right',
                margin: [0, 0, 0, 7],
              },

              {
                text:
                  'Validity Date: ' +
                  formatDate(this.itemPdf.DO_VALIDITY, 'dd-MM-yyyy', 'en'),
                bold: false,
                fontSize: 9,
                alignment: 'right',
                margin: [0, 0, 0, 15],
              },
            ],
          ],
        },
        {
          text: 'To,\n\n' + this.itemPdf.CONSIGNEE,
          bold: false,
          fontSize: 9,
          alignment: 'left',
          margin: [0, 0, 0, 35],
        },
        {
          text: 'Dear Sir,',
          bold: false,
          fontSize: 8,
          alignment: 'left',
          margin: [0, 0, 0, 15],
        },
        {
          text:
            'Please Deliver to ' +
            this.itemPdf.CONSIGNEE +
            '. The Following Goods: ' +
            this.itemPdf.COMMODITY +
            ' from ' +
            this.itemPdf.POL +
            ' arrived per vessel: ' +
            this.itemPdf.VESSEL_NAME +
            ' at' +
            this.itemPdf.POD +
            ' arrived on ',
          bold: false,
          fontSize: 8,
          alignment: 'left',
          margin: [0, 0, 0, 15],
        },
        {
          layout: 'noBorders',
          table: {
            widths: [100, 180, 100],
            headerRows: 1,
            heights: 30,
            body: [
              [
                {
                  text: "G I.G.M.No./\nDate\n\nDescription of Goods\n\nMarks and No's\n\nBill Of Lading",
                  fontSize: 9,
                  bold: false,
                },
                {
                  text:
                    ': ' +
                    this.itemPdf.IGM_NO +
                    ' / ' +
                    formatDate(this.itemPdf.IGM_DATE, 'dd-MM-yyyy', 'en') +
                    '\n\n\n' +
                    ': ' +
                    this.doContainers[0]?.DESC_OF_GOODS +
                    '\n\n' +
                    ': ' +
                    this.doContainers[0]?.MARKS_NOS +
                    '\n\n' +
                    ': ' +
                    this.itemPdf.BL_NO +
                    '\n\n\n\n',
                  fontSize: 9,
                  bold: false,
                },
                {
                  text:
                    'G Item No.          : ' +
                    this.itemPdf.IGM_ITEM_NO +
                    '\n\n\n\n\n\n\n' +
                    'Dated          : ' +
                    formatDate(new Date(), 'dd-MM-yyyy', 'en') +
                    '\n\n\n\n',
                  fontSize: 9,
                  bold: false,
                },
              ],
            ],
          },
        },
        {
          //layout: 'noBorders',
          margin: [0, 0, 0, 55],
          table: {
            //cellpadding:'100px',
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*', '*', '*'],
            body: [
              [
                {
                  text: 'Container No',
                  fontSize: 8,
                  alignment: 'center',
                  margin: [0, 0, 0, 10],
                },
                {
                  text: 'Valid Upto',
                  fontSize: 8,
                  alignment: 'center',
                  margin: [0, 0, 0, 10],
                },
                {
                  text: 'Type',
                  fontSize: 8,
                  alignment: 'center',
                  margin: [0, 0, 0, 10],
                },
                {
                  text: 'No of Pkg',
                  fontSize: 8,
                  alignment: 'center',
                  margin: [0, 0, 0, 10],
                },
                {
                  text: 'Gross Weight',
                  fontSize: 8,
                  alignment: 'center',
                  margin: [0, 0, 0, 10],
                },
                {
                  text: 'Measurement',
                  fontSize: 8,
                  alignment: 'center',
                  margin: [0, 0, 0, 10],
                },
                {
                  text: "Seal's No",
                  fontSize: 8,
                  alignment: 'center',
                  margin: [0, 0, 0, 10],
                },
                {
                  text: 'Status',
                  fontSize: 8,
                  alignment: 'center',
                  margin: [0, 0, 0, 10],
                },
              ],
              ...this.doContainers.map((p: any) => [
                {
                  text: p.CONTAINER_NO,
                  fontSize: 8,
                  alignment: 'center',
                  margin: [0, 0, 0, 10],
                },
                {
                  text: formatDate(
                    this.itemPdf.DO_VALIDITY,
                    'dd-MM-yyyy',
                    'en'
                  ),
                  fontSize: 8,
                  alignment: 'center',
                  margin: [0, 0, 0, 10],
                },
                {
                  text: p.CONTAINER_TYPE,
                  fontSize: 8,
                  alignment: 'center',
                  margin: [0, 0, 0, 10],
                },
                {
                  text: p.NO_OF_PACKAGES,
                  fontSize: 8,
                  alignment: 'center',
                  margin: [0, 0, 0, 10],
                },
                {
                  text: p.GROSS_WEIGHT,
                  fontSize: 8,
                  alignment: 'center',
                  margin: [0, 0, 0, 10],
                },
                {
                  text: p.MEASUREMENT,
                  fontSize: 8,
                  alignment: 'center',
                  margin: [0, 0, 0, 10],
                },
                {
                  text: p.SEAL_NO,
                  fontSize: 8,
                  alignment: 'center',
                  margin: [0, 0, 0, 10],
                },
                {
                  text: 'FCL',
                  fontSize: 8,
                  alignment: 'center',
                  margin: [0, 0, 0, 10],
                },
              ]),
            ],
          },
        },
        {
          text: 'Thanking You,',
          bold: false,
          fontSize: 8,
          margin: [0, 0, 0, 17],
        },
        {
          text: 'Yours Faithfully\nINCHCAPE SHIPPING SERVICES LLC',
          bold: false,
          fontSize: 8,
          margin: [0, 0, 0, 40],
        },
        {
          text: 'AS AGENTS ONLY',
          bold: false,
          fontSize: 8,
          margin: [0, 0, 0, 15],
        },
        {
          text:
            'REMARK: BY VIRTUE OF OBTAINING THIS DELIVERY ORDER THE IMPORTER/CONSIGNEE OR HIS REPRESENTATIVE CONFIRMS\n' +
            'THAT HE IS RESPONSIBLE FOR PAYMENT OF APPROPRIATE STAMP DUTY AT THE VALUE OF THE FIRST ASSESSMENT OR\n' +
            'SUBSEQUENT REASSESSMENT OF VALUE/DUTY IF ANY NOT VALID FOR DELIVERY, UNTIL FRANKED WITH APPLICABLE STAMP\n' +
            'DUTY',
          bold: false,
          fontSize: 8,
          margin: [0, 0, 0, 10],
        },
        {
          text: 'NOTE : THIS IS SYSTEM GENERATED PRINT. SIGNATURE NOT REQUIRED',
          bold: true,
          fontSize: 8,
          margin: [0, 0, 0, 15],
        },
      ],
    };

    pdfMake.createPdf(docDefinition).open();
  }

  async generateELPdf() {
    let docDefinition = {
      pageMargins: [40, 30, 40, 30],
      content: [
        {
          text: 'PRIME MARITIME',
          bold: true,
          fontSize: 16,
          alignment: 'center',
          margin: [0, 0, 0, 7],
        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1 },
          ],
          margin: [0, 0, 0, 10],
        },
        {
          text: 'EMPTY CONTAINER ACCEPTANCE LETTER',
          bold: true,
          fontSize: 12.5,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            [
              {
                text: 'TO,\n\n' + this.itemPdf.CONSIGNEE,
                bold: false,
                fontSize: 9,
                margin: [0, 0, 0, 40],
              },
            ],
            [
              {
                text: formatDate(new Date(), 'dd-MM-yyyy', 'en'),
                bold: false,
                fontSize: 9,
                alignment: 'right',
                margin: [0, 0, 0, 60],
              },
            ],
          ],
        },
        {
          text: 'Sub : Return of Empty Container(s).',
          bold: false,
          fontSize: 9,
          margin: [0, 0, 0, 10],
        },

        {
          layout: 'noBorders',
          table: {
            widths: [20, 100, 160, 200],
            headerRows: 1,
            heights: 30,
            body: [
              [
                { text: 'SUB', fontSize: 9, bold: true },
                {
                  text: 'Vessel\n\nArrived\n\nB/L No.\n\nM/S\n\nA/C' + '\n\n',
                  fontSize: 9,
                  bold: false,
                },
                {
                  text:
                    ': ' +
                    this.itemPdf.VESSEL_NAME +
                    '\n\n' +
                    ': ' +
                    this.itemPdf.PLACE_OF_DELIVERY +
                    '\n\n' +
                    ': ' +
                    this.itemPdf.BL_NO +
                    '\n\n' +
                    ': ' +
                    this.itemPdf.CONSIGNEE +
                    '\n\n' +
                    ': ' +
                    this.itemPdf.CONSIGNEE +
                    '\n\n\n\n',
                  fontSize: 9,
                  bold: false,
                },
                {
                  text:
                    'Voyage Number       : ' +
                    this.itemPdf.VOYAGE_NO +
                    '\n\n' +
                    'I.G.M No & Date       : ' +
                    this.itemPdf.IGM_NO +
                    ' / ' +
                    formatDate(this.itemPdf.IGM_DATE, 'dd-MM-yyyy', 'en') +
                    '\n\n\n\n',
                  fontSize: 9,
                  bold: false,
                },
              ],
            ],
          },
        },
        {
          text:
            "We request you to accept the following container's on behallf of " +
            this.itemPdf.CONSIGNEE +
            ' at your yard, after the necessary survey has\n' +
            'been carried out by Surveyor.',
          bold: false,
          fontSize: 9,
          margin: [0, 0, 0, 10],
        },
        {
          //layout: 'noBorders',
          margin: [0, 0, 0, 45],
          table: {
            //cellpadding:'100px',
            headerRows: 1,
            widths: [220, 100],
            body: [
              [
                {
                  text: 'Container No',
                  fontSize: 8,
                  alignment: 'center',
                  margin: [0, 0, 0, 5],
                },
                {
                  text: 'Valid Upto',
                  fontSize: 8,
                  alignment: 'center',
                  margin: [0, 0, 0, 5],
                },
              ],
              ...this.doContainers.map((p: any) => [
                {
                  text: p.CONTAINER_NO,
                  fontSize: 8,
                  alignment: 'center',
                  margin: [0, 0, 0, 5],
                },
                {
                  text: formatDate(
                    this.itemPdf.DO_VALIDITY,
                    'dd-MM-yyyy',
                    'en'
                  ),
                  fontSize: 8,
                  alignment: 'center',
                  margin: [0, 0, 0, 5],
                },
              ]),
            ],
          },
        },
        {
          text: 'Please Note containers not to be accepted after the above mentioned date',
          bold: false,
          fontSize: 8,
          margin: [0, 0, 0, 10],
        },
        {
          text: 'Thanking You,',
          bold: false,
          fontSize: 8,
          margin: [0, 0, 0, 20],
        },
        {
          text: 'Yours Faithfully\nINCHCAPE SHIPPING SERVICES LLC',
          bold: false,
          fontSize: 8,
          margin: [0, 0, 0, 10],
        },
        {
          text: 'As Agents For Prime Maritime DWC LLC',
          bold: false,
          fontSize: 8,
          margin: [0, 0, 0, 15],
        },
        {
          text: 'NOTE : THIS IS SYSTEM GENERATED PRINT. SIGNATURE NOT REQUIRED.',
          bold: false,
          fontSize: 8,
          margin: [0, 0, 0, 10],
        },
      ],
    };

    pdfMake.createPdf(docDefinition).open();
  }
}
