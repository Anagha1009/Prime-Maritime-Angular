import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationListComponent } from 'src/app/modules/quotation-list/quotation-list.component';
import { MainLayoutComponent } from './main-layout.component';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuotationDetailsComponent } from 'src/app/modules/quotation-details/quotation-details.component';
import { NewQuotationComponent } from 'src/app/modules/new-quotation/new-quotation.component';
import { SharedModule } from 'src/app/shared/shared.module';
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
import { ContainerComponent } from 'src/app/masters/container/container.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment.prod';
import { PushNotificationComponent } from 'src/app/modules/push-notification/push-notification.component';
import { MrRequestComponent } from 'src/app/modules/mr-request/mr-request.component';
import { MrRequestListComponent } from 'src/app/modules/mr-request-list/mr-request-list.component';
import { DetentionWaverRequestComponent } from 'src/app/modules/detention-waver-request/detention-waver-request.component';
import { CtListComponent } from 'src/app/modules/ct-list/ct-list.component';
import { TrackingComponent } from 'src/app/modules/tracking/tracking.component';
import { TrackBookingComponent } from 'src/app/modules/track-booking/track-booking.component';
import { LoadListComponent } from 'src/app/modules/load-list/load-list.component';
import { NewTrackComponent } from 'src/app/modules/new-track/new-track.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from 'src/app/helpers/jwt.interceptor';
import { TranslateModule } from '@ngx-translate/core';
import { TdrComponent } from 'src/app/modules/tdr/tdr.component';
import { ErListComponent } from 'src/app/modules/er-list/er-list.component';
import { ErDetailsComponent } from 'src/app/modules/er-details/er-details.component';
import { NewContainerMovementComponent } from 'src/app/modules/new-container-movement/new-container-movement.component';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [
    MainLayoutComponent,
    QuotationListComponent,
    QuotationDetailsComponent,
    ErDetailsComponent,
    NewQuotationComponent,
    BookingListComponent,
    NewCroComponent,
    CroListComponent,
    SplitBookingComponent,
    NewDoComponent,
    DoListComponent,
    ErListComponent,
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
    PushNotificationComponent,
    MrRequestComponent,
    MrRequestListComponent,
    DetentionWaverRequestComponent,
    CtListComponent,
    TrackingComponent,
    NewTrackComponent,
    TrackBookingComponent,
    LoadListComponent,
    TdrComponent,
    NewContainerMovementComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedModule,
    NgMultiSelectDropDownModule,
    TranslateModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    DataTablesModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
})
export class MainLayoutModule {}
