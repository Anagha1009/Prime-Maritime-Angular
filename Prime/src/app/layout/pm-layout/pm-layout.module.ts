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
import { PmQuotationDetailsComponent } from 'src/app/pm-modules/pm-quotation-details/pm-quotation-details.component';

@NgModule({
  declarations: [
    PmLayoutComponent,
    PmLoginComponent,
    PmQuotationListComponent,
    PmQuotationDetailsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    SharedModule,
  ],
})
export class PmLayoutModule {}
