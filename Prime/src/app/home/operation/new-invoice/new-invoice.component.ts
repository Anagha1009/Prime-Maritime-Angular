import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Bl } from 'src/app/models/bl';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';

const pdfMake = require('pdfmake/build/pdfmake.js');
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.scss'],
})
export class NewInvoiceComponent implements OnInit {
  isLoading: boolean = false;
  isLoading2: boolean = false;
  blDetails: any;
  invoiceDetails: any;
  invoiceForm: FormGroup;
  isBL: boolean = false;
  containerTypeList: any[] = [];
  chargeList: any[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _commonService: CommonService,
    private _blService: BlService
  ) {}

  ngOnInit(): void {
    this.invoiceForm = this._formBuilder.group({
      BL_NO: [''],
      CONTAINER_TYPE: [''],
      CHARGE_TYPE: [''],
      INVOICE_TYPE: [''],
    });
  }

  getBLDetails() {
    var BL = new Bl();
    BL.BL_NO = this.invoiceForm.get('BL_NO')?.value;
    BL.AGENT_CODE = this._commonService.getUserCode();

    this.isBL = false;
    this.isLoading = true;
    this._blService.getBLDetails(BL).subscribe((res: any) => {
      this.isLoading = false;
      if (res.ResponseCode == 200) {
        this.blDetails = res.Data;

        var dataArr = this.blDetails.CONTAINER_LIST.map((item: any) => {
          return [item.CONTAINER_TYPE, item.CONTAINER_TYPE];
        });
        var maparr = new Map(dataArr);

        this.containerTypeList = [...maparr.values()];

        this.isBL = true;
      }
    });
  }

  getInvoice() {
    var BL = new Bl();
    BL.BL_NO = this.invoiceForm.get('BL_NO')?.value;
    BL.CONTAINER_TYPE = this.invoiceForm.get('CONTAINER_TYPE')?.value;

    this._blService.getinvoiceDetails(BL).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.invoiceDetails = res.Data;

        this.chargeList = [];
        if (this.invoiceForm.get('CHARGE_TYPE')?.value == 'L') {
          this.chargeList = res.Data.LOCALCHARGES;
        } else if (this.invoiceForm.get('CHARGE_TYPE')?.value == 'F') {
          this.chargeList = res.Data.FREIGHTLIST;
        }

        this.generatePDF();
      }
    });
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
            widths: [400, 100],
            headerRows: 1,
            heights: 30,
            body: [
              [
                {
                  text: 'To,\n\nMarina Cubes Street\n\nPort Rashid Dubai UAE\n\nPO Box : 33166\n\n1283, Dubai',
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: 'Date: 10/02/2023\n\nDoc No: 4558\n\nJob Ref No: 46465\n\nDeposit BG Letter:\n\nTotal No Containers: 48',
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
            widths: [100, 60, 60, 60, 60, 60, 60],
            headerRows: 1,
            heights: 5,
            body: [
              [
                {
                  text: 'Charges',
                  fontSize: 12,
                  bold: true,
                },
                {
                  text: 'UOM',
                  fontSize: 12,
                  bold: true,
                },
                {
                  text: 'Qty',
                  fontSize: 12,
                  bold: true,
                },
                {
                  text: 'Curr',
                  fontSize: 12,
                  bold: true,
                },
                {
                  text: 'Rate',
                  fontSize: 12,
                  bold: true,
                },
                {
                  text: 'ExRate',
                  fontSize: 12,
                  bold: true,
                },
                {
                  text: 'Vat',
                  fontSize: 12,
                  bold: true,
                },
              ],
              ...this.chargeList.map((p: any) => [
                {
                  text: p.CHARGE,
                  fontSize: 10,
                },
                {
                  text: '-',
                },
                { text: this.invoiceDetails?.TOTAL_CONTAINERS, fontSize: 10 },
                { text: p.CURRENCY, fontSize: 10 },
                { text: p.RATE, fontSize: 10 },
                { text: '-' },
                { text: '-' },
              ]),
            ],
          },
        },
      ],
    };

    pdfMake.createPdf(docDefinition).open();
  }
}
