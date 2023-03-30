import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationRoutingModule } from './operation-routing.module';
import { CroListComponent } from './cro-list/cro-list.component';
import { DoDetailsComponent } from './do-details/do-details.component';
import { DoListComponent } from './do-list/do-list.component';
import { LoadListComponent } from './load-list/load-list.component';
import { ManifestListComponent } from './manifest-list/manifest-list.component';
import { NewBlComponent } from './new-bl/new-bl.component';
import { NewCroComponent } from './new-cro/new-cro.component';
import { TdrComponent } from './tdr/tdr.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { ExcRateListComponent } from './exc-rate-list/exc-rate-list.component';
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { MergeBlComponent } from './merge-bl/merge-bl.component';
import { NewDo2Component } from './new-do2/new-do2.component';
import { TdrListComponent } from './tdr-list/tdr-list.component';

@NgModule({
  declarations: [
    CroListComponent,
    DoDetailsComponent,
    DoListComponent,
    LoadListComponent,
    ManifestListComponent,
    NewBlComponent,
    NewCroComponent,
    NewDo2Component,
    TdrComponent,
    TdrListComponent,
    ExcRateListComponent,
    NewInvoiceComponent,
    InvoiceListComponent,
    MergeBlComponent,
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
    OperationRoutingModule,
  ],
})
export class OperationModule {}
