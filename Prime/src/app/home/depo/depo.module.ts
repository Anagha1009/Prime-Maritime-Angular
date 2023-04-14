import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepoRoutingModule } from './depo-routing.module';
import { ContainerAllotmentComponent } from './container-allotment/container-allotment.component';
import { DepoDashboardComponent } from './depo-dashboard/depo-dashboard.component';
import { DetentionListComponent } from './detention-list/detention-list.component';
import { DetentionWaverRequestComponent } from './detention-waver-request/detention-waver-request.component';
import { MrRequestComponent } from './mr-request/mr-request.component';
import { MrRequestListComponent } from './mr-request-list/mr-request-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { InventoryListComponent } from './inventory-list/inventory-list.component';

@NgModule({
  declarations: [
    ContainerAllotmentComponent,
    DepoDashboardComponent,
    DetentionListComponent,
    DetentionWaverRequestComponent,
    MrRequestComponent,
    MrRequestListComponent,
    InventoryListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgMultiSelectDropDownModule,
    HttpClientModule,
    TranslateModule,
    DataTablesModule,
    DepoRoutingModule,
  ],
})
export class DepoModule {}
