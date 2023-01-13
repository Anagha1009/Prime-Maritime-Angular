
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { elementAt } from 'rxjs';
import { QUOTATION } from 'src/app/models/quotation';
import { QuotationService } from 'src/app/services/quotation.service';
import { environment } from 'src/environments/environment.prod';

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
  fileList: any[] = [];
  BASE_URL: string = environment.BASE_URL2

  constructor(private _quotationService: QuotationService) { }

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

        console.log("All data" + JSON.stringify(res.Data));

        console.log("SRR_NO" + res.Data.SRR_NO);

        var srr_no = res.Data.SRR_NO;
        var commodityTypeList: any[] = [];

        res.Data.SRR_COMMODITIES.forEach((element: any) => {
          commodityTypeList.push(element.COMMODITY_TYPE)
        })

        console.log("COMM LIST" + JSON.stringify(commodityTypeList));

        this._quotationService.GetFiles(srr_no, commodityTypeList).subscribe((res: any) => {
          if (res.responseCode == 200) {
            this.fileList = res.data;
          }
        });

      }
    });
  }
}
