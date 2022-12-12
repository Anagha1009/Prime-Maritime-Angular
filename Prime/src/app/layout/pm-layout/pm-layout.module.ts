import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PmLayoutComponent } from './pm-layout.component';
import { PmLoginComponent } from 'src/app/pm-modules/pm-login/pm-login.component';
import { PmQuotationListComponent } from 'src/app/pm-modules/pm-quotation-list/pm-quotation-list.component';
import { TestMapComponent } from 'src/app/pm-modules/test-map/test-map.component';
import { IgxGeographicMapModule } from "igniteui-angular-maps";
import { IgxDataChartInteractivityModule } from "igniteui-angular-charts";

@NgModule({
  declarations: [PmLayoutComponent, PmLoginComponent, PmQuotationListComponent,TestMapComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    IgxGeographicMapModule,
    IgxDataChartInteractivityModule
  ],
})
export class PmLayoutModule {}
