import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PmLandingComponent } from './pm-landing/pm-landing.component';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { ChartComponent } from '../pm-modules/chart/chart.component';
import {
  CategoryService,
  ColumnSeriesService,
} from '@syncfusion/ej2-angular-charts';
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
  imports: [CommonModule, ChartModule],
  exports: [HeaderComponent, FooterComponent],
  providers: [CategoryService, ColumnSeriesService],
})
export class SharedModule {}
