import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtInterceptor } from './helpers/jwt.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutModule } from './layout/main-layout/main-layout.module';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PmLayoutModule } from './layout/pm-layout/pm-layout.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AgGridModule } from 'ag-grid-angular';
import { TranslateModule } from '@ngx-translate/core';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MasterLayoutModule } from './layout/master-layout/master-layout.module';
import { BaseLayoutComponent } from './layout/base-layout/base-layout.component';

@NgModule({
  declarations: [AppComponent, BaseLayoutComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MainLayoutModule,
    PmLayoutModule,
    MasterLayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
    TranslateModule.forRoot(),
    DataTablesModule.forRoot(),
    HttpClientModule,
    NgSelectModule,
    NgMultiSelectDropDownModule,
    AgGridModule,
    NgSelectModule,
    NgMultiSelectDropDownModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  // providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
})
export class AppModule {}
