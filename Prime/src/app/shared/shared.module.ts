import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PmLandingComponent } from './pm-landing/pm-landing.component';
import { ChartComponent } from '../pm-modules/chart/chart.component';
import * as CanvasJSAngularChart from '../../assets/canvasjs-3.7.2/canvasjs.angular.component';
var CanvasJSChart = CanvasJSAngularChart.CanvasJSChart;

@NgModule({
  declarations: [
    LandingComponent,
    HeaderComponent,
    FooterComponent,
    PmLandingComponent,
    ChartComponent,
    CanvasJSChart,
  ],
  imports: [CommonModule],
  exports: [HeaderComponent, FooterComponent],
})
export class SharedModule {}
