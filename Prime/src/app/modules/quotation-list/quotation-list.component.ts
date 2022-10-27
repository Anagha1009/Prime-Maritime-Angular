import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QUOTATION } from 'src/app/models/quotation';
import { QuotationService } from 'src/app/services/quotation.service';

@Component({
  selector: 'app-quotation-list',
  templateUrl: './quotation-list.component.html',
  styleUrls: ['./quotation-list.component.scss'],
})
export class QuotationListComponent implements OnInit {
  quotation = new QUOTATION();
  quotationList: any[] = [];
  isScroll: boolean = false;

  constructor(
    private _quotationService: QuotationService,
    private _router: Router // private _modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getSRRList();
  }

  getSRRList() {
    this.quotation.AGENT_CODE = localStorage.getItem('usercode');
    this.quotation.OPERATION = 'GET_SRRLIST';
    this._quotationService.getSRRList(this.quotation).subscribe(
      (res: any) => {
        this.quotationList = [];
        this.isScroll = false;
        if (res.hasOwnProperty('Data')) {
          if (res.Data?.length > 0) {
            this.quotationList = res.Data;

            if (this.quotationList?.length >= 4) {
              this.isScroll = true;
            } else {
              this.isScroll = false;
            }
          }
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

  getQuotationDetails(SRR_NO: any) {
    debugger;
    localStorage.setItem('SRR_NO', SRR_NO);
    this._router.navigateByUrl('home/quotation-details');
  }
}
