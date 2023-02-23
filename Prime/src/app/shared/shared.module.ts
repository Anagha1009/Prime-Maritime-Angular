import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { LandingComponent } from './landing/landing.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PmLandingComponent } from './pm-landing/pm-landing.component';
import * as CanvasJSAngularChart from '../../assets/canvasjs-3.7.2/canvasjs.angular.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PmSidebarComponent } from './pm-sidebar/pm-sidebar.component';
import { AgGridModule } from 'ag-grid-angular';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'ng2-tooltip-directive';
import { ChartComponent } from '../pm-home/chart/chart.component';

var CanvasJSChart = CanvasJSAngularChart.CanvasJSChart;

@NgModule({
  declarations: [
    // LandingComponent,
    HeaderComponent,
    FooterComponent,
    PmLandingComponent,
    ChartComponent,
    CanvasJSChart,
    PmSidebarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot(),
    TooltipModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SimpleNotificationsModule,
    PmSidebarComponent,
    AgGridModule,
  ],
})
export class SharedModule {}
