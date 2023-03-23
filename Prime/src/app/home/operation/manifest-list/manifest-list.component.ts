import { Component, OnInit } from '@angular/core';
import { CARGO_MANIFEST } from 'src/app/models/manifest';
import { BlService } from 'src/app/services/bl.service';
import { CommonService } from 'src/app/services/common.service';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const pdfMake = require('pdfmake/build/pdfmake.js');
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-manifest-list',
  templateUrl: './manifest-list.component.html',
  styleUrls: ['./manifest-list.component.scss'],
})
export class ManifestListComponent implements OnInit {
  isManifest: boolean = false;
  cargoList: any;
  isLoading: boolean = false;
  submitted: boolean = false;
  manifestlistForm: FormGroup;
  VesselList: any[] = [];
  VoyageList: any[] = [];

  constructor(
    private _blService: BlService,
    private _commonService: CommonService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.manifestlistForm = this._formBuilder.group({
      VESSEL_NAME: ['', Validators.required],
      VOYAGE_NO: ['', Validators.required],
    });

    this.getDropdown();
  }

  showManifest() {
    this.submitted = true;
    if (this.manifestlistForm.invalid) {
      return;
    }

    var cargoManifest = new CARGO_MANIFEST();
    cargoManifest.AGENT_CODE = this._commonService.getUserCode();
    cargoManifest.VESSEL_NAME = this.manifestlistForm.get('VESSEL_NAME').value;
    cargoManifest.VOYAGE_NO = this.manifestlistForm.get('VOYAGE_NO').value;

    this.isManifest = false;
    this.isLoading = true;
    this._blService
      .getCargoManifestList(cargoManifest)
      .subscribe((res: any) => {
        debugger;
        this.isLoading = false;
        if (res.ResponseCode == 200) {
          this.cargoList = res.Data;
          this.isManifest = true;

          var employees3: any = [];

          res.Data.CONTAINER_LIST.forEach((cont: any) => {
            const findEmp = res.Data.CUSTOMER_LIST.find(
              (cust: any) => cust.BL_NO === cont.BL_NO
            );
            if (findEmp) {
              employees3.push({
                ...cont,
                ...findEmp,
              });
            }
          });

          console.log(employees3);
        } else if (res.ResponseCode == 500) {
          this._commonService.errorMsg('Sorry ! No Records found !');
        }
      });
  }

  clearManifest() {
    this.isManifest = false;
    this.submitted = false;
  }

  get f() {
    return this.manifestlistForm.controls;
  }

  getVoyageList(event: any) {
    this.VoyageList = [];
    this._commonService
      .getDropdownData('VOYAGE_NO', '', event)
      .subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.VoyageList = res.Data;
        }
      });
  }

  getDropdown() {
    this._commonService.getDropdownData('VESSEL_NAME').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.VesselList = res.Data;
      }
    });
  }

  async generateCargoPDF() {
    let docDefinition = {
      pageOrientation: 'landscape',

      //pageMargins: [60, 60, 80, 40],

      content: [
        {
          text: 'PRIME MARITIME',
          style: 'header',
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
                this.cargoList?.CUSTOMER_LIST[0].VESSEL_NAME,
                this.cargoList?.CUSTOMER_LIST[0].VOYAGE_NO,
                this.cargoList?.CUSTOMER_LIST[0].SERVICE_NAME,
                '-',
                '-',
                '-',
                '-',
                this.cargoList?.CUSTOMER_LIST[0].PLACE_OF_RECEIPT,
                this.cargoList?.CUSTOMER_LIST[0].POL,
                this.cargoList?.CUSTOMER_LIST[0].POD,
                this.cargoList?.CUSTOMER_LIST[0].PLACE_OF_DELIVERY,
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
              ...this.cargoList?.CUSTOMER_LIST.map((p: any) => [
                p.BL_NO_DATE,
                p.SHIPPER,
                p.CONSIGNEE,
                p.NOTIFY_PARTY,
                p.MARKS_NOS,
                p.DESC_OF_GOODS,
                p.GROSS_WEIGHT,
                p.DELIVERY_MODE,
                '0',
                p.TWEENTY_FT,
                p.FORTY_FT,
              ]),
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
                p.CONTAINER_TYPE.substring(0, 2),
                p.CONTAINER_TYPE,
                p.SEAL_NO,
                p.NO_OF_PACKAGES + ' - ' + p.PACKAGES,
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
          text: '',
          style: 'rightStyle',
          margin: [0, 5, 0, 0],
        },
        {
          text: 'AS AGENTS ONLY',
          style: 'rightStyle',
        },
      ],

      styles: {
        header: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
        },
        desc: {
          fontSize: 9,
          alignment: 'center',
        },
        midheading: {
          fontSize: 11,
          alignment: 'center',
          bold: true,
        },
        tableHeader: {
          bold: true,
          fontSize: 9,
        },
        tableExample: {
          fontSize: 7,
          margin: [0, 5, 0, 15],
        },
        rightStyle: {
          fontSize: 7,
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
          text: 'PRIME MARITIME',
          style: 'header',
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
                this.cargoList?.CUSTOMER_LIST[0].VESSEL_NAME,
                this.cargoList?.CUSTOMER_LIST[0].VOYAGE_NO,
                this.cargoList?.CUSTOMER_LIST[0].SERVICE_NAME,
                '-',
                '-',
                '-',
                '-',
                this.cargoList?.CUSTOMER_LIST[0].PLACE_OF_RECEIPT,
                this.cargoList?.CUSTOMER_LIST[0].POL,
                this.cargoList?.CUSTOMER_LIST[0].POD,
                this.cargoList?.CUSTOMER_LIST[0].PLACE_OF_DELIVERY,
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
              ...this.cargoList?.CUSTOMER_LIST.map((p: any) => [
                p.BL_NO_DATE,
                p.SHIPPER,
                p.CONSIGNEE,
                p.NOTIFY_PARTY,
                p.MARKS_NOS,
                p.DESC_OF_GOODS,
                p.GROSS_WEIGHT,
                p.DELIVERY_MODE,
                '0',
                p.TWEENTY_FT,
                p.FORTY_FT,
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
                { text: 'Prepaid/ Collect', style: 'tableHeader' },
                { text: 'Amount(INR)', style: 'tableHeader' },
              ],
              ...this.cargoList?.FREIGHT_DETAILS.map((p: any) => [
                p.CHARGE_CODE,
                '-',
                p.CURRENCY,
                p.STANDARD_RATE,
                p.TRANSPORT_TYPE,
                p.APPROVED_RATE,
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
                p.CONTAINER_TYPE.substring(0, 2),
                p.CONTAINER_TYPE,
                p.SEAL_NO,
                p.NO_OF_PACKAGES + ' - ' + p.PACKAGES,
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
          text: '',
          style: 'rightStyle',
          margin: [0, 5, 0, 0],
        },
        {
          text: 'AS AGENTS ONLY',
          style: 'rightStyle',
        },
      ],

      styles: {
        header: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
        },
        desc: {
          fontSize: 9,
          alignment: 'center',
        },
        midheading: {
          fontSize: 11,
          alignment: 'center',
          bold: true,
        },
        tableHeader: {
          bold: true,
          fontSize: 9,
        },
        tableExample: {
          fontSize: 7,
          margin: [0, 5, 0, 15],
        },
        rightStyle: {
          fontSize: 7,
          alignment: 'right',
          margin: [0, 5, 0, 0],
        },
        underlineStyle: {
          bold: true,
          fontSize: 9,
          decoration: 'underline',
          margin: [100, 10, 0, 0],
        },
      },
    };

    pdfMake.createPdf(docDefinition).open();
  }
}
