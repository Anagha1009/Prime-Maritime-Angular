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
import { NewCmComponent } from 'src/app/modules/new-cm/new-cm.component';
import { ActivityMappingComponent } from 'src/app/modules/activity-mapping/activity-mapping.component';
import { DepoDashboardComponent } from 'src/app/modules/depo-dashboard/depo-dashboard.component';
import { ContainerAllotmentComponent } from 'src/app/modules/container-allotment/container-allotment.component';
import { ContainerAllotmentListComponent } from 'src/app/modules/container-allotment-list/container-allotment-list.component';
import { ManifestListComponent } from 'src/app/modules/manifest-list/manifest-list.component';
import { ContainerSizeComponent } from 'src/app/masters/container-size/container-size.component';
import { ServicetypeComponent } from 'src/app/masters/servicetype/servicetype.component';
import { CurrencyComponent } from 'src/app/masters/currency/currency.component';
import { UnitComponent } from 'src/app/masters/unit/unit.component';
import { PortComponent } from 'src/app/masters/port/port.component';
import { ContainerComponent } from 'src/app/masters/container/container.component';
import { PartyComponent } from 'src/app/masters/party/party.component';
import { VesselComponent } from 'src/app/masters/vessel/vessel.component';
import { ServiceComponent } from 'src/app/masters/service/service.component';
import { ContainerTypeComponent } from 'src/app/masters/container-type/container-type.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment.prod';
import { PushNotificationComponent } from 'src/app/modules/push-notification/push-notification.component';
import { MrRequestComponent } from 'src/app/modules/mr-request/mr-request.component';
import { MrRequestListComponent } from 'src/app/modules/mr-request-list/mr-request-list.component';
import { CtListComponent } from 'src/app/modules/ct-list/ct-list.component';
import { TrackingComponent } from 'src/app/modules/tracking/tracking.component';
import { TrackBookingComponent } from 'src/app/modules/track-booking/track-booking.component';

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
    NewCmComponent,
    ActivityMappingComponent,
    DepoDashboardComponent,
    ContainerAllotmentComponent,
    ContainerAllotmentListComponent,
    ManifestListComponent,
    ContainerComponent,
    ContainerSizeComponent,
    ServicetypeComponent,
    CurrencyComponent,
    UnitComponent,
    PortComponent,
    PartyComponent,
    VesselComponent,
    ServiceComponent,
    ContainerTypeComponent,
    PushNotificationComponent,
    PortComponent,
    PartyComponent,
    MrRequestComponent,
    MrRequestListComponent,
    CtListComponent,
    TrackingComponent,
    TrackBookingComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedModule,
    NgMultiSelectDropDownModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [],
})
export class MainLayoutModule {}
