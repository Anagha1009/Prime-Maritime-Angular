import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { QUOTATION } from 'src/app/models/quotation';
import { QuotationService } from 'src/app/services/quotation.service';

@Component({
  selector: 'app-pm-quotation-list',
  templateUrl: './pm-quotation-list.component.html',
  styleUrls: ['./pm-quotation-list.component.scss'],
})
export class PmQuotationListComponent implements OnInit {
  quotation = new QUOTATION();
  quotationList: any[] = [];
  quotationDetails: any;

  @ViewChild('RateModal') RateModal: ElementRef;

  constructor(private _quotationService: QuotationService) {}

  ngOnInit(): void {
    this.getQuotationList();
  }

  getQuotationList() {
    this.quotation.OPERATION = 'GET_SRRLIST_PM';
    this._quotationService.getSRRList(this.quotation).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.quotationList = res.Data;
      }
    });
  }

  getDetails(SRR_NO: string) {
    var quot = new QUOTATION();
    quot.SRR_NO = SRR_NO;
    this._quotationService.getSRRDetails(quot).subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.quotationDetails = res.Data;
        this.RateModal.nativeElement.click();
      }
    });
  }

  numericOnly(event: any): boolean {
    // restrict e,+,-,E characters in  input type number
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode == 101 || charCode == 69 || charCode == 45 || charCode == 43) {
      return false;
    }
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
    return true;
  }
}
