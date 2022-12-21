import { Component, OnInit } from '@angular/core';
import { COUNT } from 'src/app/models/count';
import { CountService } from 'src/app/services/count.service';
// import { ChartComponent } from '../pm-modules/chart/chart.component';
import { data } from 'jquery';
import {Chart,registerables} from 'node_modules/chart.js'
Chart.register(...registerables);

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
	countList: any[] = [];
	
  constructor(private service: CountService) {}
  labeldata:any[]=[];
  chartdata:any[]=[];
  realdata:any[]=[];
  colordata:any[]=[];

  ngOnInit(): void {
    this.service.GetCount().subscribe(result=>{
      this.chartdata=result;
      if(this.chartdata!=null){
        for(let i=0;i<this.chartdata.length;i++){
          console.log(this.chartdata[i]);
          this.labeldata.push(this.chartdata[i].year);
          this.labeldata.push(this.chartdata[i].amount);
          this.labeldata.push(this.chartdata[i].colorcode);

        }
        this.RenderChart(this.labeldata,this.realdata,this.colordata,'pie','piechart');
      }
    })
  
   }

   RenderChart(labeldata:any,maindata:any,colordata:any,type:any,id:any,){
    const myChart=new Chart(id,{
      type:type,
      data:{
        labels:labeldata,
        datasets:[{
          label:'# of Votes',
          data:maindata,

          backgroundColor:colordata,
          
          borderColor:[
            'rgba(255,99,132,0.2)'
           
          ],
          borderWidth:1
        }]
      },
      options:{
        scales:{
          y:{
            beginAtZero:true
          }
        }
      }
    })
  

   }
  // chartOptions = {
	// animationEnabled: true,
	// title: {
	//   text: "Sales by Department"
	// },
	// data: [{
	//   type: "pie",
	//   startAngle: -90,
	//   indexLabel: "{name}: {y}",
	//   yValueFormatString: "#,###.##'%'",
	//   dataPoints: [
	// 	{ y: 5, name: "SRR" },
	// 	{ y: 3, name: "BOOKING" },
	// 	{ y: 2, name: "CRO" },
		
	//   ]
	// }]
	
  // }	
  

  // GetCount() {
  //   debugger
  //   var pmModel = new COUNT();
  //   pmModel.OPERATION='GET_COUNT';
  //   this._countService.GetCount().subscribe((res: any) => {
  //     debugger
  //       if (res.ResponseCode == 200) {
  //         this.countList = res.Data;

  //       }
		
  //     });
  // }
}
