import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ER } from 'src/app/models/er';
import { CroService } from 'src/app/services/cro.service';
import { ErService } from 'src/app/services/er.service';

@Component({
  selector: 'app-er-list',
  templateUrl: './er-list.component.html',
  styleUrls: ['./er-list.component.scss']
})
export class ErListComponent implements OnInit {
  @ViewChild('openBtn') openBtn: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  er=new ER();
  croNo: string;
  agentCode:any='';
  depoCode:any='';
  erList:any[]=[];
  containerList:any[]=[];
  isScroll: boolean = false;
  erListForm:FormGroup;
  previewNoData:boolean=false;
  previewList:boolean=false;
  erCROForm: FormGroup;
  submitted1: boolean = false;

  constructor(private _erService: ErService,private _router: Router,private _croService: CroService,private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.erListForm = this._formBuilder.group({
      REPO_NO: [''],
      FROM_DATE: [''],
      TO_DATE: ['']
    });
    this.erCROForm=this._formBuilder.group({
      CRO_NO: [''],
      REPO_NO: ['', Validators.required],
      EMPTY_CONT_PCKP: ['', Validators.required],
      CRO_VALIDITY_DATE: ['', Validators.required],
      REQ_QUANTITY: ['',Validators.required],
      AGENT_NAME:[''],
      AGENT_CODE: [''],
      CREATED_BY: ['']
    });
    this.getERList();
  }

  getERList(){
    debugger;
    this.previewList=false;
    this.previewNoData=false;
    if(localStorage.getItem('rolecode')=='1'){
      this.agentCode=localStorage.getItem('usercode');
    }
    if(localStorage.getItem('rolecode')=='3'){
      this.depoCode=localStorage.getItem('usercode');
    }
    this._erService.getERList(this.agentCode,this.depoCode).subscribe(
      (res: any) => {
        debugger;
        this.erList = [];
        this.isScroll = false;
        if (res.hasOwnProperty('Data')) {
          if (res.Data?.length > 0) {
            this.erList = res.Data;
            console.log(this.erList);
            //getContainerCount
            //this.getContainerCount();
            this.previewList=true;
            if (this.erList?.length >= 4) {
              this.isScroll = true;
            } else {
              this.isScroll = false;
            }
          }
          
        }
        if (res.ResponseCode == 500) {
          this.previewNoData=true;
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

  get f1() {
    return this.erCROForm.controls;
  }

  SaveCRO() {
    this.submitted1 = true;
    if (this.erCROForm.invalid) {
      return;
    }
    this.erCROForm.get('CRO_NO')?.setValue(this.getCRORandomNumber());
    this.erCROForm.get('AGENT_NAME')?.setValue(localStorage.getItem('username'));
    this.erCROForm.get('AGENT_CODE')?.setValue(localStorage.getItem('usercode'));
    this.erCROForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));

    this._croService
      .insertCRO(JSON.stringify(this.erCROForm.value))
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          this.croNo = res.data;
          alert('CRO created successfully! Your CRO No. is '+this.croNo);
          this.cancelERCRO();
        }
      });
  }


  getCRORandomNumber() {
    var num = Math.floor(Math.random() * 1e16).toString();
    return 'CRO' + num;
  }

  cancelERCRO(){
    this.erCROForm.get('CRO_NO')?.setValue("");
    this.erCROForm.get('REPO_NO')?.setValue("");
    this.erCROForm.get('EMPTY_CONT_PCKP')?.setValue("");
    this.erCROForm.get('CRO_VALIDITY_DATE')?.setValue("");
    this.erCROForm.get('REQ_QUANTITY')?.setValue("");
    this.erCROForm.get('AGENT_NAME')?.setValue("");
    this.erCROForm.get('AGENT_CODE')?.setValue("");
    this.erCROForm.get('CREATED_BY')?.setValue("");
  }

  openBookingModal(item:any){
    this.erCROForm.get('REPO_NO')?.setValue(item.REPO_NO);
    this.openBtn.nativeElement.click();
  }
  Search() {
    var DO_NO = this.erListForm.value.DO_NO;
    var FROM_DATE = this.erListForm.value.FROM_DATE;
    var TO_DATE = this.erListForm.value.TO_DATE;
    if (
      DO_NO == '' &&
      FROM_DATE == '' &&
      TO_DATE == ''
    ) {
      alert('Please enter atleast one filter to search !');
      return;
    }
    // this.dO.DO_NO = DO_NO;
    // this.dO.DO_DATE = FROM_DATE;
    // this.dO.DO_VALIDITY = TO_DATE;

    this.getERList();
  }

  Clear() {
    this.erListForm.get('DO_NO')?.setValue('');
    this.erListForm.get('FROM_DATE')?.setValue('');
    this.erListForm.get('TO_DATE')?.setValue('');

    // this.er.DO_NO = '';
    // this.dO.DO_DATE = '';
    // this.dO.DO_VALIDITY = '';

    this.getERList();
  }

  getERDetails(erNo:any){
    debugger;
    localStorage.setItem('ER_NO', erNo);
    this._router.navigateByUrl('home/do-details');
  }

  //generateCROpdf
  // getERCRODetails(CRO_NO: string) {
  //   var cro = new CRO();
  //   cro.AGENT_CODE = localStorage.getItem('usercode');
  //   cro.CRO_NO = CRO_NO;

  //   this._croService.getCRODetails(cro).subscribe((res: any) => {
  //     if (res.ResponseCode == 200) {
  //       this.croDetails = res.Data;
  //       this.generatePDF();
  //     }
  //   });
  // }
  // async generatePDF() {
  //   var tempArr = [];

  //   tempArr.push({
  //     TYPE: this.croDetails?.ContainerList[0].CONTAINER_TYPE,
  //     SIZE: this.croDetails?.ContainerList[0].CONTAINER_SIZE,
  //   });

  //   let docDefinition = {
  //     header: {
  //       text: 'Container Release Order',
  //       margin: [10, 10, 0, 0],
  //     },
  //     content: [
  //       {
  //         image: await this._commonService.getBase64ImageFromURL(
  //           'assets/img/logo_p.png'
  //         ),
  //         alignment: 'right',
  //         height: 50,
  //         width: 70,
  //         margin: [0, 0, 0, 10],
  //       },
  //       {
  //         columns: [
  //           [
  //             {
  //               text: this.croDetails?.CUSTOMER_NAME,
  //               bold: true,
  //             },
  //             { text: this.croDetails?.ADDRESS },
  //             { text: 'a@shds.sfdf' },
  //             { text: '6473463' },
  //           ],
  //           [
  //             {
  //               text: `Date: ${new Date().toLocaleString()}`,
  //               alignment: 'right',
  //             },
  //             {
  //               text: `CRO No : ${this.croDetails?.CRO_NO}`,
  //               alignment: 'right',
  //               color: '#17a2b8',
  //             },
  //           ],
  //         ],
  //       },
  //       {
  //         text: 'Booking Details',
  //         style: 'sectionHeader',
  //       },
  //       {
  //         columns: [
  //           [
  //             {
  //               text: 'Booking No:',
  //               margin: [0, 0, 0, 5],
  //               bold: true,
  //               fontSize: 10,
  //             },
  //             {
  //               text: 'Location:',
  //               margin: [0, 0, 0, 5],
  //               bold: true,
  //               fontSize: 10,
  //             },
  //             {
  //               text: 'Booking Party:',
  //               margin: [0, 0, 0, 5],
  //               bold: true,
  //               fontSize: 10,
  //             },
  //             {
  //               text: 'Email Id:',
  //               margin: [0, 0, 0, 5],
  //               bold: true,
  //               fontSize: 10,
  //             },
  //             {
  //               text: 'Contact No:',
  //               margin: [0, 0, 0, 5],
  //               bold: true,
  //               fontSize: 10,
  //             },
  //             {
  //               text: 'Valid Upto:',
  //               margin: [0, 0, 0, 5],
  //               bold: true,
  //               fontSize: 10,
  //             },
  //           ],
  //           [
  //             {
  //               text: this.croDetails?.BOOKING_NO,
  //               margin: [0, 0, 0, 5],
  //               fontSize: 10,
  //             },
  //             {
  //               text: '-',
  //               margin: [0, 0, 0, 5],
  //               fontSize: 10,
  //             },
  //             {
  //               text: this.croDetails?.CUSTOMER_NAME,
  //               margin: [0, 0, 0, 5],
  //               fontSize: 10,
  //             },
  //             { text: 'sfd@ytrstdr', margin: [0, 0, 0, 5], fontSize: 10 },
  //             { text: '7687675', margin: [0, 0, 0, 5], fontSize: 10 },
  //             { text: '10/22/23', margin: [0, 0, 0, 5], fontSize: 10 },
  //           ],
  //           [
  //             {
  //               text: 'Shipper Name:',
  //               margin: [0, 0, 0, 5],
  //               bold: true,
  //               fontSize: 10,
  //             },
  //             {
  //               text: 'Service Mode:',
  //               margin: [0, 0, 0, 5],
  //               bold: true,
  //               fontSize: 10,
  //             },
  //             {
  //               text: 'POL:',
  //               margin: [0, 0, 0, 5],
  //               bold: true,
  //               fontSize: 10,
  //             },
  //             {
  //               text: 'POD:',
  //               margin: [0, 0, 0, 5],
  //               bold: true,
  //               fontSize: 10,
  //             },
  //             {
  //               text: 'FPD:',
  //               margin: [0, 0, 0, 5],
  //               bold: true,
  //               fontSize: 10,
  //             },
  //             {
  //               text: 'Voyage:',
  //               margin: [0, 0, 0, 5],
  //               bold: true,
  //               fontSize: 10,
  //             },
  //           ],
  //           [
  //             {
  //               text: 'RTREcdfsgdfs',
  //               margin: [0, 0, 0, 5],
  //               fontSize: 10,
  //             },
  //             {
  //               text: 'CY/CY',
  //               margin: [0, 0, 0, 5],
  //               fontSize: 10,
  //             },
  //             {
  //               text: this.croDetails?.POL,
  //               margin: [0, 0, 0, 5],
  //               fontSize: 10,
  //             },
  //             {
  //               text: this.croDetails?.POD,
  //               margin: [0, 0, 0, 5],
  //               fontSize: 10,
  //             },
  //             {
  //               text: 'Mundra',
  //               margin: [0, 0, 0, 5],
  //               fontSize: 10,
  //             },
  //             {
  //               text: this.croDetails?.BookingDetails.VOYAGE_NO,
  //               margin: [0, 0, 0, 5],
  //               fontSize: 10,
  //             },
  //           ],
  //         ],
  //       },
  //       {
  //         text: 'Container Details',
  //         style: 'sectionHeader',
  //       },
  //       {
  //         // optional
  //         table: {
  //           headerRows: 1,
  //           widths: ['*', '*', '*', '*'],
  //           body: [
  //             ['Type', 'Size', 'Qty', 'Service'],
  //             ...this.croDetails?.ContainerList.map((p: any) => [
  //               p.CONTAINER_TYPE,
  //               p.CONTAINER_SIZE,
  //               p.IMM_VOLUME_EXPECTED,
  //               p.SERVICE_MODE,
  //             ]),
  //           ],
  //         },
  //       },
  //     ],
  //     styles: {
  //       sectionHeader: {
  //         bold: true,

  //         fontSize: 14,
  //         margin: [0, 15, 0, 15],
  //       },
  //     },
  //   };

  //   pdfMake.createPdf(docDefinition).open();
  //   // const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  //   // pdfDocGenerator.getBlob((blob: any) => {
  //   //   console.log(blob);
  //   // });
  // }
}
