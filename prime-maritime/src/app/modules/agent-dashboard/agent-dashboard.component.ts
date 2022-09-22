import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SrrService } from 'src/app/services/srr.service';

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.css'],
})
export class AgentDashboardComponent implements OnInit {
  srrList: any[] = [];

  constructor(private SrrService: SrrService, private router: Router) {}

  ngOnInit(): void {
    this.getSRRList();
  }

  getSRRList() {
    this.SrrService.getSRRList().subscribe(
      (res) => {
        if (res.hasOwnProperty('Data')) {
          if (res.Data.length > 0) {
            this.srrList = res.Data;
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

  redirectToQuotation(SRR_NO) {
    localStorage.setItem('SRRNO', '');
    localStorage.setItem('SRRNO', SRR_NO);
    this.router.navigateByUrl('home/quotation-details');
  }
}
