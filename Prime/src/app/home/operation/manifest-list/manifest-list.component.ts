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
  finalList: any[] = [];
  freightList: any[] = [];

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
        this.isLoading = false;
        if (res.ResponseCode == 200) {
          this.cargoList = res.Data;
          this.isManifest = true;

          res.Data.CUSTOMER_LIST.forEach((cust: any) => {
            const findEmp = res.Data.CONTAINER_LIST.filter(
              (el2: any) => el2.BL_NO === cust.BL_NO
            ).map((element: any) => element);

            const findFreight = res.Data.FREIGHT_DETAILS.filter(
              (el3: any) => el3.BL_NO === cust.BL_NO
            ).map((element1: any) => element1);

            this.finalList.push({
              KEY1: 'BL',
              KEY2: 'SHIPPER',
              KEY3: 'CONSIGNEE',
              KEY4: 'NOTIFY',
              KEY5: 'MARKS',
              KEY6: 'DESC',
              KEY7: 'GWT',
              KEY8: 'DM',
              KEY9: 'V',
              KEY10: '20',
              KEY11: '40',
            });
            this.finalList.push(cust);
            this.finalList.push({
              KEY1: '**',
              KEY2: '',
              KEY3: '',
              KEY4: '',
              KEY5: '',
              KEY6: '',
              KEY7: '',
              KEY8: '',
              KEY9: '',
              KEY10: '',
              KEY11: '',
            });
            this.finalList.push({
              KEY1: 'Container No',
              KEY2: 'Size',
              KEY3: 'Type',
              KEY4: 'Seal No',
              KEY5: 'NOPCKG',
              KEY6: 'GWT',
              KEY7: 'V',
              KEY8: 'I',
              KEY9: 'UN',
              KEY10: 'T',
              KEY11: 'SOC',
            });
            findEmp.forEach((z: any) => {
              this.finalList.push(z);
            });
            this.finalList.push({
              KEY1: '*',
              KEY2: '',
              KEY3: '',
              KEY4: '',
              KEY5: '',
              KEY6: '',
              KEY7: '',
              KEY8: '',
              KEY9: '',
              KEY10: '',
              KEY11: '',
            });

            this.freightList.push({
              KEY1: 'BL',
              KEY2: 'SHIPPER',
              KEY3: 'CONSIGNEE',
              KEY4: 'NOTIFY',
              KEY5: 'MARKS',
              KEY6: 'DESC',
              KEY7: 'GWT',
              KEY8: 'DM',
              KEY9: 'V',
              KEY10: '20',
              KEY11: '40',
            });
            this.freightList.push(cust);
            this.freightList.push({
              KEY1: '**',
              KEY2: '',
              KEY3: '',
              KEY4: '',
              KEY5: '',
              KEY6: '',
              KEY7: '',
              KEY8: '',
              KEY9: '',
              KEY10: '',
              KEY11: '',
            });
            this.freightList.push({
              KEY1: 'Charge',
              KEY2: 'Rate Basis',
              KEY3: 'Currency',
              KEY4: 'Rate',
              KEY5: 'Pre',
              KEY6: 'Amount',
              KEY7: '',
              KEY8: '',
              KEY9: '',
              KEY10: '',
              KEY11: '',
            });
            findFreight.forEach((z: any) => {
              this.freightList.push(z);
            });
            this.freightList.push({
              KEY1: '**',
              KEY2: '',
              KEY3: '',
              KEY4: '',
              KEY5: '',
              KEY6: '',
              KEY7: '',
              KEY8: '',
              KEY9: '',
              KEY10: '',
              KEY11: '',
            });
            this.freightList.push({
              KEY1: 'Container No',
              KEY2: 'Size',
              KEY3: 'Type',
              KEY4: 'Seal No',
              KEY5: 'NOPCKG',
              KEY6: 'GWT',
              KEY7: 'V',
              KEY8: 'I',
              KEY9: 'UN',
              KEY10: 'T',
              KEY11: 'SOC',
            });
            findEmp.forEach((z: any) => {
              this.freightList.push(z);
            });
            this.freightList.push({
              KEY1: '*',
              KEY2: '',
              KEY3: '',
              KEY4: '',
              KEY5: '',
              KEY6: '',
              KEY7: '',
              KEY8: '',
              KEY9: '',
              KEY10: '',
              KEY11: '',
            });
          });
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
            //headerRows: 1,
            body: [
              ...this.finalList.map((p: any) => [
                p.KEY1 == 'BL'
                  ? { text: 'BL No / Date', style: 'tableHeader' }
                  : p.KEY1 == 'Container No'
                  ? { text: 'Container No', style: 'tableHeader' }
                  : p.KEY1 == '*'
                  ? {
                      canvas: [
                        {
                          type: 'line',
                          x1: 0,
                          y1: 0,
                          x2: 780,
                          y2: 0,
                          lineWidth: 2,
                        },
                      ],
                      colSpan: 11,
                      margin: [0, 10, 0, 10],
                    }
                  : p.KEY1 == '**'
                  ? {
                      canvas: [
                        {
                          type: 'line',
                          x1: 0,
                          y1: 0,
                          x2: 780,
                          y2: 0,
                          lineWidth: 1,
                          lineColor: 'gray',
                        },
                      ],
                      colSpan: 11,
                      margin: [0, 10, 0, 10],
                    }
                  : p.KEY1,
                p.KEY2 == 'SHIPPER'
                  ? { text: 'Shipper', style: 'tableHeader' }
                  : p.KEY2 == 'Size'
                  ? { text: 'Size', style: 'tableHeader' }
                  : p.KEY2 == '20GP'
                  ? p.KEY2.substring(0, 2)
                  : p.KEY2,
                p.KEY3 == 'CONSIGNEE'
                  ? { text: 'Consignee', style: 'tableHeader' }
                  : p.KEY3 == 'Type'
                  ? { text: 'Type', style: 'tableHeader' }
                  : p.KEY3,
                p.KEY4 == 'NOTIFY'
                  ? { text: 'Notify', style: 'tableHeader' }
                  : p.KEY4 == 'Seal No'
                  ? { text: 'Seal No', style: 'tableHeader' }
                  : p.KEY4,
                p.KEY5 == 'MARKS'
                  ? { text: 'Marks & Numbers', style: 'tableHeader' }
                  : p.KEY5 == 'NOPCKG'
                  ? { text: 'No. of PKGS and Type', style: 'tableHeader' }
                  : p.KEY5,
                p.KEY6 == 'DESC'
                  ? {
                      text: 'No & Kind of Pkgs. Description of Goods',
                      style: 'tableHeader',
                    }
                  : p.KEY6 == 'GWT'
                  ? { text: 'Gross Weight (KGS)', style: 'tableHeader' }
                  : p.KEY6,
                p.KEY7 == 'GWT'
                  ? { text: 'Gr Wt/ Net Wt in Kgs', style: 'tableHeader' }
                  : p.KEY7 == 'V'
                  ? { text: 'Volume CBM', style: 'tableHeader' }
                  : p.KEY7,
                p.KEY8 == 'DM'
                  ? { text: 'Rcpt./Divy. Mode', style: 'tableHeader' }
                  : p.KEY8 == 'I'
                  ? { text: 'IMO CLass', style: 'tableHeader' }
                  : p.KEY8,
                p.KEY9 == 'V'
                  ? { text: 'VOLUME', style: 'tableHeader' }
                  : p.KEY9 == 'UN'
                  ? { text: 'UN No.', style: 'tableHeader' }
                  : p.KEY9,
                p.KEY10 == '20'
                  ? { text: "20'", style: 'tableHeader' }
                  : p.KEY10 == 'T'
                  ? { text: 'Temp', style: 'tableHeader' }
                  : p.KEY10,
                p.KEY11 == 'SOC'
                  ? { text: 'SOC', style: 'tableHeader' }
                  : p.KEY11 == '40'
                  ? { text: "40'", style: 'tableHeader' }
                  : p.KEY11,
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
          fontSize: 10,
          alignment: 'center',
          bold: true,
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
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
            body: [
              ...this.freightList.map((p: any) => [
                p.KEY1 == 'BL'
                  ? { text: 'BL No / Date', style: 'tableHeader' }
                  : p.KEY1 == 'Container No'
                  ? { text: 'Container No', style: 'tableHeader' }
                  : p.KEY1 == '*'
                  ? {
                      canvas: [
                        {
                          type: 'line',
                          x1: 0,
                          y1: 0,
                          x2: 780,
                          y2: 0,
                          lineWidth: 2,
                        },
                      ],
                      colSpan: 11,
                      margin: [0, 10, 0, 10],
                    }
                  : p.KEY1 == '**'
                  ? {
                      canvas: [
                        {
                          type: 'line',
                          x1: 0,
                          y1: 0,
                          x2: 780,
                          y2: 0,
                          lineWidth: 1,
                          lineColor: 'gray',
                        },
                      ],
                      colSpan: 11,
                      margin: [0, 10, 0, 10],
                    }
                  : p.KEY1 == 'Charge'
                  ? { text: 'Chrg.Code', style: 'tableHeader' }
                  : p.KEY1,
                p.KEY2 == 'SHIPPER'
                  ? { text: 'Shipper', style: 'tableHeader' }
                  : p.KEY2 == 'Size'
                  ? { text: 'Size', style: 'tableHeader' }
                  : p.KEY2 == '20GP'
                  ? p.KEY2.substring(0, 2)
                  : p.KEY2 == 'Rate Basis'
                  ? { text: 'Rate Basis', style: 'tableHeader' }
                  : p.KEY2,
                p.KEY3 == 'CONSIGNEE'
                  ? { text: 'Consignee', style: 'tableHeader' }
                  : p.KEY3 == 'Type'
                  ? { text: 'Type', style: 'tableHeader' }
                  : p.KEY3 == 'Currency'
                  ? { text: 'Currency', style: 'tableHeader' }
                  : p.KEY3,
                p.KEY4 == 'NOTIFY'
                  ? { text: 'Notify', style: 'tableHeader' }
                  : p.KEY4 == 'Seal No'
                  ? { text: 'Seal No', style: 'tableHeader' }
                  : p.KEY4 == 'Rate'
                  ? { text: 'Rate', style: 'tableHeader' }
                  : p.KEY4,
                p.KEY5 == 'MARKS'
                  ? { text: 'Marks & Numbers', style: 'tableHeader' }
                  : p.KEY5 == 'NOPCKG'
                  ? { text: 'No. of PKGS and Type', style: 'tableHeader' }
                  : p.KEY5 == 'Pre'
                  ? { text: 'Prepaid/ Collect', style: 'tableHeader' }
                  : p.KEY5,
                p.KEY6 == 'DESC'
                  ? {
                      text: 'No & Kind of Pkgs. Description of Goods',
                      style: 'tableHeader',
                    }
                  : p.KEY6 == 'GWT'
                  ? { text: 'Gross Weight (KGS)', style: 'tableHeader' }
                  : p.KEY6 == 'Amount'
                  ? { text: 'Amount', style: 'tableHeader' }
                  : p.KEY6,
                p.KEY7 == 'GWT'
                  ? { text: 'Gr Wt/ Net Wt in Kgs', style: 'tableHeader' }
                  : p.KEY7 == 'V'
                  ? { text: 'Volume CBM', style: 'tableHeader' }
                  : p.KEY7,
                p.KEY8 == 'DM'
                  ? { text: 'Rcpt./Divy. Mode', style: 'tableHeader' }
                  : p.KEY8 == 'I'
                  ? { text: 'IMO CLass', style: 'tableHeader' }
                  : p.KEY8,
                p.KEY9 == 'V'
                  ? { text: 'VOLUME', style: 'tableHeader' }
                  : p.KEY9 == 'UN'
                  ? { text: 'UN No.', style: 'tableHeader' }
                  : p.KEY9,
                p.KEY10 == '20'
                  ? { text: "20'", style: 'tableHeader' }
                  : p.KEY10 == 'T'
                  ? { text: 'Temp', style: 'tableHeader' }
                  : p.KEY10,
                p.KEY11 == 'SOC'
                  ? { text: 'SOC', style: 'tableHeader' }
                  : p.KEY11 == '40'
                  ? { text: "40'", style: 'tableHeader' }
                  : p.KEY11,
              ]),
            ],
          },
          layout: 'noBorders',
          margin: [0, 0, 20, 0],
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
