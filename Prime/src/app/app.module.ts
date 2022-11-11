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


@NgModule({
  declarations: [AppComponent, SplitBookingComponent, DetentionListComponent,NewErComponent,PartyComponent,NewDoComponent],
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
