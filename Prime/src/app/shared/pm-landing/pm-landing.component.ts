import { Component, OnInit } from '@angular/core';
import { Convert } from 'igniteui-angular-core';
import { CommonService } from 'src/app/services/common.service';
import { SrrReportService } from 'src/app/services/srr-report.service';

@Component({
  selector: 'app-pm-landing',
  templateUrl: './pm-landing.component.html',
  styleUrls: ['./pm-landing.component.scss', './../../../assets/css/style.css'],
})
export class PmLandingComponent implements OnInit {
  chartOptions1: any;
  chartOptions2: any;
  chartOptions3: any;
  chartOptionsMain: any;

  srrCountList: any[] = [];
  docCount: any;
  multipleRange: any[] = [];
  multipleDoc: any[] = [];

  currentYear: number = 0;
  containerDetentionList: any[] = [];
  dataSRR: any[] = [];

  constructor(
    private _srrReportService: SrrReportService,
    private _commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.getSRRCountList();
    this.getMySrrCountList();
    this.getMyChart();
    this.getMyDocCount();
    this.getMainChart();
    this.getCharts();
    this.GetDetentionList();

    this.currentYear = new Date().getFullYear();
  }

  GetDetentionList() {
    this._commonService.destroyDT();
    this._srrReportService.getContainerDetentionList().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.containerDetentionList = res.Data;
      }
      this._commonService.getDT();
    });
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
          { label: 'Jan', y: 3.98 },
          { label: 'Feb', y: 1.11 },
          { label: 'Mar', y: 2.4 },
          { label: 'Apr', y: 3.63 },
          { label: 'May', y: 3.24 },
          { label: 'Jun', y: 3.08 },
          { label: 'Jul', y: 1.03 },
          { label: 'Aug', y: 1.14 },
          { label: 'Sep', y: 1.26 },
          { label: 'Oct', y: 1.36 },
          { label: 'Nov', y: 1.13 },
          { label: 'Dec', y: 1.79 },
        ];
      }
    });
  }

  getMySrrCountList() {
    this._srrReportService.getSRRCountList().subscribe((res: any) => {
      this.srrCountList = [];
      if (res.ResponseCode == 200) {
        this.srrCountList = res.Data;
        this.dataSRR = [
          { label: 'Jan', y: 3.98 },
          { label: 'Feb', y: 1.11 },
          { label: 'Mar', y: 2.4 },
          { label: 'Apr', y: 3.63 },
          { label: 'May', y: 3.24 },
          { label: 'Jun', y: 3.08 },
          { label: 'Jul', y: 1.03 },
          { label: 'Aug', y: 1.14 },
          { label: 'Sep', y: 1.26 },
          { label: 'Oct', y: 1.36 },
          { label: 'Nov', y: 1.13 },
          { label: 'Dec', y: 1.79 },
        ];
        this.getCharts();
        this.srrCountList.forEach((element: any) => {
          if (element.MONTH == 'Dec') {
            var p = (element.APPROVED / element.TOTAL) * 100;
            this.multipleRange.push(p.toFixed(1));
            var q = (element.REQUESTED / element.TOTAL) * 100;
            this.multipleRange.push(q.toFixed(1));
            var r = (element.REJECTED / element.TOTAL) * 100;
            this.multipleRange.push(r.toFixed(1));
            this.getMyChart();
          }
        });
      }
    });
  }

  getMyDocCount() {
    this._srrReportService.getCount().subscribe((res: any) => {
      if (res.ResponseCode == 200) {
        this.docCount = res.Data;
        var a = (this.docCount.BOOKING_COUNT / 100) * 100;
        this.multipleDoc.push(a.toFixed(1));
        var b = (this.docCount.CRO_COUNT / 100) * 100;
        this.multipleDoc.push(b.toFixed(1));
        var c = (this.docCount.SRR_COUNT / 100) * 100;
        this.multipleDoc.push(c.toFixed(1));
        this.getMainChart();
      }
    });
  }

  getMyChart() {
    this.chartOptions3 = {
      animationEnabled: true,
      theme: 'light',
      exportEnabled: true,
      title: {
        text: 'SRR MONTHLY CALCULATION',
      },
      subtitles: [
        {
          text: 'December 2022',
        },
      ],
      data: [
        {
          type: 'pie', //change type to column, line, area, doughnut, etc
          indexLabel: '{name}: {y}%',
          dataPoints: [
            {
              name: 'SRR Approved',
              y: Convert.toDecimal(this.multipleRange[0]),
            },
            {
              name: 'SRR Requested',
              y: Convert.toDecimal(this.multipleRange[1]),
            },
            {
              name: 'SRR Rejected',
              y: Convert.toDecimal(this.multipleRange[2]),
            },
          ],
        },
      ],
    };
  }

  getMainChart() {
    this.chartOptionsMain = {
      title: {
        text: 'Total Count Of Documents',
      },
      animationEnabled: true,
      axisY: {
        title: 'Count in Percentage',
        interval: 10,
        maximum: 100,
        includeZero: true,
        suffix: '%',
      },
      axisX: {
        title: 'Documents',
      },
      data: [
        {
          type: 'bar',
          indexLabel: '{y}%',
          //yValueFormatString: "#,###%",
          dataPoints: [
            { label: 'BOOKING', y: Convert.toInt32(this.multipleDoc[0]) },
            { label: 'CRO', y: Convert.toInt32(this.multipleDoc[1]) },
            { label: 'SRR', y: Convert.toInt32(this.multipleDoc[2]) },
          ],
        },
      ],
    };
  }

  getCharts() {
    this.chartOptions2 = {
      theme: 'dark',
      title: {
        text: 'SRR Report',
        fontSize: 28,
      },
      animationEnabled: true,
      toolTip: {
        shared: true,
      },
      legend: {
        horizontalAlign: 'right',
        verticalAlign: 'center',
        reversed: true,
      },
      axisY: {
        includeZero: true,
      },
      data: [
        {
          type: 'stackedColumn',
          name: 'Requested',
          showInLegend: true,
          dataPoints: this.dataSRR,
        },
        {
          type: 'stackedColumn',
          name: 'Rejected',
          showInLegend: true,
          dataPoints: [
            { label: 'Jan', y: 3.98 },
            { label: 'Feb', y: 1.11 },
            { label: 'Mar', y: 2.4 },
            { label: 'Apr', y: 3.63 },
            { label: 'May', y: 3.24 },
            { label: 'Jun', y: 3.08 },
            { label: 'Jul', y: 1.03 },
            { label: 'Aug', y: 1.14 },
            { label: 'Sep', y: 1.26 },
            { label: 'Oct', y: 1.36 },
            { label: 'Nov', y: 1.13 },
            { label: 'Dec', y: 1.79 },
          ],
        },
        {
          type: 'stackedColumn',
          name: 'Approved',
          showInLegend: true,
          dataPoints: [
            { label: 'Jan', y: 3.98 },
            { label: 'Feb', y: 1.11 },
            { label: 'Mar', y: 2.4 },
            { label: 'Apr', y: 3.63 },
            { label: 'May', y: 3.24 },
            { label: 'Jun', y: 3.08 },
            { label: 'Jul', y: 1.03 },
            { label: 'Aug', y: 1.14 },
            { label: 'Sep', y: 1.26 },
            { label: 'Oct', y: 1.36 },
            { label: 'Nov', y: 1.13 },
            { label: 'Dec', y: 1.79 },
          ],
        },
      ],
    };
  }
}
