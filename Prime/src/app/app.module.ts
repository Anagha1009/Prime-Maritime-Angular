import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { DataTablesModule } from 'angular-datatables';
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
import { TdrComponent } from './modules/tdr/tdr.component';
// import { PmCmComponent } from './pm-modules/pm-cm/pm-cm.component';


@NgModule({
  declarations: [AppComponent, TdrComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MainLayoutModule,
    PmLayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
    TranslateModule.forRoot(),
    // DataTablesModule,
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
