import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PmHomeRoutingModule } from './pm-home-routing.module';

import { PmMrRequestComponent } from './pm-mr-request/pm-mr-request.component';
import { PmQuotationDetailsComponent } from './pm-quotation-details/pm-quotation-details.component';
import { PmQuotationListComponent } from './pm-quotation-list/pm-quotation-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
    declarations: [
       
        PmMrRequestComponent,
        PmQuotationDetailsComponent,
        PmQuotationListComponent,
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
        PmHomeRoutingModule,    
    ]
})
export class PmHomeModule { }
