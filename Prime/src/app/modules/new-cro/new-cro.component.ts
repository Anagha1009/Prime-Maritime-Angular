import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BOOKING } from 'src/app/models/booking';
import { BookingService } from 'src/app/services/booking.service';
import { CroService } from 'src/app/services/cro.service';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { CommonService } from 'src/app/services/common.service';
import { CRO } from 'src/app/models/cro';
import { HttpClient } from '@angular/common/http';
import { locale as english } from 'src/app/@core/translate/cro/en';
import { locale as hindi } from 'src/app/@core/translate/cro/hi';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';

const pdfMake = require('pdfmake/build/pdfmake.js');
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-new-cro',
  templateUrl: './new-cro.component.html',
  styleUrls: ['./new-cro.component.scss'],
})
export class NewCroComponent implements OnInit {
  croForm: FormGroup;
  totalContainer: any = 0;
  submitted: boolean = false;
  bookingDetails: any;
  containerList: any[] = [];
  croDetails: any;
  croNo: string;
  fileData: any;
  isCRO: boolean = false;
  bookingNo: any;
  isRecords: boolean = true;
  email: string = '';
  packageList: any[] = [];
  isLoading: boolean = false;
  currentDate: string = '';
  icdList: any[] = [];
  cfsList: any[] = [];
  depoList: any[] = [];
  portList: any[] = [];
  terminalList: any[] = [];
  isemail: boolean = true;

  @ViewChild('openBtn') openBtn: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  excelFile: File;
  pdfFile: File;

  constructor(
    private _formBuilder: FormBuilder,
    private _croService: CroService,
    private _bookingService: BookingService,
    private _router: Router,
    private _commonService: CommonService,
    private http: HttpClient,
    private _coreTranslationService: CoreTranslationService,
    private _activatedRoute: ActivatedRoute
  ) {
    this._coreTranslationService.translate(english, hindi);
  }

  ngOnInit(): void {
    var newDate = new Date();
    this.currentDate = this._commonService.getcurrentDate(newDate);

    this.croForm = this._formBuilder.group({
      CRO_NO: [''],
      BOOKING_ID: [''],
      BOOKING_NO: [''],
      STUFFING_TYPE: ['', Validators.required],
      EMPTY_CONT_PCKP: ['', Validators.required],
      LADEN_ACPT_LOCATION: ['', Validators.required],
      CRO_VALIDITY_DATE: ['', Validators.required],
      REMARKS: [''],
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

    this.getDropdown();

    this.bookingNo = this._activatedRoute.snapshot.paramMap.get('BOOKING_NO');
    if (this.bookingNo != undefined) {
      this.getBookingDetails();
    }
  }

  getDropdown() {
    this._commonService.getDropdownData('PACKAGES').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.packageList = res.Data;
      }
    });

    this._commonService.getDropdownData('PORT').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.portList = res.Data;
      }
    });

    this._commonService.getDropdownData('ICD').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.icdList = res.Data;
      }
    });

    this._commonService.getDropdownData('TERMINAL').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.terminalList = res.Data;
      }
    });

    this._commonService.getDropdownData('CFS').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.cfsList = res.Data;
      }
    });

    this._commonService.getDropdownData('DEPO').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.depoList = res.Data;
      }
    });
  }

  get f() {
    return this.croForm.controls;
  }

  SaveCRO() {
    this.submitted = true;
    this.totalContainer = 0;
    if (this.croForm.invalid) {
      return;
    }
    this.croForm.get('BOOKING_ID')?.setValue(this.bookingDetails.ID);
    this.croForm.get('BOOKING_NO')?.setValue(this.bookingDetails.BOOKING_NO);

    this.croForm.get('CRO_NO')?.setValue(this.getRandomNumber());
    this.croForm.get('AGENT_NAME')?.setValue(localStorage.getItem('username'));
    this.croForm.get('AGENT_CODE')?.setValue(localStorage.getItem('usercode'));
    this.croForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    this._croService
      .insertCRO(JSON.stringify(this.croForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this.croNo = res.data;
          this.openBtn.nativeElement.click();
        }
      });
  }

  numericOnly(event: any): boolean {
    // restrict e,+,-,E characters in  input type number
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode == 101 || charCode == 69 || charCode == 45 || charCode == 43) {
      return false;
    }
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
    return true;
  }

  getRandomNumber() {
    return this._commonService.getRandomNumber('CRO');
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

    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 5);

    var x = this._commonService.getcurrentDate(currentDate);
    this.croForm.get('CRO_VALIDITY_DATE')?.setValue(x);
  }

  getCRODetails(CRO_NO: string) {
    var cro = new CRO();
    cro.AGENT_CODE = localStorage.getItem('usercode');
    cro.CRO_NO = CRO_NO;

    if (this.email == '') {
      this.isemail = false;
      return;
    }

    this.isLoading = true;
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
          text:
            'Remarks:\n\n1) PLS DO NOT PICK UP DAMAGE CONTAINER, ANY CLAIM FROM DESTINATION WILL BE COLLECTED FROM CONSIGNEE' +
            '\n2) All containers mis-declared for weight will be charged in line with the scale of rates for misdeclaration.' +
            'This charge will be applied with immediate effect. In order to avoid this charge, please advise all concerned to ensure declaration of' +
            'correct weight at the time of booking.' +
            '\n3) LINE WILL NOT BE RESPONSIBLE FOR EARLY CLOSURE OF GATE / NOT OPENING OF GATE FOR A' +
            'PARTICULAR TERMINAL / VESSEL' +
            '\n4) Containers will not be loaded without duplicate shipping bill in our custody' +
            '\n5) Please gate-in the containers at most 3 days before vessel ETA. Containers gated-in earlier shall incur ground rent which will be' +
            'On shipper&#39;s account.' +
            '\n\nGeneral Instructions' +
            '\n\nTHIS D.O IS VALID FOR FOUR (4) DAYS FROM TODAY I.E. ( ) NO DELIVERIES WILL BE ALLOWED FROM THE' +
            'STORAGE YARD BEYOND SEABIRD MARINE SERVICES PVT LTD CONTR TERMINAL:' +
            '\nPLEASE NOTE THAT YOU ARE NOT PERMITTED TO HONOUR THIS D.O. AFTER – Date of Expiry' +
            '\n\n1. Export Detention on containers will be applicable as per lines prevailing tariff.' +
            '\n2. Please do not exceed the permitted maximum gross weight shown on the container.' +
            '\n3. Containers that are picked up from empty yard at origin by the Exporter or their Agents per the Booking release order shall be' +
            'resumed to have been inspected and accepted in good and sound condition for the purpose of cargo stuffing. Consignee (Buyers)' +
            'shall be responsible to return the containers to our custody in good and sound condition at destination after cargo is unstuffed.' +
            '\n4. Containers are moved by Export/C &amp; F agents at their own risk/cost. Any damage to the container shall be borne by Exporter/C &amp;' +
            'F agent.' +
            '\n5. C &amp; F agent/Exporters are requested to prepare container load plan and put Co.&#39;s Stamp / Sign.' +
            '\n6. In case of hazardous cargo, please apply hazardous cargo sticker &amp; put all details.',
        },
        {
          pageBreak: 'before',
          image: await this._commonService.getBase64ImageFromURL(
            'assets/img/logo_p.png'
          ),
          alignment: 'right',
          height: 50,
          width: 90,
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
              { text: this.croDetails?.EMAIL },
              { text: this.croDetails?.CONTACT },
            ],
            [
              {
                text: `Date: ${this._commonService.getcurrentDate(new Date())}`,
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
                text: this.croDetails?.LADEN_ACPT_LOCATION,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: this.croDetails?.CUSTOMER_NAME,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: this.croDetails?.EMAIL,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: this.croDetails?.CONTACT,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: this.croForm.value?.CRO_VALIDITY_DATE,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
            ],
            [
              {
                text: 'Vessel/ Voyage:',
                margin: [0, 0, 0, 5],
                bold: true,
                fontSize: 10,
              },
              {
                text: 'ETA:',
                margin: [0, 0, 0, 5],
                bold: true,
                fontSize: 10,
              },
              {
                text: 'ETD:',
                margin: [0, 0, 0, 5],
                bold: true,
                fontSize: 10,
              },
              {
                text: 'Service:',
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
                text: 'FPOD:',
                margin: [0, 0, 0, 5],
                bold: true,
                fontSize: 10,
              },
            ],
            [
              {
                text:
                  this.croDetails?.BookingDetails?.VESSEL_NAME +
                  '/ ' +
                  this.croDetails?.BookingDetails?.VOYAGE_NO,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: this._commonService.getcurrentDate(
                  new Date(this.croDetails?.ETA)
                ),
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: this._commonService.getcurrentDate(
                  new Date(this.croDetails?.ETD)
                ),
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: this.croDetails?.SERVICE_NAME,
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
                text: this.croDetails?.FINAL_DESTINATION,
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
          this.excelFile = new File([blob1], 'SI.xlsx', {
            type: 'application/vnd.ms-excel',
          });

          const blob2 = new Blob([blob], { type: 'application/pdf' });
          this.pdfFile = new File([blob2], 'CRO.pdf', {
            type: 'application/pdf',
          });

          const body: string =
            'Hi ' +
            '<b>' +
            this.croDetails?.CUSTOMER_NAME +
            '</b>, <br><br>' +
            'Your CRO (' +
            this.croDetails?.CRO_NO +
            ') has successfully been created ! Below are the booking details along with Shipping Instructions & CRO attached.<br><br>' +
            '<b>POL: </b> ' +
            this.croDetails?.POL +
            '<br>' +
            '<b>POD: </b>' +
            this.croDetails?.POD +
            '<br>' +
            '<b>Containers: </b>' +
            this.croDetails?.CONTAINERS +
            '<br>' +
            '<b>Vessel/ Voyage: </b>' +
            this.croDetails?.BookingDetails?.VESSEL_NAME +
            '/' +
            this.croDetails?.BookingDetails?.VOYAGE_NO +
            '<br>' +
            '<b>ETA: </b>' +
            this._commonService.getcurrentDate(new Date(this.croDetails?.ETA)) +
            '<br>' +
            '<b>ETD: </b>' +
            this._commonService.getcurrentDate(new Date(this.croDetails?.ETD)) +
            '<br>';

          const formData: FormData = new FormData();
          formData.append('Attachments', this.pdfFile);
          formData.append('Attachments', this.excelFile);
          formData.append('ToEmail', this.email);
          formData.append('Subject', 'CRO - ' + this.croDetails?.CRO_NO);
          formData.append('Body', body);

          this._commonService.sendEmail(formData).subscribe((res: any) => {
            this.isLoading = false;
            this._commonService.successMsg(
              'Your mail has been send successfully !'
            );
            this.closeBtn.nativeElement.click();
            this._router.navigateByUrl('/home/cro-list');
          });
        });
    });
  }

  ClearForm() {
    this.croForm.reset();
    this.croForm.get('STUFFING_TYPE')?.setValue('');
    this.croForm.get('EMPTY_CONT_PCKP')?.setValue('');
    this.croForm.get('LADEN_ACPT_LOCATION')?.setValue('');
    this.croForm.get('PACKAGES')?.setValue('');
    this.croForm.get('GROSS_WT_UNIT')?.setValue('');
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 5);
    var x = this._commonService.getcurrentDate(currentDate);
    this.croForm.get('CRO_VALIDITY_DATE')?.setValue(x);
  }
}
