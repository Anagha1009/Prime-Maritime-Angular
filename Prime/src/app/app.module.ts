import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutModule } from './layout/main-layout/main-layout.module';
import { SharedModule } from './shared/shared.module';
import { SplitBookingComponent } from './modules/split-booking/split-booking.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { DetentionListComponent } from './modules/detention-list/detention-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NewErComponent } from './modules/new-er/new-er.component';
import { PartyComponent } from './masters/party/party.component';
import { NewDoComponent } from './modules/new-do/new-do.component';
import { ContainerComponent } from './masters/container/container.component';
import { ContainerSizeComponent } from './masters/container-size/container-size.component';
import { ServicetypeComponent } from './masters/servicetype/servicetype.component';
import { CurrencyComponent } from './masters/currency/currency.component';
import { UnitComponent } from './masters/unit/unit.component';
import { PortComponent } from './masters/port/port.component';


@NgModule({
  declarations: [AppComponent, SplitBookingComponent, DetentionListComponent,NewErComponent,PartyComponent,NewDoComponent, ContainerComponent, ContainerSizeComponent, ServicetypeComponent, CurrencyComponent, UnitComponent, PortComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MainLayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule,
   
    NgMultiSelectDropDownModule 
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
