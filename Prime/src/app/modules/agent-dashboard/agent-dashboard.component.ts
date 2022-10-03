import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
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
  isScroll: boolean = false;
  slotList: any[] = [];
  slotDetailsList: any[] = [];
  slotNo: any;
  currentDate: string = '';

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

    this.getSRRList('', '', '');
    this.currentDate = this.getcurrentDate();
  }

  searchSRRList() {
    var SRR_NO = this.quotationForm.value.SRR_NO;
    var CUSTOMER_NAME = this.quotationForm.value.CUSTOMER_NAME;
    var STATUS = this.quotationForm.value.STATUS;

    this.getSRRList(SRR_NO, CUSTOMER_NAME, STATUS);
  }

  clearSRRList() {
    this.quotationForm.get('SRR_NO')?.setValue('');
    this.quotationForm.get('CUSTOMER_NAME')?.setValue('');
    this.quotationForm.get('STATUS')?.setValue('');
    this.getSRRList('', '', '');
  }

  getSRRList(SRR_NO, CUSTOMER_NAME, STATUS) {
    this.SrrService.getSRRList(SRR_NO, CUSTOMER_NAME, STATUS).subscribe(
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
