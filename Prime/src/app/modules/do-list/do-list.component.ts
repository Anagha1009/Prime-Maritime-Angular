import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Bl } from 'src/app/models/bl';
import { DO } from 'src/app/models/do';
import { BlService } from 'src/app/services/bl.service';
import { DoService } from 'src/app/services/do.service';
import { locale as english } from 'src/app/@core/translate/do/en';
import { locale as hindi } from 'src/app/@core/translate/do/hi';
import { locale as arabic } from 'src/app/@core/translate/do/ar';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import { CommonService } from 'src/app/services/common.service';
import pdfFonts from 'pdfmake/build/vfs_fonts';


const pdfMake = require('pdfmake/build/pdfmake.js');
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-do-list',
  templateUrl: './do-list.component.html',
  styleUrls: ['./do-list.component.scss'],
})
export class DoListComponent implements OnInit {
  dO = new DO();
  doList: any[] = [];
  containerList: any[] = [];
  doDetails: any;

  isScroll: boolean = false;
  doListForm: FormGroup;
  previewNoData: boolean = false;
  previewList: boolean = false;
  isLoading: boolean = false;

  constructor(
    private _dOService: DoService,
    private _blService: BlService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _coreTranslationService: CoreTranslationService,
    private _commonService: CommonService,

    private _cs: CommonService
  ) {
    this._coreTranslationService.translate(english, hindi, arabic);
  }

  ngOnInit(): void {
    this.doListForm = this._formBuilder.group({
      DO_NO: [''],
      FROM_DATE: [''],
      TO_DATE: [''],
    });
    this.getDOList();
  }

  getDOList() {
    debugger;
    this.previewList = false;
    this.previewNoData = false;

    this.dO.AGENT_CODE = this._cs.getUserCode();
    this.dO.OPERATION = 'GET_DOLIST';
    this.isLoading = true;
    this._dOService.getDOList(this.dO).subscribe(
      (res: any) => {
        this.doList = [];
        this.isScroll = false;
        if (res.hasOwnProperty('Data')) {
          if (res.Data?.length > 0) {
            this.doList = res.Data;
            //getContainerCount
            this.getContainerCount();
            this.previewList = true;
            this.isLoading = false;
            if (this.doList?.length >= 4) {
              this.isScroll = true;
            } else {
              this.isScroll = false;
            }
          }
        }
        if (res.ResponseCode == 500) {
          this.previewNoData = true;
          this.isLoading = false;
        }
      },
      (error: any) => {
        if (error.status == 401) {
          alert('You are not authorized to access this page, please login');
          this._router.navigateByUrl('login');
        }
      }
    );
  }

  getContainerCount() {
    this.doList.forEach((element: { DO_NO: any; ContainerCount: any }) => {
      this.containerList = [];
      var bl = new Bl();
      bl.AGENT_CODE = this._cs.getUserCode();
      bl.DO_NO = element.DO_NO;
      this._blService.getContainerList(bl).subscribe((res: any) => {
        if (res.ResponseCode == 200) {
          this.containerList = res.Data;
          if (this.containerList?.length > 0) {
            element.ContainerCount = this.containerList?.length;
            //this.previewList=true;
          }
        }
      });
    });
  }

  Search() {
    var DO_NO = this.doListForm.value.DO_NO;
    var FROM_DATE = this.doListForm.value.FROM_DATE;
    var TO_DATE = this.doListForm.value.TO_DATE;
    if (DO_NO == '' && FROM_DATE == '' && TO_DATE == '') {
      alert('Please enter atleast one filter to search !');
      return;
    }
    this.dO.DO_NO = DO_NO;
    this.dO.DO_DATE = FROM_DATE;
    this.dO.DO_VALIDITY = TO_DATE;

    this.getDOList();
  }

  Clear() {
    this.doListForm.get('DO_NO')?.setValue('');
    this.doListForm.get('FROM_DATE')?.setValue('');
    this.doListForm.get('TO_DATE')?.setValue('');

    this.dO.DO_NO = '';
    this.dO.DO_DATE = '';
    this.dO.DO_VALIDITY = '';

    this.getDOList();
  }

  getDODetails(doNo: any) {
    debugger;
    localStorage.setItem('DO_NO', doNo);
    this._router.navigateByUrl('home/do-details');
  }

  getDeliveryDetails(DO_NO: string) {
    debugger;
    var dO = new DO();
    dO.AGENT_CODE = this._commonService.getUserCode();
    dO.DO_NO = DO_NO;

    this._dOService.getDODetails(dO).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.doDetails = res.Data;
        console.log(this.doDetails);
        this.generatePDF();
      }
    });
  }

   async generatePDF() {
    let docDefinition = {
      header: {
        text: 'INCHCAPE SHIPPING SERVICES LLC',
        margin: [10, 10, 0, 0],
      },
      content: [
        // {
        //   text:
        //     'Remarks:\n\n1) PLS DO NOT PICK UP DAMAGE CONTAINER, ANY CLAIM FROM DESTINATION WILL BE COLLECTED FROM CONSIGNEE' +
        //     '\n2) All containers mis-declared for weight will be charged in line with the scale of rates for misdeclaration.' +
        //     'This charge will be applied with immediate effect. In order to avoid this charge, please advise all concerned to ensure declaration of' +
        //     'correct weight at the time of booking.' +
        //     '\n3) LINE WILL NOT BE RESPONSIBLE FOR EARLY CLOSURE OF GATE / NOT OPENING OF GATE FOR A' +
        //     'PARTICULAR TERMINAL / VESSEL' +
        //     '\n4) Containers will not be loaded without duplicate shipping bill in our custody' +
        //     '\n5) Please gate-in the containers at most 3 days before vessel ETA. Containers gated-in earlier shall incur ground rent which will be' +
        //     'On shipper&#39;s account.' +
        //     '\n\nGeneral Instructions' +
        //     '\n\nTHIS D.O IS VALID FOR FOUR (4) DAYS FROM TODAY I.E. ( ) NO DELIVERIES WILL BE ALLOWED FROM THE' +
        //     'STORAGE YARD BEYOND SEABIRD MARINE SERVICES PVT LTD CONTR TERMINAL:' +
        //     '\nPLEASE NOTE THAT YOU ARE NOT PERMITTED TO HONOUR THIS D.O. AFTER – Date of Expiry' +
        //     '\n\n1. Export Detention on containers will be applicable as per lines prevailing tariff.' +
        //     '\n2. Please do not exceed the permitted maximum gross weight shown on the container.' +
        //     '\n3. Containers that are picked up from empty yard at origin by the Exporter or their Agents per the Booking release order shall be' +
        //     'resumed to have been inspected and accepted in good and sound condition for the purpose of cargo stuffing. Consignee (Buyers)' +
        //     'shall be responsible to return the containers to our custody in good and sound condition at destination after cargo is unstuffed.' +
        //     '\n4. Containers are moved by Export/C &amp; F agents at their own risk/cost. Any damage to the container shall be borne by Exporter/C &amp;' +
        //     'F agent.' +
        //     '\n5. C &amp; F agent/Exporters are requested to prepare container load plan and put Co.&#39;s Stamp / Sign.' +
        //     '\n6. In case of hazardous cargo, please apply hazardous cargo sticker &amp; put all details.',
        // },
        {
          pageBreak: 'before',
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
                text: this.doDetails?.ADDRESS,
                bold: true,
              },
              { text: this.doDetails?.ADDRESS },
              { text: this.doDetails?.CONTACT },
              {text:this.doDetails?.STATE_NAME},
            ],
            [
              {
                text: `Date: ${this._commonService.getcurrentDate(
                  new Date(this.doDetails?.DO_DATE)
                )}`,
                bold: true,
                alignment: 'right',
              },
              {
                text: `${this.doDetails?.CRO_NO}`,
                alignment: 'right',
                color: '#17a2b8',
              },
            ],
          ],
        },
        {
          text: 'DELIVERY ORDER',
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
                text: this.doDetails?.BOOKING_NO,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: this.doDetails?.LADEN_ACPT_LOCATION,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: this.doDetails?.CUSTOMER_NAME,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: this.doDetails?.EMAIL,
                margin: [0, 0, 0, 5],
                fontsize: 10,
              },
              {
                text: this.doDetails?.CONTACT,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: this._commonService.getcurrentDate(
                  new Date(this.doDetails?.CRO_VALIDITY_DATE)
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
                  this.doDetails?.BookingDetails?.VESSEL_NAME +
                  '/ ' +
                  this.doDetails?.BookingDetails?.VOYAGE_NO,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: this._commonService.getcurrentDate(
                  new Date(this.doDetails?.ETA)
                ),
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: this._commonService.getcurrentDate(
                  new Date(this.doDetails?.ETD)
                ),
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: this.doDetails?.SERVICE_NAME,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: this.doDetails?.POL,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: this.doDetails?.POD,
                margin: [0, 0, 0, 5],
                fontSize: 10,
              },
              {
                text: this.doDetails?.FINAL_DESTINATION,
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
            widths: ['*', '*', '*'],
            body: [
              ['Container Type/ Size', 'Quantity', 'Service Mode'],
              ...this.doDetails?.ContainerList.map((p: any) => [
                p.CONTAINER_TYPE + '/ ' + p.CONTAINER_SIZE,
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
}

