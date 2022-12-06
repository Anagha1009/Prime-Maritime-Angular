import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { QUOTATION } from 'src/app/models/quotation';
import { QuotationService } from 'src/app/services/quotation.service';

@Component({
  selector: 'app-quotation-details',
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.scss'],
})
export class QuotationDetailsComponent implements OnInit {
  quotation: any;
  commodityList: any[] = [];
  containerList: any[] = [];
  rateList: any[] = [];

  constructor(private _quotationService: QuotationService) {}

  ngOnInit(): void {
    this.getQuotationDetails();
  }

  getQuotationDetails() {
    var srr = new QUOTATION();
    srr.AGENT_CODE = localStorage.getItem('usercode');
    srr.SRR_NO = localStorage.getItem('SRR_NO');
    this._quotationService.getSRRDetails(srr).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.quotation = res.Data;
        this.commodityList = res.Data.SRR_COMMODITIES;
        this.containerList = res.Data.SRR_CONTAINERS;
        this.rateList = res.Data.SRR_RATES;
      }
    });
  }
}
