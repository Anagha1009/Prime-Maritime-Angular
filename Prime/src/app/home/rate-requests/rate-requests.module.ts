import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RateRequestsRoutingModule } from './rate-requests-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DataTablesModule } from 'angular-datatables';
import { TranslateModule } from '@ngx-translate/core';
import { QuotationDetailsComponent } from './quotation-details/quotation-details.component';
import { QuotationListComponent } from './quotation-list/quotation-list.component';
import { NewQuotationComponent } from './new-quotation/new-quotation.component';
import { TooltipModule } from 'ng2-tooltip-directive';
@NgModule({
  declarations: [
    QuotationDetailsComponent,
    QuotationListComponent,
    NewQuotationComponent,
  ],
  imports: [
    CommonModule,
    RateRequestsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgMultiSelectDropDownModule,
    HttpClientModule,
    TranslateModule,
    TooltipModule,
    DataTablesModule,
  ],
})
export class RateRequestsModule {}
