import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContainerMovementRoutingModule } from './container-movement-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { NewContainerMovementComponent } from './new-container-movement/new-container-movement.component';
import { NewTrackComponent } from './new-track/new-track.component';
import { CtListComponent } from './ct-list/ct-list.component';
import { DetentionComponent } from './detention/detention.component';

@NgModule({
  declarations: [
     CtListComponent,
    // NewCmComponent,
    NewContainerMovementComponent,
    NewTrackComponent,
    DetentionComponent
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
    ContainerMovementRoutingModule
  ]
})
export class ContainerMovementModule { }
