import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SrrService } from 'src/app/services/srr.service';

@Component({
  selector: 'app-quotation-details',
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.css'],
})
export class QuotationDetailsComponent implements OnInit {
  srrDetails: any;

  constructor(
    private SrrService: SrrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //var SRR_NO = this.activatedRoute.snapshot.paramMap.get('SRR_NO');
    var SRR_NO = localStorage.getItem('SRRNO');
    this.getSRRDetails(SRR_NO);
  }

  getSRRDetails(SRR_NO) {
    this.SrrService.getSRRDetails(SRR_NO).subscribe(
      (res) => {
        if (res.hasOwnProperty('Data')) {
          this.srrDetails = res.Data;
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
}
