import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CRO } from 'src/app/models/cro';
import { CroService } from 'src/app/services/cro.service';
import pdfFonts from 'pdfmake/build/vfs_fonts';

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

  @ViewChild('openModal') openModal: ElementRef;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _croService: CroService
  ) {}

  ngOnInit(): void {
    this.getCROList();
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

  openBLModal(item: any) {
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
          image: await this.getBase64ImageFromURL(
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
  }

  table(data: any, columns: any) {
    return {
      table: {
        headerRows: 1,
        body: this.buildTableBody(data, columns),
      },
    };
  }

  buildTableBody(data: any, columns: any) {
    var body = [];

    body.push(columns);

    data.forEach(function (row: any) {
      var dataRow: any[] = [];

      columns.forEach(function (column: any) {
        dataRow.push(row[column]);
      });

      body.push(dataRow);
    });

    return body;
  }

  getBase64ImageFromURL(url: any) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = (error) => {
        reject(error);
      };

      img.src = url;
    });
  }
}
