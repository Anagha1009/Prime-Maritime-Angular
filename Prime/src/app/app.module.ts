import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutModule } from './layout/main-layout/main-layout.module';
import { SharedModule } from './shared/shared.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PmLayoutModule } from './layout/pm-layout/pm-layout.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MainLayoutModule,
    PmLayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
    HttpClientModule,
    NgSelectModule,   
    NgMultiSelectDropDownModule, 
    AgGridModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: true,
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
}) 
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
