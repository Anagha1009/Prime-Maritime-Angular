
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { elementAt } from 'rxjs';
import { QUOTATION } from 'src/app/models/quotation';
import { QuotationService } from 'src/app/services/quotation.service';
import { environment } from 'src/environments/environment.prod';
import { CoreTranslationService } from 'src/app/@core/services/translation.service';
import { locale as english } from 'src/app/@core/translate/srr/en';
import { locale as hindi } from 'src/app/@core/translate/srr/hi';
import { locale as arabic } from 'src/app/@core/translate/srr/ar';

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
  BASE_URL: string = environment.BASE_URL2;
  quotationForm: FormGroup;
  containerForm: FormGroup;
  contRateList: any[] = [];
  @ViewChild('RateDetailModal') RateDetailModal: ElementRef;

  constructor(private _quotationService: QuotationService,
    private _coreTranslationService: CoreTranslationService,
    private _formBuilder: FormBuilder,) { this._coreTranslationService.translate(english, hindi, arabic); }

  ngOnInit(): void {
    this.getQuotationDetails();
  }
  openRateDetailModal(i: any) {
    this.contRateList = [];
    this.contRateList = this.rateList.filter(x => x.CONTAINER_TYPE == this.containerList[i].CONTAINER_TYPE);
    this.RateDetailModal.nativeElement.click();
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

        var srr_no = res.Data.SRR_NO;
        var commodityTypeList: any[] = [];

        res.Data.SRR_COMMODITIES.forEach((element: any) => {
          commodityTypeList.push(element.COMMODITY_TYPE)
        })

        this._quotationService.GetFiles(srr_no, commodityTypeList).subscribe((res: any) => {
          if (res.responseCode == 200) {
            this.fileList = res.data;
          }
        });

      }
    });
  }


  addRates() {
    var rateList = this.quotationForm.get('SRR_RATES1') as FormArray;

    var ct = this.containerForm.value.CONTAINER_TYPE;

    rateList.push(
      this._formBuilder.group({
        CONTAINER_TYPE: [ct],
        CHARGE_CODE: [''],
        CURRENCY: ['USD'],
        STANDARD_RATE: ['0'],
        RATE_REQUESTED: [''],
        PAYMENT_TERM: [''],
        TRANSPORT_TYPE: [''],
        REMARKS: ['NULL'],
      })
    );
  }
}
