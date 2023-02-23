import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CRO } from 'src/app/models/cro';
import { CroService } from 'src/app/services/cro.service';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { CommonService } from 'src/app/services/common.service';
import { locale as english } from 'src/app/@core/translate/cro/en';
import { locale as hindi } from 'src/app/@core/translate/cro/hi';
import { locale as arabic } from 'src/app/@core/translate/cro/ar';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';

const pdfMake = require('pdfmake/build/pdfmake.js');
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-cro-list',
  templateUrl: './cro-list.component.html',
  styleUrls: ['./cro-list.component.scss'],
})
export class CroListComponent implements OnInit {
  isScroll: boolean = false;
  croList: any[] = [];
  croForm: FormGroup;
  croDetails: any;
  cro = new CRO();
  containerList: any[] = [];
  isLoading: boolean = false;
  isLoading1: boolean = false;

  @ViewChild('openModal') openModal: ElementRef;
  @ViewChild('openModal1') openModal1: ElementRef;

  constructor(
    private _formBuilder: FormBuilder,
    private _croService: CroService,
    private _commonService: CommonService,
    private _coreTranslationService: CoreTranslationService
  ) {
    this._coreTranslationService.translate(english, hindi, arabic);
  }

  ngOnInit(): void {
    this.croForm = this._formBuilder.group({
      CRO_NO: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });

    this.getCROList();
  }

  Search() {
    var CRO_NO = this.croForm.value.CRO_NO;
    var FROM_DATE = this.croForm.value.FROM_DATE;
    var TO_DATE = this.croForm.value.TO_DATE;

    if (CRO_NO == '' && FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
      return;
    }

    this.cro.CRO_NO = CRO_NO;
    this.cro.FROM_DATE = FROM_DATE;
    this.cro.TO_DATE = TO_DATE;

    this.isLoading = true;
    this.getCROList();
  }

  Clear() {
    this.croForm.get('CRO_NO')?.setValue('');
    this.croForm.get('FROM_DATE')?.setValue('');
    this.croForm.get('TO_DATE')?.setValue('');

    this.cro.CRO_NO = '';
    this.cro.FROM_DATE = '';
    this.cro.TO_DATE = '';

    this.isLoading1 = true;
    this.getCROList();
  }

  getCROList() {
    this.cro.AGENT_CODE = this._commonService.getUserCode();
    debugger;
    this._croService.getCROList(this.cro).subscribe((res: any) => {
      this.isLoading = false;
      this.isLoading1 = false;
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
    cro.AGENT_CODE = this._commonService.getUserCode();
    cro.CRO_NO = CRO_NO;

    this._croService.getCRODetails(cro).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.croDetails = res.Data;
        console.log(this.croDetails);
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
          width: 100,
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
              { text: this.croDetails?.CONTACT },
            ],
            [
              {
                text: `Date: ${this._commonService.getcurrentDate(
                  new Date(this.croDetails?.CREATED_DATE)
                )}`,
                bold: true,
                alignment: 'right',
              },
              {
                text: `${this.croDetails?.CRO_NO}`,
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
                text:
                  this.croDetails?.BOOKING_NO == null
                    ? '-'
                    : this.croDetails?.BOOKING_NO == ''
                    ? '-'
                    : this.croDetails?.BOOKING_NO,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text:
                  this.croDetails?.LADEN_ACPT_LOCATION == null
                    ? '-'
                    : this.croDetails?.LADEN_ACPT_LOCATION == ''
                    ? '-'
                    : this.croDetails?.LADEN_ACPT_LOCATION,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text:
                  this.croDetails?.CUSTOMER_NAME == null
                    ? '-'
                    : this.croDetails?.CUSTOMER_NAME == ''
                    ? '-'
                    : this.croDetails?.CUSTOMER_NAME,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text:
                  this.croDetails?.EMAIL == null
                    ? '-'
                    : this.croDetails?.EMAIL == ''
                    ? '-'
                    : this.croDetails?.EMAIL,
                margin: [0, 0, 0, 5],
                fontsize: 10,
              },
              {
                text:
                  this.croDetails?.CONTACT == null
                    ? '-'
                    : this.croDetails?.CONTACT == ''
                    ? '-'
                    : this.croDetails?.CONTACT,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: this._commonService.getcurrentDate(
                  new Date(this.croDetails?.CRO_VALIDITY_DATE)
                ),
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
                text:
                  this.croDetails?.SERVICE_NAME == null
                    ? '-'
                    : this.croDetails?.SERVICE_NAME == ''
                    ? '-'
                    : this.croDetails?.SERVICE_NAME,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text:
                  this.croDetails?.POL == null
                    ? '-'
                    : this.croDetails?.POL == ''
                    ? '-'
                    : this.croDetails?.POL,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text:
                  this.croDetails?.POD == null
                    ? '-'
                    : this.croDetails?.POD == ''
                    ? '-'
                    : this.croDetails?.POD,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text:
                  this.croDetails?.FINAL_DESTINATION == null
                    ? '-'
                    : this.croDetails?.FINAL_DESTINATION == ''
                    ? '-'
                    : this.croDetails?.FINAL_DESTINATION,
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
          text: this.croDetails?.COMMODITY,
          fontSize: 10,
          margin: [0, 0, 0, 10],
        },
        {
          // optional
          table: {
            headerRows: 1,
            widths: ['*', '*', '*'],
            body: [
              ['Container Type', 'Quantity', 'Service Mode'],
              ...this.croDetails?.ContainerList.map((p: any) => [
                {
                  text: p.CONTAINER_TYPE,
                  fontSize: 10,
                },
                { text: this.croDetails?.REQ_QUANTITY, fontSize: 10 },
                { text: p.SERVICE_MODE, fontSize: 10 },
              ]),
            ],
          },
        },
        {
          margin: [0, 10, 0, 0],
          fontSize: 10,
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
}
