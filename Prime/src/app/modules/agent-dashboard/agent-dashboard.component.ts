import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { debug } from 'console';
import { CONTAINER, QUOTATION } from 'src/app/models/quotation';
import { SRRService } from 'src/app/services/srr.service';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.scss'],
})
export class AgentDashboardComponent implements OnInit {
  // classActive: boolean = false;
  isSlotDetails: boolean = false;
  srrList: any[] = [];
  quotationForm: FormGroup;
  slotDetailsForm: FormGroup;
  containerForm: FormGroup;
  isScroll: boolean = false;
  slotList: any[] = [];
  slotDetailsList: any[] = [];
  slotNo: any;
  currentDate: string = '';
  quotation = new QUOTATION();

  @ViewChild('closeBtn') closeBtn: ElementRef;

  constructor(
    private SrrService: SRRService,
    private router: Router,
    private FormBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.quotationForm = this.FormBuilder.group({
      SRR_NO: [''],
      CUSTOMER_NAME: [''],
      STATUS: [''],
    });

    this.slotDetailsForm = this.FormBuilder.group({
      SRR_NO: [''],
      POL: [''],
      POD: [''],
      VESSEL_NAME: [''],
      VOYAGE_NO: [''],
      MOTHER_VESSEL_NAME: [''],
      MOTHER_VOYAGE_NO: [''],
      SLOT_OPERATOR: [''],
      NO_OF_SLOTS: [''],
    });

    this.containerForm = this.FormBuilder.group({
      SRR_ID: [''],
      SRR_NO: [''],
      NO_OF_CONTAINERS: [''],
      CREATED_BY: ['Agent'],
    });

    this.quotation.AGENT_CODE = +localStorage.getItem('rolecode');

    this.getSRRList();
    this.currentDate = this.getcurrentDate();
  }

  searchSRRList() {
    this.quotation.SRR_NO = this.quotationForm.value.SRR_NO;
    this.quotation.CUSTOMER_NAME = this.quotationForm.value.CUSTOMER_NAME;
    this.quotation.STATUS = this.quotationForm.value.STATUS;

    this.getSRRList();
  }

  clearSRRList() {
    this.quotationForm.get('SRR_NO')?.setValue('');
    this.quotationForm.get('CUSTOMER_NAME')?.setValue('');
    this.quotationForm.get('STATUS')?.setValue('');
    this.quotation.SRR_NO = '';
    this.quotation.CUSTOMER_NAME = '';
    this.quotation.STATUS = '';

    this.getSRRList();
  }

  getSRRList() {
    debugger;
    this.SrrService.getSRRList(this.quotation).subscribe(
      (res) => {
        this.srrList = [];
        this.isScroll = false;
        if (res.hasOwnProperty('Data')) {
          if (res.Data.length > 0) {
            this.srrList = res.Data;
            if (this.srrList.length >= 4) {
              this.isScroll = true;
            } else {
              this.isScroll = false;
            }
          }
        }
      },
      (error) => {
        if (error.status == 401) {
          alert('You are not authorized to access this page, please login');
          this.router.navigateByUrl('login');
        }
      }
    );
  }

  addContainer(i) {
    debugger;
    var srrdata = this.srrList[i];
    var rootobject = new CONTAINER();
    rootobject.SRR_ID = srrdata.SRR_ID;
    rootobject.SRR_NO = srrdata.SRR_NO;
    rootobject.NO_OF_CONTAINERS =
      +this.containerForm.get('NO_OF_CONTAINERS')?.value;
    rootobject.CREATED_BY = this.containerForm.get('CREATED_BY')?.value;
    console.log(JSON.stringify(rootobject));
    this.SrrService.insertContainer(JSON.stringify(rootobject)).subscribe(
      (res) => {
        debugger;
        if (res.responseCode == 200) {
          alert('Container added successfully');
        }
      }
    );
  }

  addSlots(i) {
    let obj = {
      Index: i,
      Form: this.slotDetailsForm.value,
    };

    this.slotList.push(obj);

    var x = this.slotList.filter((x) => x.Index == i);

    x.forEach((element) => {
      this.slotDetailsList.push(element.Form);
    });

    this.closeModal();
  }

  getSlotDetails(i) {
    this.slotNo = i;
    this.isSlotDetails = !this.isSlotDetails;
  }

  closeModal(): void {
    this.closeBtn.nativeElement.click();
  }

  getcurrentDate() {
    var date: any = new Date();

    var todate: any = date.getDate();
    if (todate < 10) {
      todate = '0' + todate;
    }

    var month = date.getMonth() + 1;

    if (month < 10) {
      month = '0' + month;
    }

    var year = date.getFullYear();
    return year + '-' + month + '-' + todate;
  }

  // activeInput(e) {
  //   if (e.length > 0) {
  //     this.classActive = true;
  //   } else if (e.length == 0) {
  //     this.classActive = false;
  //   }
  // }
}
