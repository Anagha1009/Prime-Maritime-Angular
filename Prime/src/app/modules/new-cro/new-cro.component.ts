import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BOOKING } from 'src/app/models/booking';
import { BookingService } from 'src/app/services/booking.service';
import { CroService } from 'src/app/services/cro.service';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { CommonService } from 'src/app/services/common.service';
import { CRO } from 'src/app/models/cro';
import { getTranslationDeclStmts } from '@angular/compiler/src/render3/view/template';
import { HttpClient } from '@angular/common/http';
import { locale as english } from 'src/app/@core/translate/cro/en';
import { locale as hindi } from 'src/app/@core/translate/cro/hi';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import { Convert } from 'igniteui-angular-core';


const pdfMake = require('pdfmake/build/pdfmake.js');
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-new-cro',
  templateUrl: './new-cro.component.html',
  styleUrls: ['./new-cro.component.scss'],
})
export class NewCroComponent implements OnInit {
  croForm: FormGroup;
  totalContainer:any=0;
  submitted: boolean = false;
  bookingDetails: any;
  containerList: any[] = [];
  croDetails: any;
  croNo: string;
  fileData: any;
  isCRO: boolean = false;
  bookingNo: string = '';
  isRecords: boolean = true;
  email: string = '';

  @ViewChild('openBtn') openBtn: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  excelFile: File;

  constructor(
    private _formBuilder: FormBuilder,
    private _croService: CroService,
    private _bookingService: BookingService,
    private _router: Router,
    private _commonService: CommonService,
    private http: HttpClient,
    private _coreTranslationService: CoreTranslationService
  ) {this._coreTranslationService.translate(english, hindi);}

  ngOnInit(): void {
    this.croForm = this._formBuilder.group({
      CRO_NO: [''],
      BOOKING_ID: [''],
      BOOKING_NO: [''],
      STUFFING_TYPE: ['', Validators.required],
      EMPTY_CONT_PCKP: ['', Validators.required],
      LADEN_ACPT_LOCATION: ['', Validators.required],
      CRO_VALIDITY_DATE: ['', Validators.required],
      REMARKS: ['', Validators.required],
      REQ_QUANTITY: ['', Validators.required],
      GROSS_WT: ['', Validators.required],
      GROSS_WT_UNIT: ['', Validators.required],
      PACKAGES: ['', Validators.required],
      NO_OF_PACKAGES: ['', Validators.required],
      STATUS: ['Drafted'],
      AGENT_NAME: [''],
      AGENT_CODE: [''],
      CREATED_BY: [''],
    });
  }

  get f() {
    return this.croForm.controls;
  }

  SaveCRO() {
    this.submitted = true;
    this.totalContainer=0;
    if (this.croForm.invalid) {
      return;
    }
    this.containerList.forEach((element:any)=>{
      this.totalContainer+=element.IMM_VOLUME_EXPECTED;
    });
    if(Convert.toInt32(this.croForm.get('REQ_QUANTITY')?.value)>this.totalContainer){
      alert('Required Quantity should always be less or equal to the containers in the booking');

    }
    else{
      alert('cro saved successfully');
    }
    // this.croForm.get('BOOKING_ID')?.setValue(this.bookingDetails.ID);
    // this.croForm.get('BOOKING_NO')?.setValue(this.bookingDetails.BOOKING_NO);

    // this.croForm.get('CRO_NO')?.setValue(this.getRandomNumber());
    // this.croForm.get('AGENT_NAME')?.setValue(localStorage.getItem('username'));
    // this.croForm.get('AGENT_CODE')?.setValue(localStorage.getItem('usercode'));
    // this.croForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    // this._croService
    //   .insertCRO(JSON.stringify(this.croForm.value))
    //   .subscribe((res: any) => {
    //     if (res.responseCode == 200) {
    //       this.croNo = res.data;
    //       this.openBtn.nativeElement.click();
    //     }
    //   });
  }

  getRandomNumber() {
    var num = Math.floor(Math.random() * 1e16).toString();
    return 'CRO' + num;
  }

  getBookingDetails() {
    var booking = new BOOKING();
    booking.AGENT_CODE = localStorage.getItem('usercode');
    booking.BOOKING_NO = this.bookingNo;

    this.isCRO = false;
    this._bookingService.getBookingDetails(booking).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.bookingDetails = res.Data;
        this.containerList = res.Data.CONTAINER_LIST;
        this.isCRO = true;
        this.isRecords = true;
      } else if (res.ResponseCode == 500) {
        this.isRecords = false;
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

  async generatePDF() {
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

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBlob((blob: any) => {
      this.http
        .get('assets/img/SI.xlsx', {
          responseType: 'blob',
        })
        .subscribe((data: any) => {
          this.fileData = data;
          const blob1 = new Blob([data], { type: 'application/vnd.ms-excel' });
          this.excelFile = new File([blob1], 'report.xlsx', {
            type: 'application/vnd.ms-excel',
          });

          const formData: FormData = new FormData();
          formData.append('Attachments', blob);
          formData.append('Attachments', this.excelFile);
          console.log('excel ' + this.excelFile);
          formData.append('ToEmail', this.email);
          formData.append('Subject', 'CRO - ' + this.croDetails?.CRO_NO);

          this._commonService.sendEmail(formData).subscribe((res: any) => {
            alert('Your mail has been send successfully !');
            this.closeBtn.nativeElement.click();
            this._router.navigateByUrl('/home/cro-list');
          });
        });
    });
  }
}
