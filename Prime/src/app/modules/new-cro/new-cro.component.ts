import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CroService } from 'src/app/services/cro.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { url } from 'inspector';
import { BookingService } from 'src/app/services/booking.service';
import { BOOKING } from 'src/app/models/quotation';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-new-cro',
  templateUrl: './new-cro.component.html',
  styleUrls: ['./new-cro.component.scss'],
})
export class NewCroComponent implements OnInit {
  croForm: FormGroup;
  submitted: boolean = false;
  bookingDetails: any;
  containerList: any[] = [];

  constructor(
    private FormBuilder: FormBuilder,
    private _croService: CroService,
    private _bookingService: BookingService,
    private _router: Router,
    private _activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.croForm = this.FormBuilder.group({
      BOOKING_ID: [1],
      BOOKING_NO: ['123'],
      STUFFING_TYPE: ['', Validators.required],
      EMPTY_CONT_PCKP: ['', Validators.required],
      LADEN_ACPT_LOCATION: ['', Validators.required],
      RO_VALIDITY_DATE: ['', Validators.required],
      REMARKS: [''],
      REQ_QUANTITY: ['', Validators.required],
      GROSS_WT: ['', Validators.required],
      GROSS_WT_UNIT: ['', Validators.required],
      PACKAGES: ['', Validators.required],
      NO_OF_PACKAGES: [''],
      STATUS: ['Drafted'],
      AGENT_NAME: [''],
      AGENT_CODE: [''],
      CREATED_BY: [''],
    });

    var bookingNo = this._activateRoute.snapshot.paramMap.get('BOOKING_NO');

    this.getBookingDetails(bookingNo);
  }

  get f() {
    return this.croForm.controls;
  }

  SaveCRO() {
    this.croForm.get('AGENT_NAME')?.setValue(localStorage.getItem('username'));

    this.croForm.get('AGENT_CODE')?.setValue(localStorage.getItem('rolecode'));

    this.croForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    console.log(JSON.stringify(this.croForm.value));
    this._croService
      .insertCRO(JSON.stringify(this.croForm.value))
      .subscribe((res) => {
        if (res.responseCode == 200) {
          alert('Your CRO has been submitted successfully !');
          this._router.navigateByUrl('home/agent-dashboard');
        }
      });
  }

  getBookingDetails(bookingNo) {
    var booking = new BOOKING();
    booking.AGENT_CODE = +localStorage.getItem('rolecode');
    booking.BOOKING_NO = bookingNo;

    this._bookingService.getBookingDetails(booking).subscribe((res) => {
      if (res.ResponseCode == 200) {
        this.bookingDetails = res.Data;
        this.containerList = res.Data.CONTAINER_LIST;
      }
    });
  }

  async generatePDF() {
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
                text: 'Anagha',
                bold: true,
              },
              { text: 'Navi Mumbai' },
              { text: 'a@shds.sfdf' },
              { text: '6473463' },
            ],
            [
              {
                text: `Date: ${new Date().toLocaleString()}`,
                alignment: 'right',
              },
              {
                text: `CRO No : ${(Math.random() * 1000).toFixed(0)}`,
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
              { text: 'BK5664654775', margin: [0, 0, 0, 5], fontSize: 10 },
              { text: 'MUMBAI', margin: [0, 0, 0, 5], fontSize: 10 },
              { text: 'xx', margin: [0, 0, 0, 5], fontSize: 10 },
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
                text: 'Damam',
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: 'Mumdra',
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: 'Mundra',
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: '0234',
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
            ],
          ],
          ul: [
            'Order can be return in max 10 days.',
            'Warrenty of the product will be subject to the manufacturer terms and conditions.',
            'This is system generated invoice.',
          ],
        },
        {
          text: 'Container Details',
          style: 'sectionHeader',
        },
        {
          layout: 'lightHorizontalLines', // optional
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 100, '*'],

            body: [
              ['First', 'Second', 'Third', 'The last one'],
              ['Value 1', 'Value 2', 'Value 3', 'Value 4'],
              [{ text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4'],
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

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

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
