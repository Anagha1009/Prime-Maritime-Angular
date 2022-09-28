import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SrrService } from 'src/app/services/srr.service';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.css'],
})
export class AgentDashboardComponent implements OnInit {
  srrList: any[] = [];
  selectedAttribute: string = '';
  quotationForm: FormGroup;
  isScroll: boolean = false;

  constructor(
    private SrrService: SrrService,
    private router: Router,
    private FormBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.quotationForm = this.FormBuilder.group({
      SRR_NO: [''],
      CUSTOMER_NAME: [''],
      STATUS: [''],
    });

    this.getSRRList('', '', '');
    this.selectedAttribute = '--Select--';
  }

  searchSRRList() {
    var SRR_NO = this.quotationForm.value.SRR_NO;
    var CUSTOMER_NAME =
      this.quotationForm.value.CUSTOMER_NAME == '--Select--'
        ? ''
        : this.quotationForm.value.CUSTOMER_NAME;
    var STATUS = this.quotationForm.value.STATUS;

    this.getSRRList(SRR_NO, CUSTOMER_NAME, STATUS);
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
          this.router.navigateByUrl('home/login');
        }
      }
    );
  }

  redirectToQuotation(SRR_NO) {
    localStorage.setItem('SRRNO', '');
    localStorage.setItem('SRRNO', SRR_NO);
    this.router.navigateByUrl('home/quotation-details');
  }
}
