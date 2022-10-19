import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { QUOTATION } from 'src/app/models/quotation';
import { SRRService } from 'src/app/services/srr.service';

@Component({
  selector: 'app-quotation-details',
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.scss'],
})
export class QuotationDetailsComponent implements OnInit {
  quotationDetails: any;
  commodityList: any[] = [];
  containerList: any[] = [];
  rateList: any[] = [];

  @ViewChild('closeBtn3') closeBtn3: ElementRef;

  constructor(private router: Router, private _srrService: SRRService) {}

  ngOnInit(): void {
    this.getQuotationDetails();
  }

  getQuotationDetails() {
    var srr = new QUOTATION();
    srr.AGENT_CODE = +localStorage.getItem('rolecode');
    srr.SRR_NO = localStorage.getItem('SRR_NO');
    this._srrService.getSRRDetails(srr).subscribe((res) => {
      if (res.ResponseCode == 200) {
        this.quotationDetails = res.Data;
        this.commodityList = res.Data.SRR_COMMODITIES;
        this.containerList = res.Data.SRR_CONTAINERS;
        this.rateList = res.Data.SRR_RATES;
      }
    });
  }

  closeModal(): void {
    this.closeBtn3.nativeElement.click();
  }

  redirectToSubMenu(p) {
    this.closeModal();
    if (p == 'cro') {
      this.router.navigateByUrl('/home/cro-list');
    } else if (p == 'booking') {
      this.router.navigateByUrl('/home/bookings');
    }
  }
}
