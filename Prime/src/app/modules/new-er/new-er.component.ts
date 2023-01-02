import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import { CmService } from 'src/app/services/cm.service';
import { CommonService } from 'src/app/services/common.service';
import { CroService } from 'src/app/services/cro.service';
import { ErService } from 'src/app/services/er.service';
import { locale as english } from 'src/app/@core/translate/er/en';
import { locale as hindi } from 'src/app/@core/translate/er/hi';
import { locale as arabic } from 'src/app/@core/translate/er/ar';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Convert } from 'igniteui-angular-core';

const pdfMake = require('pdfmake/build/pdfmake.js');
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-new-er',
  templateUrl: './new-er.component.html',
  styleUrls: ['./new-er.component.scss']
})
export class NewErComponent implements OnInit {
  isLoading: boolean = false;
  email: string = '';
  fileData: any;
  erDetails:any;
  croNo: string;
  tabs: string = '1';
  currentLocation:any='';
  roleCode:any='';
  isVessel:boolean=false;
  status:any='Available'
  erForm: FormGroup;
  erCROForm: FormGroup;
  submitted: boolean = false;
  submitted1: boolean = false;
  submittedSlot:boolean=false;
  disabled = false;
  erContDetails:any[]=[];
  public loadContent: boolean = false;
  isScroll1: boolean = false;
  isScroll2: boolean = false;
  currencyList: any[] = [];
  vesselList: any[] = [];
  voyageList: any[] = [];
  vesselRateList: any[] = [];
  fixedChargeCode:any[]=["Lift On","Truck In To Terminal","Stevedoring-POL","Stevedoring-POD","Truck In To Depo","Lift Off"];
  containerDropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings = {};
  agentCode:any='';
  depoCode:any='';
  excelFile: File;
  @ViewChild('openBtn') openBtn: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openBtn1') openBtn1: ElementRef;
  @ViewChild('closeBtn1') closeBtn1: ElementRef;

  constructor(private _formBuilder: FormBuilder,
    private _erService: ErService,
    private _commonService:CommonService,
    private _cmService:CmService,
    private _croService: CroService,
    private http: HttpClient,
    private _coreTranslationService: CoreTranslationService,
    private _router: Router) { this._coreTranslationService.translate(english,hindi,arabic);}

  ngOnInit(): void {
    this.currentLocation='Dammam';
    //this.currentLocation=localStorage.getItem('location');
   
    this.getDropdownData();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'ID',
      textField: 'CONTAINER_NO',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Select Container',
      noDataAvailablePlaceholderText: 'No Container Present',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };


    this.erForm = this._formBuilder.group({
      REPO_NO: ['', Validators.required],
      LOAD_DEPOT: ['', Validators.required],
      DISCHARGE_DEPOT: ['', Validators.required],
      LOAD_PORT: [''],
      DISCHARGE_PORT: [''],
      VESSEL_NAME:[''],
      VOYAGE_NO:[''],
      MOVEMENT_DATE: ['', Validators.required],
      NO_OF_CONTAINER: [''],
      LIFT_ON_CHARGE: [0],
      LIFT_OFF_CHARGE: [0],
      CURRENCY: [''],
      MODE_OF_TRANSPORT: ['',Validators.required],
      REASON:[''],
      REMARKS: ['', Validators.required],
      STATUS: [''],
      AGENT_CODE: [''],
      AGENT_NAME: [''],
      DEPO_CODE: [''],
      CREATED_BY: [''],
      CONTAINER_LIST: new FormControl(this.containerDropdownList, Validators.required),
      CONTAINER_RATES:new FormArray([]),
      SLOT_LIST:new FormArray([])
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
    this.getCurrent();
    this.slotAllocation();
    this.loadContent = true;
  }

  get f() {
    return this.erForm.controls;

  }
  get f1() {
    return this.erCROForm.controls;
  }
  get f5() {
    var s = this.erForm.get('SLOT_LIST') as FormArray;
    return s.controls;
  }
  f6(i: any) {
    return i;
  }
  get f3() {
    var s = this.erForm.get('CONTAINER_RATES') as FormArray;
    return s.controls;
  }
  f4(i: any) {
    return i;
  }

  removeSlotItem(i: any) {
    const add = this.erForm.get('SLOT_LIST') as FormArray;
    if(add.length==1){
      alert('Atleast one slot should be added!');
    }
    else{
      add.removeAt(i);
    }
  }

  removeRateItem(i: any) {
    const add = this.erForm.get('CONTAINER_RATES') as FormArray;
    add.removeAt(i);
  }

  addRates() {
    var rateList = this.erForm.get('CONTAINER_RATES') as FormArray;
    if(rateList?.length>=6){
      this.isScroll2=true;
    }
    rateList.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [''],
        CHARGE_CODE: ['', Validators.required],
        CURRENCY: ['USD', Validators.required],
        STANDARD_RATE: ['100', Validators.required],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: ['NULL'],
      })
    );
  }

  slotAllocation() {
    var slotDetails = this.erForm.get('SLOT_LIST') as FormArray;
    if(slotDetails?.length>=6){
      this.isScroll1=true;
    }
    slotDetails.push(
      this._formBuilder.group({
        SLOT_OPERATOR: ['', Validators.required],
        NO_OF_SLOTS: [0, Validators.required],
      })
    );
  }
  getCurrent(){
    //this.currentLocation=localStorage.getItem('location');
    this.roleCode=localStorage.getItem('rolecode');
    var rateList = this.erForm.get('CONTAINER_RATES') as FormArray;
    rateList.clear();
    //this.fixedChargeCode=["Lift On","Truck In To Terminal","Stevedoring-POL","Stevedoring-POD","Truck In To Depo","Lift Off"];
    // this.vesselRateList=[
    //   {
    //     ID:1,
    //     CHARGE_CODE: "Lift On",
    //     CURRENCY: "USD",
    //     STANDARD_RATE: "100",

    //   },
    //   {
    //     ID:2,
    //     CHARGE_CODE: "Truck In To Terminal",
    //     CURRENCY: "USD",
    //     STANDARD_RATE: "100",

    //   },
    //   {
    //     CHARGE_CODE: "Stevedoring-POL",
    //     CURRENCY: "USD",
    //     STANDARD_RATE: "100",

    //   },
    //   {
    //     ID:3,
    //     CHARGE_CODE: "Stevedoring-POD",
    //     CURRENCY: "USD",
    //     STANDARD_RATE: "100",

    //   },
    //   {
    //     ID:4,
    //     CHARGE_CODE: "Truck In To Depo",
    //     CURRENCY: "USD",
    //     STANDARD_RATE: "100",
    //   },
    //   {
    //     ID:5,
    //     CHARGE_CODE: "Lift Off",
    //     CURRENCY: "USD",
    //     STANDARD_RATE: "100",

    //   }
    // ];

    // this.vesselList.forEach((element)=>{
    //   rateList.push(
    //     this._formBuilder.group({
    //           CHARGE_CODE: [element.CHARGE_CODE],
    //           CURRENCY: [element.CURRENCY],
    //           STANDARD_RATE: [element.STANDARD_RATE],
    //         })
    //   );
    // });

    rateList.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [''],
        CHARGE_CODE: ['Lift On', Validators.required],
        CURRENCY: ['USD', Validators.required],
        STANDARD_RATE: ['100', Validators.required],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: ['NULL'],
      })
    );
    rateList.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [''],
        CHARGE_CODE: ['Truck In To Terminal', Validators.required],
        CURRENCY: ['USD', Validators.required],
        STANDARD_RATE: ['100', Validators.required],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: ['NULL'],
      }),

    );
    rateList.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [''],
        CHARGE_CODE: ['Stevedoring-POL', Validators.required],
        CURRENCY: ['USD', Validators.required],
        STANDARD_RATE: ['100', Validators.required],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: ['NULL'],
      }),
    );
    rateList.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [''],
        CHARGE_CODE: ['Stevedoring-POD', Validators.required],
        CURRENCY: ['USD', Validators.required],
        STANDARD_RATE: ['100', Validators.required],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: ['NULL'],
      }),

    );

    rateList.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [''],
        CHARGE_CODE: ['Truck In To Depo', Validators.required],
        CURRENCY: ['USD', Validators.required],
        STANDARD_RATE: ['100', Validators.required],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: ['NULL'],
      }),

    );
    rateList.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [''],
        CHARGE_CODE: ['Lift Off', Validators.required],
        CURRENCY: ['USD', Validators.required],
        STANDARD_RATE: ['100', Validators.required],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: ['NULL'],
      })
    );
    
    
  }

  getVoyageList(event: any) {
    this.erForm.get('VOYAGE_NO')?.setValue('');
    this.voyageList = [];
    this._commonService
      .getDropdownData('VOYAGE_NO', '', event)
      .subscribe((res: any) => {
        if (res.hasOwnProperty('Data')) {
          this.voyageList = res.Data;
        }
      });
  }
  getAvailableContainers(event: any){
    this.erForm.get('CONTAINER_LIST')?.setValue('');
    this.containerDropdownList=[];
    this._cmService.getCMAvailable(this.status,event).subscribe((res: any) => {
      if(res.ResponseCode==200){
        this.containerDropdownList=res.Data;
      }
      if(res.ResponseCode==500){
        this.containerDropdownList=[];
      }
    });
  }
  getDropdownData(){
    //this.containerDropdownList=[];
    this._commonService.getDropdownData('VESSEL_NAME').subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.vesselList = res.Data;
      }
    });
    this._commonService.getDropdownData('CURRENCY').subscribe((res: any) => {
      if (res.hasOwnProperty('Data')) {
        this.currencyList = res.Data;
      }
    });
    // this._cmService.getCMAvailable(this.status,this.currentLocation).subscribe((res: any) => {
    //   if(res.ResponseCode==200){
    //     this.containerDropdownList=res.Data;

    //   }
    //   if(res.ResponseCode==500){
    //     this.containerDropdownList=[];
    //   }
    // });
    
  }

  cancelER(){
    this.erForm.get('REPO_NO')?.setValue("");
    this.erForm.get('LOAD_DEPOT')?.setValue("");
    this.erForm.get('DISCHARGE_DEPOT')?.setValue("");
    this.erForm.get('MOVEMENT_DATE')?.setValue("");
    this.erForm.get('LIFT_ON_CHARGE')?.setValue("");
    this.erForm.get('LIFT_OFF_CHARGE')?.setValue("");
    this.erForm.get('CURRENCY')?.setValue("");
    this.erForm.get('NO_OF_CONTAINER')?.setValue("");
    this.erForm.get('MODE_OF_TRANSPORT')?.setValue("");
    this.erForm.get('REASON')?.setValue("");
    this.erForm.get('REMARKS')?.setValue("");
    this.erForm.get('CONTAINER_LIST')?.setValue("");
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

  saveER() {
    debugger;
    this.isVessel=false;
    this.submitted = true;
    if(this.roleCode=='1'){
      this.erForm.get('AGENT_NAME')?.setValue(localStorage.getItem('username'));
      this.erForm.get('AGENT_CODE')?.setValue(localStorage.getItem('usercode'));
    }
    if(this.roleCode=='3'){
      this.erForm.get('DEPO_CODE')?.setValue(localStorage.getItem('usercode'));
    }
    if(this.tabs=='1'){
      this.erForm.get('MODE_OF_TRANSPORT')?.setValue('Truck');
    }
    else if(this.tabs=='2'){
      this.erForm.get('MODE_OF_TRANSPORT')?.setValue('Rail');
    }
    else if(this.tabs=='3'){
      this.erForm.get('MODE_OF_TRANSPORT')?.setValue('Vessel');
      this.isVessel=true;
      //this.submittedSlot=true;
      
    }
    
    this.erForm.get('REPO_NO')?.setValue(this.getRandomNumber("RP"));
    this.erForm.get('CONTAINER_LIST')?.setValue(this.selectedItems);
    this.erForm.get('NO_OF_CONTAINER')?.setValue(this.selectedItems?.length);
    this.erForm.get('STATUS')?.setValue(1);
    this.erForm.get('CREATED_BY')?.setValue(localStorage.getItem('username'));
    
    console.log()
    console.log(JSON.stringify(this.erForm.value));
    this._erService
      .postERDetails(JSON.stringify(this.erForm.value),this.isVessel)
      .subscribe((res: any) => {
        if (res.responseCode == 200) {
          alert('Your Request has successfully been placed! Your Repo No. is'+this.erForm.get('REPO_NO')?.value);
          this._router.navigateByUrl('/home/booking-list');
        }
      });

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

    if(localStorage.getItem('rolecode')=='1'){
      this.agentCode=localStorage.getItem('usercode');
    }
    if(localStorage.getItem('rolecode')=='3'){
      this.depoCode=localStorage.getItem('usercode');
    }

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
  }

  //generateCROpdf
  getERCRODetails(CRO_NO: string) {
    this.isLoading = true;
    if(localStorage.getItem('rolecode')=='1'){
      this.agentCode=localStorage.getItem('usercode');
    }
    if(localStorage.getItem('rolecode')=='3'){
      this.depoCode=localStorage.getItem('usercode');
    }
    
    this._erService.getERDetails(this.erCROForm.get('REPO_NO')?.value,this.agentCode,this.depoCode).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        debugger;
        this.erDetails = res.Data;
        //console.log(this.erDetails);
        this._erService.getERContainerDetails(this.erCROForm.get('REPO_NO')?.value,this.agentCode,this.depoCode).subscribe((res: any) => {
          debugger;
          if (res.ResponseCode == 200) {
            this.erContDetails = res.Data;
            //console.log(this.erDetails);
            this.generatePDF(CRO_NO,this.erCROForm.get('CRO_VALIDITY_DATE')?.value);
          }
          if (res.ResponseCode == 500) {
            alert("No containers available for associated Repo No.");
            //this.previewNoData=true;
          }
        });
      }
      if (res.ResponseCode == 500) {
        alert("Invalid Repo No.");
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

  getCRORandomNumber() {
    var num = Math.floor(Math.random() * 1e16).toString();
    return 'CRO' + num;
  }

  getRandomNumber(repo: string) {
    var num = Math.floor(Math.random() * 1e16).toString();
    return repo + '-' + num;
  }

  public onFilterChange(item: any) {
    console.log(item);
  }
  public onDropDownClose(item: any) {
    console.log(item);
  }

  public onItemSelect(item: any) {
    console.log(item);
  }
  public onDeSelect(item: any) {
    console.log(item);
  }

  public onSelectAll(items: any) {
    console.log(items);
  }
  public onDeSelectAll(items: any) {
    console.log(items);
  }



}
