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
import { IgxGeographicMapModule } from 'igniteui-angular-maps';
import { IgxDataChartInteractivityModule } from 'igniteui-angular-charts';
import { PmQuotationDetailsComponent } from 'src/app/pm-modules/pm-quotation-details/pm-quotation-details.component';
import { SrrCalculatorComponent } from 'src/app/pm-modules/srr-calculator/srr-calculator.component';
import { PmCmComponent } from 'src/app/pm-modules/pm-cm/pm-cm.component';
import { PmMrRequestComponent } from 'src/app/pm-modules/pm-mr-request/pm-mr-request.component';
import { DataTablesModule } from 'angular-datatables';
import { CalculatorComponent } from 'src/app/pm-modules/calculator/calculator.component';
import { PartyComponent } from 'src/app/masters/party/party.component';
import { ContainerSizeComponent } from 'src/app/masters/container-size/container-size.component';
import { ContainerTypeComponent } from 'src/app/masters/container-type/container-type.component';
import { CurrencyComponent } from 'src/app/masters/currency/currency.component';
import { PortComponent } from 'src/app/masters/port/port.component';
import { ServicetypeComponent } from 'src/app/masters/servicetype/servicetype.component';
import { UnitComponent } from 'src/app/masters/unit/unit.component';
import { VesselComponent } from 'src/app/masters/vessel/vessel.component';
import { VoyageComponent } from 'src/app/masters/voyage/voyage.component';
import { LinerComponent } from 'src/app/masters/liner/liner.component';
import { LinerServiceComponent } from 'src/app/masters/liner-service/liner-service.component';
import { ScheduleComponent } from 'src/app/masters/schedule/schedule.component';

@NgModule({
  declarations: [
    PmLayoutComponent,
    PmLoginComponent,
    PmQuotationListComponent,
    TestMapComponent,
    PmQuotationDetailsComponent,
    SrrCalculatorComponent,
    PmCmComponent,
    PmMrRequestComponent,
    CalculatorComponent,
    PartyComponent,
    ContainerSizeComponent,
    ContainerTypeComponent,
    CurrencyComponent,
    PortComponent,
    ServicetypeComponent,
    UnitComponent,
    VesselComponent,
    VoyageComponent,
    LinerComponent,
    LinerServiceComponent,
    ScheduleComponent,
  ],

  imports: [
    CommonModule,
    RouterModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    IgxGeographicMapModule,
    IgxDataChartInteractivityModule,
    SharedModule,
    DataTablesModule,
  ],
})
export class PmLayoutModule {}
