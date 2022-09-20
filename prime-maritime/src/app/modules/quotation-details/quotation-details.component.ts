import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SrrService } from 'src/app/services/srr.service';

@Component({
  selector: 'app-quotation-details',
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.css'],
})
export class QuotationDetailsComponent implements OnInit {
  srrDetails: any;

  constructor(private SrrService: SrrService, private router: Router) {}

  ngOnInit(): void {
    this.getSRRDetails();
  }

  getSRRDetails() {
    this.SrrService.getSRRDetails('AA').subscribe(
      (res) => {
        if (res.hasOwnProperty('Data')) {
          this.srrDetails = res.Data;
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
}
