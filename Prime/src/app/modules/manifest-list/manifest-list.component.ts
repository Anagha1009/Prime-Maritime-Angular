import { Component, OnInit } from '@angular/core';
import { CARGO_MANIFEST } from 'src/app/models/manifest';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';
import pdfFonts from 'pdfmake/build/vfs_fonts';

const pdfMake = require('pdfmake/build/pdfmake.js');
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-manifest-list',
  templateUrl: './manifest-list.component.html',
  styleUrls: ['./manifest-list.component.scss'],
})
export class ManifestListComponent implements OnInit {
  blNo: string = '';
  isManifest: boolean = false;
  isRecords: boolean = true;
  cargoList: any;

  constructor(
    private _blService: BlService,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {}

  showManifest() {
    var cargoManifest = new CARGO_MANIFEST();
    cargoManifest.AGENT_CODE = this._commonService.getUserCode();
    cargoManifest.BL_NO = this.blNo;

    this.isManifest = false;
    this._blService
      .getCargoManifestList(cargoManifest)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.cargoList = res.Data;
          //console.log(JSON.stringify(res.Data));
          this.isManifest = true;
          this.isRecords = true;
        } else if (res.ResponseCode == 500) {
          this.isRecords = false;
        }
      });
  }

  getCargoManifest() {
    var cargoManifest = new CARGO_MANIFEST();
    cargoManifest.AGENT_CODE = this._commonService.getUserCode();
    cargoManifest.BL_NO = this.blNo;

    this._blService
      .getCargoManifestList(cargoManifest)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.cargoList = res.Data;
          this.generateCargoPDF();
        }
      });
  }

  getFreightManifest() {
    var cargoManifest = new CARGO_MANIFEST();
    cargoManifest.AGENT_CODE = this._commonService.getUserCode();
    cargoManifest.BL_NO = this.blNo;

    this._blService
      .getCargoManifestList(cargoManifest)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.cargoList = res.Data;
          this.generateFreightPDF();
        }
      });
  }

  async generateCargoPDF() {
    let docDefinition = {
      pageOrientation: 'landscape',

      //pageMargins: [60, 60, 80, 40],

      content: [
        {
          text: this.cargoList?.CUSTOMER_NAME,
          style: 'header',
        },
        {
          text: this.cargoList?.CONSIGNEE_ADDRESS,
          style: 'desc',
        },
        {
          text: 'CIN :AAC-1451',
          style: 'midheading',
          margin: [0, 5, 0, 0],
        },
        {
          text: 'State Code: 27 State Name :Maharashtra',
          style: 'midheading',
          margin: [0, 3, 0, 0],
        },
        {
          text: 'GSTN Code :27AADFU8796Q1ZX',
          style: 'midheading',
          margin: [0, 3, 0, 0],
        },
        {
          text: 'CARGO MANIFEST',
          style: 'midheading',
          margin: [0, 20, 0, 0],
        },
        {
          style: 'tableExample',
          table: {
            //widths: ['6%', '6%', '6%','6%','6%','6%','6%','6%','6%','6%','6%'],
            headerRows: 1,
            body: [
              [
                { text: 'Vessel', style: 'tableHeader' },
                { text: 'Voyage', style: 'tableHeader' },
                { text: 'Service', style: 'tableHeader' },
                { text: 'Arrival Date', style: 'tableHeader' },
                { text: 'Sail Date', style: 'tableHeader' },
                { text: 'Nationality', style: 'tableHeader' },
                { text: 'Place Of Origin', style: 'tableHeader' },
                { text: 'Place of Receipt', style: 'tableHeader' },
                { text: 'Port of loading', style: 'tableHeader' },
                { text: 'Port of Discharge', style: 'tableHeader' },
                { text: 'Place of Delivery', style: 'tableHeader' },
              ],
              [
                this.cargoList?.VESSEL_NAME,
                this.cargoList?.VOYAGE_NO,
                this.cargoList?.SERVICE_NAME,
                '-',
                '-',
                '-',
                '-',
                this.cargoList?.PLACE_OF_RECEIPT,
                this.cargoList?.POL,
                this.cargoList?.POD,
                this.cargoList?.PLACE_OF_DELIVERY,
              ],
            ],
          },
          layout: 'noBorders',
        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 780, y2: 0, lineWidth: 1 },
          ],
        },
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            body: [
              [
                { text: 'BL No / Date', style: 'tableHeader' },
                { text: 'Shipper', style: 'tableHeader' },
                { text: 'Consignee', style: 'tableHeader' },
                { text: 'Notify', style: 'tableHeader' },
                { text: 'Marks & Numbers', style: 'tableHeader' },
                {
                  text: 'No & Kind of Pkgs. Description of Goods',
                  style: 'tableHeader',
                },
                { text: 'Gr Wt/ Net Wt in Kgs', style: 'tableHeader' },
                { text: 'Rcpt./Divy. Mode', style: 'tableHeader' },
                { text: 'VOLUME', style: 'tableHeader' },
                { text: "20'", style: 'tableHeader' },
                { text: "40'", style: 'tableHeader' },
              ],
              [
                this.cargoList?.BL_NO_DATE,
                this.cargoList?.SHIPPER,
                this.cargoList?.CONSIGNEE,
                this.cargoList?.NOTIFY_PARTY,
                this.cargoList?.MARKS_NOS,
                this.cargoList?.DESC_OF_GOODS,
                this.cargoList?.GROSS_WEIGHT,
                this.cargoList?.DELIVERY_MODE,
                '0',
                this.cargoList?.TWEENTY_FT,
                this.cargoList?.FORTY_FT,
              ],
            ],
          },
          layout: 'noBorders',
        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 780, y2: 0, lineWidth: 1 },
          ],
        },
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            body: [
              [
                { text: 'Container No', style: 'tableHeader' },
                { text: 'Size', style: 'tableHeader' },
                { text: 'Type', style: 'tableHeader' },
                { text: 'Seal No', style: 'tableHeader' },
                { text: 'Status', style: 'tableHeader' },
                { text: 'No. of PKGS and Type', style: 'tableHeader' },
                { text: 'Gross Weight(KGS)', style: 'tableHeader' },
                { text: 'Volume CBM', style: 'tableHeader' },
                { text: 'IMO CLass', style: 'tableHeader' },
                { text: 'UN No.', style: 'tableHeader' },
                { text: 'Temp', style: 'tableHeader' },
                { text: 'SOC', style: 'tableHeader' },
                { text: 'Shut Out', style: 'tableHeader' },
              ],
              ...this.cargoList?.CONTAINER_LIST.map((p: any) => [
                p.CONTAINER_NO,
                p.CONTAINER_SIZE,
                p.CONTAINER_TYPE,
                p.SEAL_NO,
                p.STATUS,
                '0',
                p.GROSS_WEIGHT,
                '0',
                p.IMO_CLASS,
                p.UN_NO,
                '-',
                '-',
                '-',
              ]),
            ],
          },
          layout: 'noBorders',
        },
        {
          text: this.cargoList?.CUSTOMER_NAME,
          style: 'rightStyle',
          margin: [0, 5, 0, 0],
        },
        {
          text: 'AS AGENTS ONLY, FOR CAPELINE',
          style: 'rightStyle',
        },
      ],

      styles: {
        header: {
          fontSize: 9,
          bold: true,
          alignment: 'center',
        },
        desc: {
          fontSize: 7,
          alignment: 'center',
        },
        midheading: {
          fontSize: 9,
          alignment: 'center',
          bold: true,
        },
        tableHeader: {
          bold: true,
          fontSize: 7,
        },
        tableExample: {
          fontSize: 5,
          margin: [0, 5, 0, 15],
        },
        rightStyle: {
          fontSize: 5,
          alignment: 'right',
          margin: [0, 5, 0, 0],
        },
      },
    };

    pdfMake.createPdf(docDefinition).open();
  }

  async generateFreightPDF() {
    let docDefinition = {
      pageOrientation: 'landscape',

      //pageMargins: [60, 60, 80, 40],

      content: [
        {
          text: this.cargoList?.CUSTOMER_NAME,
          style: 'header',
        },
        {
          text: this.cargoList?.CONSIGNEE_ADDRESS,
          style: 'desc',
        },
        {
          text: 'CIN :AAC-1451',
          style: 'midheading',
          margin: [0, 5, 0, 0],
        },
        {
          text: 'State Code: 27 State Name :Maharashtra',
          style: 'midheading',
          margin: [0, 3, 0, 0],
        },
        {
          text: 'GSTN Code :27AADFU8796Q1ZX',
          style: 'midheading',
          margin: [0, 3, 0, 0],
        },
        {
          text: 'FREIGHT MANIFEST',
          style: 'midheading',
          margin: [0, 20, 0, 0],
        },
        {
          style: 'tableExample',
          table: {
            //widths: ['6%', '6%', '6%','6%','6%','6%','6%','6%','6%','6%','6%'],
            headerRows: 1,
            body: [
              [
                { text: 'Vessel', style: 'tableHeader' },
                { text: 'Voyage', style: 'tableHeader' },
                { text: 'Service', style: 'tableHeader' },
                { text: 'Arrival Date', style: 'tableHeader' },
                { text: 'Sail Date', style: 'tableHeader' },
                { text: 'Nationality', style: 'tableHeader' },
                { text: 'Place Of Origin', style: 'tableHeader' },
                { text: 'Place of Receipt', style: 'tableHeader' },
                { text: 'Port of loading', style: 'tableHeader' },
                { text: 'Port of Discharge', style: 'tableHeader' },
                { text: 'Place of Delivery', style: 'tableHeader' },
              ],
              [
                this.cargoList?.VESSEL_NAME,
                this.cargoList?.VOYAGE_NO,
                this.cargoList?.SERVICE_NAME,
                '-',
                '-',
                '-',
                '-',
                this.cargoList?.PLACE_OF_RECEIPT,
                this.cargoList?.POL,
                this.cargoList?.POD,
                this.cargoList?.PLACE_OF_DELIVERY,
              ],
            ],
          },
          layout: 'noBorders',
        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 780, y2: 0, lineWidth: 1 },
          ],
        },
        {
          style: 'tableExample',
          width: '*',
          table: {
            headerRows: 1,
            body: [
              [
                { text: 'BL No / Date', style: 'tableHeader' },
                { text: 'Shipper', style: 'tableHeader' },
                { text: 'Consignee', style: 'tableHeader' },
                { text: 'Notify', style: 'tableHeader' },
                { text: 'Marks & Numbers', style: 'tableHeader' },
                {
                  text: 'No & Kind of Pkgs. Description of Goods',
                  style: 'tableHeader',
                },
                { text: 'Gr Wt/ Net Wt in Kgs', style: 'tableHeader' },
                { text: 'Rcpt./Divy. Mode', style: 'tableHeader' },
                { text: 'VOLUME', style: 'tableHeader' },
                { text: "20'", style: 'tableHeader' },
                { text: "40'", style: 'tableHeader' },
              ],
              [
                this.cargoList?.BL_NO_DATE,
                this.cargoList?.SHIPPER,
                this.cargoList?.CONSIGNEE,
                this.cargoList?.NOTIFY_PARTY,
                this.cargoList?.MARKS_NOS,
                this.cargoList?.DESC_OF_GOODS,
                this.cargoList?.GROSS_WEIGHT,
                this.cargoList?.DELIVERY_MODE,
                '0',
                this.cargoList?.TWEENTY_FT,
                this.cargoList?.FORTY_FT,
              ],
            ],
          },
          layout: 'noBorders',
          margin: [0, 0, 20, 0],
        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 780, y2: 0, lineWidth: 1 },
          ],
        },
        {
          text: 'Freight Details',
          style: 'underlineStyle',
        },
        {
          style: 'tableExample',
          width: '*',
          table: {
            headerRows: 1,
            body: [
              [
                { text: 'Chrg.Code', style: 'tableHeader' },
                { text: 'Rate Basis', style: 'tableHeader' },
                { text: 'Curr', style: 'tableHeader' },
                { text: 'Rate', style: 'tableHeader' },
                { text: 'Prepaid', style: 'tableHeader' },
                { text: 'Amount(INR)', style: 'tableHeader' },
                { text: 'Collect', style: 'tableHeader' },
              ],
              ...this.cargoList?.FREIGHT_DETAILS.map((p: any) => [
                p.CHARGE_CODE,
                '-',
                p.CURRENCY,
                p.APPROVED_RATE,
                '-',
                '-',
                '-',
              ]),
            ],
          },
          layout: 'noBorders',
          margin: [0, 0, 20, 0],
        },
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 780, y2: 0, lineWidth: 1 },
          ],
        },
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            body: [
              [
                { text: 'Container No', style: 'tableHeader' },
                { text: 'Size', style: 'tableHeader' },
                { text: 'Type', style: 'tableHeader' },
                { text: 'Seal No', style: 'tableHeader' },
                { text: 'Status', style: 'tableHeader' },
                { text: 'No. of PKGS and Type', style: 'tableHeader' },
                { text: 'Gross Weight(KGS)', style: 'tableHeader' },
                { text: 'Volume CBM', style: 'tableHeader' },
                { text: 'IMO CLass', style: 'tableHeader' },
                { text: 'UN No.', style: 'tableHeader' },
                { text: 'Temp', style: 'tableHeader' },
                { text: 'SOC', style: 'tableHeader' },
                { text: 'Shut Out', style: 'tableHeader' },
              ],
              ...this.cargoList?.CONTAINER_LIST.map((p: any) => [
                p.CONTAINER_NO,
                p.CONTAINER_SIZE,
                p.CONTAINER_TYPE,
                p.SEAL_NO,
                p.STATUS,
                '0',
                p.GROSS_WEIGHT,
                '0',
                p.IMO_CLASS,
                p.UN_NO,
                '-',
                '-',
                '-',
              ]),
            ],
          },
          layout: 'noBorders',
        },
        {
          text: this.cargoList?.CUSTOMER_NAME,
          style: 'rightStyle',
          margin: [0, 5, 0, 0],
        },
        {
          text: 'AS AGENTS ONLY, FOR CAPELINE',
          style: 'rightStyle',
        },
      ],

      styles: {
        header: {
          fontSize: 9,
          bold: true,
          alignment: 'center',
        },
        desc: {
          fontSize: 7,
          alignment: 'center',
        },
        midheading: {
          fontSize: 9,
          alignment: 'center',
          bold: true,
        },
        tableHeader: {
          bold: true,
          fontSize: 7,
        },
        tableExample: {
          fontSize: 5,
          margin: [0, 5, 0, 15],
        },
        rightStyle: {
          fontSize: 5,
          alignment: 'right',
          margin: [0, 5, 0, 0],
        },
        underlineStyle: {
          bold: true,
          fontSize: 7,
          decoration: 'underline',
          margin: [100, 10, 0, 0],
        },
      },
    };

    pdfMake.createPdf(docDefinition).open();
  }
}
