import { Component, OnInit } from '@angular/core';
import { SrrReportService } from 'src/app/services/srr-report.service';


@Component({
  selector: 'app-pm-landing',
  templateUrl: './pm-landing.component.html',
  styleUrls: [
    './pm-landing.component.scss',
    // './../../../assets/pm-assets/vendor/css/core.css',
    // './../../../assets/pm-assets/vendor/css/theme-default.css',
    // './../../../assets/pm-assets/css/demo.css',
    // './../../../assets/pm-assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css',
    // './../../../assets/pm-assets/vendor/css/pages/page-auth.css',
     './../../../assets/css/style.css',
  ],
})
export class PmLandingComponent implements OnInit {

  chartOptions1:any;

  srrCountList: any[] = [];

  constructor(
    private _srrReportService: SrrReportService
  ) { }

  ngOnInit(): void {
    this.getSRRCountList();

    this.getCharts()
  }

  getSRRCountList() {
    this._srrReportService.getSRRCountList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        // this.srrCountList = res.Data;
      //  debugger
        // res.Data.forEach((element:any) => {
        //   this.srrCountList.push({label:element.MONTH,y:element.TOTAL});
        // });
        this.srrCountList = [
          { label: "Jan", y: 3.98 },
          { label: "Feb", y: 1.11 },
          { label: "Mar", y: 2.4 },
          { label: "Apr", y: 3.63 },
          { label: "May", y: 3.24 },
          { label: "Jun", y: 3.08 },
          { label: "Jul", y: 1.03 },
          { label: "Aug", y: 1.14 },
          { label: "Sep", y: 1.26 },
          { label: "Oct", y: 1.36 },
          { label: "Nov", y: 1.13 },
          { label: "Dec", y: 1.79 }
        ]  
      }
    });

  }

  getCharts(){
    this.chartOptions1 = {
      animationEnabled: true,
      title: {
        text: "SRR Monthly Calculation"
      },
      axisX: {
        title: "Months"
      },
      axisY: {
        title: "Count"
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        itemclick: function (e: any) {
          if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
          } else {
            e.dataSeries.visible = true;
          }
          e.chart.render();
        }
      },
      data: [{
        type: "spline",
        showInLegend: true,
        name: "Total SRR",
        dataPoints: this.getSRRCountList()
      },
      {
        type: "spline",
        showInLegend: true,
        name: "SRR Approved",
        dataPoints: [
          { label: "Jan", y: 1.98 },
          { label: "Feb", y: 2.11 },
          { label: "Mar", y: 1.4 },
          { label: "Apr", y: 0.63 },
          { label: "May", y: 1.24 },
          { label: "Jun", y: 1.08 },
          { label: "Jul", y: 1.03 },
          { label: "Aug", y: 1.14 },
          { label: "Sep", y: 1.26 },
          { label: "Oct", y: 1.36 },
          { label: "Nov", y: 1.13 },
          { label: "Dec", y: 1.79 }
        ]
      },
      {
        type: "spline",
        showInLegend: true,
        name: "SRR Requested",
        dataPoints: [
          { label: "Jan", y: 2.98 },
          { label: "Feb", y: 3.11 },
          { label: "Mar", y: 2.4 },
          { label: "Apr", y: 0.63 },
          { label: "May", y: 0.24 },
          { label: "Jun", y: 0.08 },
          { label: "Jul", y: 0.03 },
          { label: "Aug", y: 0.14 },
          { label: "Sep", y: 0.26 },
          { label: "Oct", y: 0.36 },
          { label: "Nov", y: 1.13 },
          { label: "Dec", y: 1.79 }
        ]
      },
      {
        type: "spline",
        showInLegend: true,
        name: "SRR Rejected",
        dataPoints: [
          { label: "Jan", y: 5.24 },
          { label: "Feb", y: 4.09 },
          { label: "Mar", y: 3.92 },
          { label: "Apr", y: 2.75 },
          { label: "May", y: 2.03 },
          { label: "Jun", y: 1.55 },
          { label: "Jul", y: 0.93 },
          { label: "Aug", y: 1.16 },
          { label: "Sep", y: 1.61 },
          { label: "Oct", y: 3.24 },
          { label: "Nov", y: 5.67 },
          { label: "Dec", y: 6.06 }
        ]
      }]
    }
  }
}
