import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ER } from 'src/app/models/er';
import { CommonService } from 'src/app/services/common.service';
import { CroService } from 'src/app/services/cro.service';
import { ErService } from 'src/app/services/er.service';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { formatDate } from '@angular/common';
import { Convert } from 'igniteui-angular-core';
import { HttpClient } from '@angular/common/http';

const pdfMake = require('pdfmake/build/pdfmake.js');
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-er-list',
  templateUrl: './er-list.component.html',
  styleUrls: ['./er-list.component.scss']
})
export class ErListComponent implements OnInit {
  @ViewChild('openBtn') openBtn: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openBtn1') openBtn1: ElementRef;
  @ViewChild('closeBtn1') closeBtn1: ElementRef;
  excelFile: File;
  isLoading: boolean = false;
  email: string = '';
  fileData: any;
  er=new ER();
  croNo: string;
  agentCode:any='';
  depoCode:any='';
  erList:any[]=[];
  erDetails:any;
  erContDetails:any[]=[];
  containerList:any[]=[];
  isScroll: boolean = false;
  erListForm:FormGroup;
  previewNoData:boolean=false;
  previewList:boolean=false;
  erCROForm: FormGroup;
  submitted1: boolean = false;

  constructor(private _erService: ErService,private _commonService: CommonService,private http: HttpClient,private _router: Router,private _croService: CroService,private _formBuilder: FormBuilder) { }

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

    this._erService.getERDetails(this.erCROForm.get('REPO_NO')?.value,this.agentCode,this.depoCode).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        debugger;
        this.erDetails = res.Data;
        if(Convert.toInt32(this.erCROForm.get('REQ_QUANTITY')?.value)==this.erDetails.NO_OF_CONTAINER){
          this._croService
          .insertCRO(JSON.stringify(this.erCROForm.value))
          .subscribe((res: any) => {
            if (res.responseCode == 200) {
              this.croNo = res.data;
              this.openBtn1.nativeElement.click();
              // alert('CRO created successfully! Your CRO No. is '+this.croNo);
              // this.cancelERCRO();
            }
          });
        }
        else{
          alert('Required Quantity should be equal to the number of containers since you can create only one CRO for a specific Container Repositioning!')
        }
        
      }
      if (res.ResponseCode == 500) {
        alert("Invalid Repo No.");
      }
    });

    // this._croService
    //   .insertCRO(JSON.stringify(this.erCROForm.value))
    //   .subscribe((res: any) => {
    //     if (res.responseCode == 200) {
    //       this.croNo = res.data;
    //       alert('CRO created successfully! Your CRO No. is '+this.croNo);
    //       this.cancelERCRO();
    //     }
    //   });
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
    var REPO_NO = this.erListForm.value.REPO_NO;
    var FROM_DATE = this.erListForm.value.FROM_DATE;
    var TO_DATE = this.erListForm.value.TO_DATE;
    if (
      REPO_NO == '' &&
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
    this.erListForm.get('REPO_NO')?.setValue('');
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
    this._router.navigateByUrl('home/er-details');
  }

  //generateCROpdf
  getERCRODetails(CRO_NO: string) {
    this.isLoading = true;
    this._erService.getERDetails(this.erCROForm.get('REPO_NO')?.value,this.agentCode,this.depoCode).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        debugger;
        this.erDetails = res.Data;
        console.log(this.erDetails);
        this._erService.getERContainerDetails(this.erCROForm.get('REPO_NO')?.value,this.agentCode,this.depoCode).subscribe((res: any) => {
          debugger;
          if (res.ResponseCode == 200) {
            this.erContDetails = res.Data;
            console.log(this.erDetails);
            this.generatePDF(CRO_NO,this.erCROForm.get('CRO_VALIDITY_DATE')?.value);
          }
          if (res.ResponseCode == 500) {
            //this.previewNoData=true;
          }
        });
      }
      if (res.ResponseCode == 500) {
        //this.previewNoData=true;
      }
    });
  }
  async generatePDF(CRO_NO: string,CRO_VALIDITY_DATE:string) {
    var tempArr = [];

    // tempArr.push({
    //   TYPE: this.croDetails?.ContainerList[0].CONTAINER_TYPE,
    //   SIZE: this.croDetails?.ContainerList[0].CONTAINER_SIZE,
    // });

    if(this.erDetails?.MODE_OF_TRANSPORT=='Vessel'){
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
                  text: 'Maaria Khan',
                  bold: true,
                },
                { text: 'Hans Residency' },
                { text: 'a@shds.sfdf' },
                { text: '6473463' },
              ],
              [
                {
                  text: `Date: ${new Date().toLocaleString()}`,
                  alignment: 'right',
                },
                {
                  text: `CRO No : ${CRO_NO}`,
                  alignment: 'right',
                  color: '#17a2b8',
                },
              ],
            ],
          },
          {
            text: 'Empty Repo Details',
            style: 'sectionHeader',
          },
          {
            columns: [
              [
                {
                  text: 'Repo No:',
                  margin: [0, 0, 0, 5],
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: 'Mode Of Transport:',
                  margin: [0, 0, 0, 5],
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: 'Load Depot:',
                  margin: [0, 0, 0, 5],
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: 'Discharge Depot:',
                  margin: [0, 0, 0, 5],
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: 'Movement Date:',
                  margin: [0, 0, 0, 5],
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: 'CRO Validity:',
                  margin: [0, 0, 0, 5],
                  bold: true,
                  fontSize: 10,
                },
        
              ],
              [
                {
                  text: this.erDetails?.REPO_NO,
                  margin: [0, 0, 0, 5],
                  fontSize: 10,
                },
                {
                  text: this.erDetails?.MODE_OF_TRANSPORT,
                  margin: [0, 0, 0, 5],
                  fontSize: 10,
                },
                {
                  text: this.erDetails?.LOAD_DEPOT,
                  margin: [0, 0, 0, 5],
                  fontSize: 10,
                },
                {
                  text: this.erDetails?.DISCHARGE_DEPOT,
                  margin: [0, 0, 0, 5],
                  fontSize: 10,
                },
                { text: formatDate(this.erDetails?.MOVEMENT_DATE, 'yyyy-MM-dd', 'en'), margin: [0, 0, 0, 5], fontSize: 10 },
                { text: formatDate(CRO_VALIDITY_DATE, 'yyyy-MM-dd', 'en'), margin: [0, 0, 0, 5], fontSize: 10 },
              ],
              [
                {
                  text: 'Shipper Name:',
                  margin: [0, 0, 0, 5],
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: 'Load Port:',
                  margin: [0, 0, 0, 5],
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: 'Discharge Port:',
                  margin: [0, 0, 0, 5],
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: 'Vessel:',
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
                  text: 'Empty Repositioning',
                  margin: [0, 0, 0, 5],
                  fontSize: 10,
                },
                {
                  text: this.erDetails?.LOAD_PORT,
                  margin: [0, 0, 0, 5],
                  fontSize: 10,
                },
                {
                  text: this.erDetails?.DISCHARGE_PORT,
                  margin: [0, 0, 0, 5],
                  fontSize: 10,
                },
                {
                  text: this.erDetails?.VESSEL_NAME,
                  margin: [0, 0, 0, 5],
                  fontSize: 10,
                },
                {
                  text: this.erDetails?.VOYAGE_NO,
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
                ['Type', 'Size', 'Qty'],
                ['20DC', '20', '15'],
                ['20HC', '40', '10'],
                ['40DC', '40', '20'],

                // ...this.erContDetails?.map((p: any) => [
                //   p.CONTAINER_TYPE,
                //   p.CONTAINER_SIZE,
                //   p.IMM_VOLUME_EXPECTED,
                //   p.SERVICE_MODE,
                // ]),
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
      //pdfMake.createPdf(docDefinition).open();
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
  
            const formData: FormData = new FormData();
            formData.append('Attachments', blob);
            formData.append('Attachments', this.excelFile);
            console.log('excel ' + this.excelFile);
            formData.append('ToEmail', this.email);
            formData.append('Subject', 'CRO - ' + this.croNo);
  
            this._commonService.sendEmail(formData).subscribe((res: any) => {
              this.isLoading = false;
              alert('Your mail has been send successfully !');
              this.closeBtn1.nativeElement.click();
              this.submitted1=false;
              this.cancelERCRO();
              
              //this._router.navigateByUrl('/home/cro-list');
            });
          });
      });

    }
    else{
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
              // [
              //   {
              //     text: 'Maaria Khan',
              //     bold: true,
              //   },
              //   { text: 'Hans Residency' },
              //   { text: 'a@shds.sfdf' },
              //   { text: '6473463' },
              // ],
              [
                {
                  text: `Date: ${new Date().toLocaleString()}`,
                  alignment: 'right',
                },
                {
                  text: `CRO No : ${CRO_NO}`,
                  alignment: 'right',
                  color: '#17a2b8',
                },
              ],
            ],
          },
          {
            text: 'Empty Repo Details',
            style: 'sectionHeader',
          },
          {
            columns: [
              [
                {
                  text: 'Repo No:',
                  margin: [0, 0, 0, 5],
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: 'Mode Of Transport:',
                  margin: [0, 0, 0, 5],
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: 'Load Depot:',
                  margin: [0, 0, 0, 5],
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: 'Discharge Depot:',
                  margin: [0, 0, 0, 5],
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: 'Movement Date:',
                  margin: [0, 0, 0, 5],
                  bold: true,
                  fontSize: 10,
                },
                {
                  text: 'CRO Validity:',
                  margin: [0, 0, 0, 5],
                  bold: true,
                  fontSize: 10,
                },
        
              ],
              [
                {
                  text: this.erDetails?.REPO_NO,
                  margin: [0, 0, 0, 5],
                  fontSize: 10,
                },
                {
                  text: this.erDetails?.MODE_OF_TRANSPORT,
                  margin: [0, 0, 0, 5],
                  fontSize: 10,
                },
                {
                  text: this.erDetails?.LOAD_DEPOT,
                  margin: [0, 0, 0, 5],
                  fontSize: 10,
                },
                {
                  text: this.erDetails?.DISCHARGE_DEPOT,
                  margin: [0, 0, 0, 5],
                  fontSize: 10,
                },
                { text: this.erDetails?.MOVEMENT_DATE.split('T')[0], margin: [0, 0, 0, 5], fontSize: 10 },
                { text: CRO_VALIDITY_DATE.split('T')[0], margin: [0, 0, 0, 5], fontSize: 10 },
              ],
              [
                {
                  text: 'Shipper Name:',
                  margin: [0, 0, 0, 5],
                  bold: true,
                  fontSize: 10,
                },
                
              ],
              [
                {
                  text: 'Empty Repositioning',
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
                ['Type', 'Size', 'Qty'],
                ['20DC', '20', '15'],
                ['20HC', '40', '10'],
                ['40DC', '40', '20'],

                // ...this.erContDetails?.map((p: any) => [
                //   p.CONTAINER_TYPE,
                //   p.CONTAINER_SIZE,
                //   p.IMM_VOLUME_EXPECTED,
                //   p.SERVICE_MODE,
                // ]),
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
      //pdfMake.createPdf(docDefinition).open();
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
  
            const formData: FormData = new FormData();
            formData.append('Attachments', blob);
            formData.append('Attachments', this.excelFile);
            console.log('excel ' + this.excelFile);
            formData.append('ToEmail', this.email);
            formData.append('Subject', 'CRO - ' + this.croNo);
  
            this._commonService.sendEmail(formData).subscribe((res: any) => {
              this.isLoading = false;
              alert('Your mail has been send successfully !');
              this.closeBtn1.nativeElement.click();
              this.submitted1=false;
              this.cancelERCRO();
              
              //this._router.navigateByUrl('/home/cro-list');
            });
          });
      });

    }
    
  }
}
