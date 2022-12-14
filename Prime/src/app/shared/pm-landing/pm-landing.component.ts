import { Component, OnInit } from '@angular/core';


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
    // './../../../assets/css/style.css',
  ],
})
export class PmLandingComponent implements OnInit {
  
  constructor() {}

  ngOnInit(): void {}
  chartOptions = {
	  theme: "light2",
	  animationEnabled: true,
	  title:{
		text: "Waste Generation and Urbanization by Region"
	  },
	  axisX: {
		title: "Urbanization Rate",
		titleFontSize: 13,
		suffix: "%"
	  },
	  axisY: {
		title: "Waste Generation per capita (kg/capita/day)",
		titleFontSize: 13,
		includeZero: true
	  },
	  data: [{
		type: "bubble",
		indexLabel: "{z}",
		color: "#8ecbc7",
		toolTipContent: "<span style='\"'color: {color};'\"'>{name}</span> <br/> {x}: {y}, {z}",
		dataPoints: [
			{ x: 35, y: 0.5, z: 334, name: "South Asia" },
			{ x: 38, y: 0.5, z: 174, name: "Sub-Saharan Africa" },
			{ x: 57, y: 0.5, z: 468, name: "East Asia and Pacific" },
			{ x: 64, y: 0.7, z: 129, name: "Middle East and North Africa" },
			{ x: 70, y: 1.25, z: 392, name: "Europe and Central Asia" },
			{ x: 80, y: 1, z: 231, name: "Latin America" },
			{ x: 82, y: 2.21, z: 289, name: "North America" }
		]
	  }]
	}	
}
