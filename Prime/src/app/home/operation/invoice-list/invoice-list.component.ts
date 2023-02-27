import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Bl } from 'src/app/models/bl';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { getQueryPredicate } from '@angular/compiler/src/render3/view/util';

const pdfMake = require('pdfmake/build/pdfmake.js');
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
})
export class InvoiceListComponent implements OnInit {
  invoiceList: any[] = [];
  filterForm: FormGroup;
  invoiceForm: FormGroup;
  bl: Bl = new Bl();
  containerTypeList: any[] = [];
  invoiceDetails: any;
  chargeList: any[] = [];
  blNo: string = '';
  invoiceNo: string = '';

  @ViewChild('openBtn') openBtn: ElementRef;

  constructor(
    private _blService: BlService,
    private _commonService: CommonService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.filterForm = this._formBuilder.group({
      INVOICE_NO: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.invoiceForm = this._formBuilder.group({
      INVOICE_TYPE: [''],
      CONTAINER_TYPE: [''],
    });

    this.getInvoiceList();
  }

  Search() {
    var INVOICE_NO =
      this.filterForm.value.INVOICE_NO == null
        ? ''
        : this.filterForm.value.INVOICE_NO;
    var FROM_DATE =
      this.filterForm.value.FROM_DATE == null
        ? ''
        : this.filterForm.value.FROM_DATE;
    var TO_DATE =
      this.filterForm.value.TO_DATE == null
        ? ''
        : this.filterForm.value.INVOICE_NO;

    if (INVOICE_NO == '' && FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.bl.INVOICE_NO = INVOICE_NO;
    this.bl.FROM_DATE = FROM_DATE;
    this.bl.TO_DATE = TO_DATE;

    this.getInvoiceList();
  }

  Clear() {
    this.filterForm.reset();
    this.bl = new Bl();

    this.getInvoiceList();
  }

  openModal(item: any) {
    this.blNo = item.BL_NO;
    this.invoiceNo = item.INVOICE_NO;
    this.invoiceForm.reset();
    this.invoiceForm.get('CONTAINER_TYPE').setValue('');
    this.getBLDetails();
    this.openBtn.nativeElement.click();
  }

  getBLDetails() {
    var BL = new Bl();
    BL.BL_NO = this.blNo;
    BL.AGENT_CODE = this._commonService.getUserCode();

    this.containerTypeList = [];
    this._blService.getBLDetails(BL).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        var dataArr = res.Data.CONTAINER_LIST.map((item: any) => {
          return [item.CONTAINER_TYPE, item.CONTAINER_TYPE];
        });
        var maparr = new Map(dataArr);

        this.containerTypeList = [...maparr.values()];

        if (this.containerTypeList.length == 1) {
          this.invoiceForm
            .get('CONTAINER_TYPE')
            .setValue(this.containerTypeList[0]);
        }
      }
    });
  }

  getInvoice() {
    var BL = new Bl();
    BL.INVOICE_NO = this.invoiceNo;
    BL.CONTAINER_TYPE = this.invoiceForm.get('CONTAINER_TYPE')?.value;

    this._blService.getinvoiceDetails(BL).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.invoiceDetails = res.Data;

        this.chargeList = [];
        if (this.invoiceForm.get('INVOICE_TYPE')?.value == 'E') {
          this.chargeList = res.Data.LOCALCHARGES;
        } else if (this.invoiceForm.get('INVOICE_TYPE')?.value == 'F') {
          this.chargeList = res.Data.FREIGHTLIST;
        } else if (this.invoiceForm.get('INVOICE_TYPE')?.value == 'I') {
          this.chargeList = res.Data.PODCHARGES;
        }

        this.generatePDF();
      }
    });
  }

  getqty(charge: any) {
    if (charge == 'DO Fees (C)' || charge == 'BL Fees (C)') {
      return 1;
    } else {
      return this.invoiceDetails?.TOTAL_CONTAINERS;
    }
  }

  getTotalTaxableAmnt() {
    var total = 0;
    for (var i = 0; i < this.chargeList.length; i++) {
      var rr = this.chargeList[i].RATE * this.getqty(this.chargeList[i].CHARGE);
      total += +rr;
    }

    return Math.round(total * 100) / 100;
  }

  getTotalGSTRate() {
    var total = 0;

    if (this.invoiceForm.get('INVOICE_TYPE').value != 'F') {
      for (var i = 0; i < this.chargeList.length; i++) {
        var totalgst =
          this.chargeList[i].RATE * this.getqty(this.chargeList[i].CHARGE);
        var rr = (totalgst * 9) / 100;
        total += +rr;
      }
    }

    return Math.round(total * 100) / 100;
  }

  getGSTRate(rate: any) {
    if (this.invoiceForm.get('INVOICE_TYPE').value != 'F') {
      var gstrate = (rate * 9) / 100;
      return Math.round(gstrate * 100) / 100;
    } else {
      return 0;
    }
  }

  async generatePDF() {
    let docDefinition = {
      header: {
        text: 'RECEIPT/ INVOICE',
        margin: [0, 10, 0, 0],
        alignment: 'center',
      },
      content: [
        {
          image: await this._commonService.getBase64ImageFromURL(
            'assets/img/logo_p.png'
          ),
          alignment: 'right',
          height: 50,
          width: 100,
          margin: [0, 0, 0, 10],
        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1 },
          ],
          margin: [0, 10, 0, 10],
        },
        {
          layout: 'noBorders',
          table: {
            widths: [400, 300],
            headerRows: 1,
            heights: 30,
            body: [
              [
                {
                  text:
                    'To,\n\n' +
                    this.invoiceDetails?.INVOICE_FOR +
                    '\n\n' +
                    this.invoiceDetails?.INVOICE_FOR_ADDRESS.replace(
                      /(.{23})/g,
                      '$1\n'
                    ),
                  fontSize: 9,
                  bold: true,
                },
                {
                  text:
                    this.invoiceDetails?.INVOICE_NO +
                    '\n\n' +
                    'Date: ' +
                    this._commonService.getIndianDate(
                      new Date(this.invoiceDetails?.INVOICE_DATE)
                    ) +
                    '\n\nJob Ref No: - \n\nDeposit BG Letter:',
                  fontSize: 9,
                  bold: true,
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
          layout: 'noBorders',
          table: {
            widths: [100, 10, 500],
            headerRows: 1,
            heights: 5,
            body: [
              [
                {
                  text: 'Line',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: ':',
                },
                {
                  text: 'Prime Maritime',
                  fontSize: 10,
                },
              ],
              [
                {
                  text: 'Vessel',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: ':',
                },
                {
                  text: this.invoiceDetails?.VESSEL_NAME,
                  fontSize: 10,
                },
              ],
              [
                {
                  text: 'Voyage No',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: ':',
                },
                {
                  text: this.invoiceDetails?.VOYAGE_NO,
                  fontSize: 10,
                },
              ],
              [
                {
                  text: 'Load Port',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: ':',
                },
                {
                  text: this.invoiceDetails?.POL,
                  fontSize: 10,
                },
              ],
              [
                {
                  text: 'Discharge Port',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: ':',
                },
                {
                  text: this.invoiceDetails?.POD,
                  fontSize: 10,
                },
              ],
              [
                {
                  text: 'B/L No',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: ':',
                },
                {
                  text: this.invoiceDetails?.BL_NO,
                  fontSize: 10,
                },
              ],
              [
                {
                  text: 'Final Destination',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: ':',
                },
                {
                  text: this.invoiceDetails?.FINAL_DESTINATION,
                  fontSize: 10,
                },
              ],
              [
                {
                  text: 'Type of Service',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: ':',
                },
                {
                  text: this.invoiceDetails?.SERVICE_NAME,
                  fontSize: 10,
                },
              ],
              [
                {
                  text: 'Total Container(s)',
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: ':',
                },
                {
                  text:
                    this.invoiceDetails?.TOTAL_CONTAINERS +
                    ' (' +
                    this.invoiceDetails?.CONTAINERS +
                    ')',
                  fontSize: 10,
                },
              ],
            ],
          },
        },
        {
          text: '',
          margin: [0, 10, 0, 20],
        },
        {
          layout: {
            hLineWidth: function (i: any, node: any) {
              if (i === 0 || i === node.table.body.length) {
                return 1;
              }
              return i === node.table.headerRows
                ? 1
                : i === node.table.body.length - 1
                ? 1
                : 0;
            },
            vLineWidth: function (i: any) {
              //return i === 0 ? 0 : i == 8 ? 0 : 1;
              return 1;
            },
            hLineColor: function (i: any) {
              return 'black';
            },
            paddingTop: function (i: any) {
              return i === 1 ? 30 : 7;
            },
            paddingBottom: function (i: any, node: any) {
              return i === node.table.body.length - 2 ? 30 : 0;
            },
            // paddingBottom: function (i: any, node: any) {
            //   // return i === 0 ? 0 : 8;
            //   return i === node.table.body.length - 1 ? 200 : 0;
            // },
            paddingLeft: function (i: any) {
              // return i === 0 ? 0 : 8;
              return 7;
            },
            paddingRight: function (i: any, node: any) {
              //return i === node.table.widths.length - 1 ? 0 : 8;
              return 7;
            },
          },
          table: {
            widths: [70, 15, 20, 35, 35, 35, 20, 35, 20, 35, 40],
            headerRows: 1,
            heights: 5,
            body: [
              [
                {
                  text: 'Charges',
                  fontSize: 9,
                },

                {
                  text: 'Qty',
                  fontSize: 9,
                },

                {
                  text: 'Curr',
                  fontSize: 9,
                },
                {
                  text: 'Chrg Amount',
                  fontSize: 9,
                },
                {
                  text: 'Amount',
                  fontSize: 9,
                },

                {
                  text: 'Txb Amount',
                  fontSize: 9,
                },
                {
                  text: 'Rate %',
                  fontSize: 9,
                },
                {
                  text: 'SGST',
                  fontSize: 9,
                },
                {
                  text: 'Rate %',
                  fontSize: 9,
                },
                {
                  text: 'CGST',
                  fontSize: 9,
                },
                {
                  text: 'Amount in INR',
                  fontSize: 9,
                },
              ],
              ...this.chargeList.map((p: any) => [
                {
                  text: p.CHARGE,
                  fontSize: 8,
                },

                { text: this.getqty(p.CHARGE), fontSize: 8 },

                { text: p.CURRENCY, fontSize: 8 },
                { text: p.RATE, fontSize: 8 },
                { text: p.RATE * this.getqty(p.CHARGE), fontSize: 8 },

                {
                  text:
                    this.invoiceForm.get('INVOICE_TYPE').value != 'F'
                      ? p.RATE * this.getqty(p.CHARGE)
                      : 0,
                  fontSize: 8,
                },
                {
                  text:
                    this.invoiceForm.get('INVOICE_TYPE').value != 'F' ? 9 : 0,
                  fontSize: 8,
                },
                {
                  text: this.getGSTRate(p.RATE * this.getqty(p.CHARGE)),
                  fontSize: 8,
                },
                {
                  text:
                    this.invoiceForm.get('INVOICE_TYPE').value != 'F' ? 9 : 0,
                  fontSize: 8,
                },
                {
                  text: this.getGSTRate(p.RATE * this.getqty(p.CHARGE)),
                  fontSize: 8,
                },
                {
                  text:
                    p.RATE * this.getqty(p.CHARGE) +
                    this.getGSTRate(p.RATE * this.getqty(p.CHARGE)) * 2,
                  fontSize: 8,
                },
              ]),
              [
                { colSpan: 5, text: 'Total', fontSize: 12 },

                {
                  text: '',
                },
                {
                  text: '',
                },
                {
                  text: '',
                },
                {
                  text: '',
                },
                {
                  text:
                    this.invoiceForm.get('INVOICE_TYPE').value != 'F'
                      ? this.getTotalTaxableAmnt()
                      : 0,
                  fontSize: 9,
                },
                {
                  text: '',
                },
                {
                  text: this.getTotalGSTRate(),
                  fontSize: 9,
                },
                {
                  text: '',
                },
                {
                  text: this.getTotalGSTRate(),
                  fontSize: 9,
                },
                {
                  text: this.getTotalTaxableAmnt() + this.getTotalGSTRate() * 2,
                  fontSize: 9,
                },
              ],
            ],
          },
        },
        {
          text: '',
          margin: [0, 10, 0, 10],
        },
        {
          layout: 'noBorders',
          table: {
            widths: [300, 600],
            headerRows: 1,
            heights: 5,
            body: [
              [
                {
                  text: 'For PRIME MARITIME',
                  fontSize: 12,
                },
                {
                  text:
                    'In case of any discrepancy on above invoice amount,\n please notify ' +
                    'within 5 days. If not this invoice will be\n presumed to be in order.\n\n\n' +
                    'Please issue the Payorder / Demand Draft\n in favour of PRIME MARITIME \n' +
                    'Account Holder Name: PRIME MARITIME\n' +
                    'Payment in Favour: \n' +
                    'Bank Name: \n' +
                    'Account Number:\n' +
                    'IFSC Code:\n' +
                    'Bank Address:',
                  fontSize: 10,
                },
              ],
            ],
          },
        },
      ],
    };

    pdfMake.createPdf(docDefinition).open();
  }

  getInvoiceList() {
    this.bl.AGENT_CODE = this._commonService.getUserCode();
    this._commonService.destroyDT();

    this._blService.getinvoiceList(this.bl).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.invoiceList = res.Data;
      }
      this._commonService.getDT();
    });
  }
}
