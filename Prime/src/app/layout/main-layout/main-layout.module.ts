import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationListComponent } from 'src/app/modules/quotation-list/quotation-list.component';
import { MainLayoutComponent } from './main-layout.component';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuotationDetailsComponent } from 'src/app/modules/quotation-details/quotation-details.component';
import { NewQuotationComponent } from 'src/app/modules/new-quotation/new-quotation.component';
import { LoginComponent } from 'src/app/modules/login/login.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BookingListComponent } from 'src/app/modules/booking-list/booking-list.component';
import { NewCroComponent } from 'src/app/modules/new-cro/new-cro.component';
import { CroListComponent } from 'src/app/modules/cro-list/cro-list.component';
import { SplitBookingComponent } from 'src/app/modules/split-booking/split-booking.component';
import { NewDoComponent } from 'src/app/modules/new-do/new-do.component';
import { DoDetailsComponent } from 'src/app/modules/do-details/do-details.component';
import { DoListComponent } from 'src/app/modules/do-list/do-list.component';
import { NewErComponent } from 'src/app/modules/new-er/new-er.component';
import { NewBlComponent } from 'src/app/modules/new-bl/new-bl.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    MainLayoutComponent,
    QuotationListComponent,
    QuotationDetailsComponent,
    NewQuotationComponent,
    LoginComponent,
    BookingListComponent,
    NewCroComponent,
    CroListComponent,
    SplitBookingComponent,
    NewDoComponent,
    DoListComponent,
    DoDetailsComponent,
    NewErComponent,
    NewBlComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgMultiSelectDropDownModule,
  ],
  providers: [],
})
export class MainLayoutModule {}
