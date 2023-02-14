import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { PartyComponent } from './masters/party/party.component';
import { BookingListComponent } from './modules/booking-list/booking-list.component';
import { CroListComponent } from './modules/cro-list/cro-list.component';
import { NewCroComponent } from './modules/new-cro/new-cro.component';
import { NewQuotationComponent } from './modules/new-quotation/new-quotation.component';
import { QuotationDetailsComponent } from './modules/quotation-details/quotation-details.component';
import { QuotationListComponent } from './modules/quotation-list/quotation-list.component';
import { SplitBookingComponent } from './modules/split-booking/split-booking.component';
import { NewDoComponent } from './modules/new-do/new-do.component';
import { LandingComponent } from './shared/landing/landing.component';
import { DoListComponent } from './modules/do-list/do-list.component';
import { DoDetailsComponent } from './modules/do-details/do-details.component';
import { NewErComponent } from './modules/new-er/new-er.component';
import { ContainerComponent } from './masters/container/container.component';
import { ContainerSizeComponent } from './masters/container-size/container-size.component';
import { ServicetypeComponent } from './masters/servicetype/servicetype.component';
import { CurrencyComponent } from './masters/currency/currency.component';
import { UnitComponent } from './masters/unit/unit.component';
import { PortComponent } from './masters/port/port.component';
import { PmQuotationListComponent } from './pm-modules/pm-quotation-list/pm-quotation-list.component';
import { PmLayoutComponent } from './layout/pm-layout/pm-layout.component';
import { ActivityMappingComponent } from './modules/activity-mapping/activity-mapping.component';
import { NewBlComponent } from './modules/new-bl/new-bl.component';
import { NewCmComponent } from './modules/new-cm/new-cm.component';
import { PmLoginComponent } from './pm-modules/pm-login/pm-login.component';
import { VesselComponent } from './masters/vessel/vessel.component';
import { ContainerTypeComponent } from './masters/container-type/container-type.component';
import { DepoDashboardComponent } from './modules/depo-dashboard/depo-dashboard.component';
import { ContainerAllotmentComponent } from './modules/container-allotment/container-allotment.component';
import { ContainerAllotmentListComponent } from './modules/container-allotment-list/container-allotment-list.component';
import { ManifestListComponent } from './modules/manifest-list/manifest-list.component';
import { PushNotificationComponent } from './modules/push-notification/push-notification.component';
import { MrRequestComponent } from './modules/mr-request/mr-request.component';
import { MrRequestListComponent } from './modules/mr-request-list/mr-request-list.component';
import { PmMrRequestComponent } from './pm-modules/pm-mr-request/pm-mr-request.component';
import { DetentionWaverRequestComponent } from './modules/detention-waver-request/detention-waver-request.component';
import { TrackingComponent } from './modules/tracking/tracking.component';
import { CtListComponent } from './modules/ct-list/ct-list.component';
import { LoadListComponent } from './modules/load-list/load-list.component';

import { TrackBookingComponent } from './modules/track-booking/track-booking.component';
import { TestMapComponent } from './pm-modules/test-map/test-map.component';
import { PmCmComponent } from './pm-modules/pm-cm/pm-cm.component';
import { PmLandingComponent } from './shared/pm-landing/pm-landing.component';
import { PmQuotationDetailsComponent } from './pm-modules/pm-quotation-details/pm-quotation-details.component';
import { NewTrackComponent } from './modules/new-track/new-track.component';
import { SrrCalculatorComponent } from './pm-modules/srr-calculator/srr-calculator.component';
import { TdrComponent } from './modules/tdr/tdr.component';
import { ErListComponent } from './modules/er-list/er-list.component';
import { ErDetailsComponent } from './modules/er-details/er-details.component';
import { VoyageComponent } from './masters/voyage/voyage.component';
import { CalculatorComponent } from './pm-modules/calculator/calculator.component';
import { LinerComponent } from './masters/liner/liner.component';
import { LinerServiceComponent } from './masters/liner-service/liner-service.component';
import { ScheduleComponent } from './masters/schedule/schedule.component';
import { NewContainerMovementComponent } from './modules/new-container-movement/new-container-movement.component';
import { AuthGuard } from './@core/services/auth.guard';
import { Role } from './models/login';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'pm',
    component: PmLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: PmLandingComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Principal] },
      },
      {
        path: 'quotation-list',
        component: PmQuotationListComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Principal] },
      },
      {
        path: 'container-movement',
        component: PmCmComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Principal] },
      },
      {
        path: 'mnr-request',
        component: PmMrRequestComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Principal] },
      },
      {
        path: 'quotation-details/:SRR_NO',
        component: PmQuotationDetailsComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Principal] },
      },
      {
        path: 'srr-calculator',
        component: SrrCalculatorComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Principal] },
      },
      {
        path: 'calculator',
        component: CalculatorComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Principal] },
      },
      {
        path: 'party',
        component: PartyComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Principal] },
      },
      {
        path: 'container',
        component: ContainerComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Principal] },
      },
      {
        path: 'containerSize',
        component: ContainerSizeComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Principal] },
      },
      {
        path: 'containerType',
        component: ContainerTypeComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Principal] },
      },
      {
        path: 'servicetype',
        component: ServicetypeComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Principal] },
      },
      {
        path: 'currency',
        component: CurrencyComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Principal] },
      },
      {
        path: 'unit',
        component: UnitComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Principal] },
      },
      {
        path: 'port',
        component: PortComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Principal] },
      },
      {
        path: 'vessel',
        component: VesselComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Principal] },
      },
      {
        path: 'voyage',
        component: VoyageComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Principal] },
      },
      {
        path: 'liner',
        component: LinerComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Principal] },
      },
      {
        path: 'linerService',
        component: LinerServiceComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Principal] },
      },
      {
        path: 'schedule',
        component: ScheduleComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Principal] },
      },
    ],
  },
  {
    path: 'login',
    component: PmLoginComponent,
  },
  {
    path: 'home',
    component: MainLayoutComponent,
    children: [
      {
        path: 'srr-list',
        component: QuotationListComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'srr-details',
        component: QuotationDetailsComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'new-quotation',
        component: NewQuotationComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'booking-list',
        component: BookingListComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'rollover',
        component: SplitBookingComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'new-cro',
        component: NewCroComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'new-cro/:BOOKING_NO',
        component: NewCroComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'new-er',
        component: NewErComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'er-list',
        component: ErListComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'er-details',
        component: ErDetailsComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'new-do',
        component: NewDoComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'cro-list',
        component: CroListComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'do',
        component: NewDoComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'do-list',
        component: DoListComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'do-details',
        component: DoDetailsComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },

      {
        path: 'new-bl',
        component: NewBlComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'new-cm',
        component: NewCmComponent,
      },
      {
        path: 'new-container-movement',
        component: NewContainerMovementComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent, Role.Depot] },
      },
      {
        path: 'tracking',
        component: TrackingComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent, Role.Depot] },
      },
      {
        path: 'new-track',
        component: NewTrackComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent, Role.Depot] },
      },
      {
        path: 'ct-list',
        component: CtListComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'activity-mapping',
        component: ActivityMappingComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'depo',
        component: DepoDashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Depot] },
      },
      {
        path: 'container-allotment',
        component: ContainerAllotmentComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Depot] },
      },
      {
        path: 'container-allotment-list',
        component: ContainerAllotmentListComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Depot] },
      },

      {
        path: 'manifest-list',
        component: ManifestListComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'notification',
        component: PushNotificationComponent,
      },
      {
        path: 'mr-request',
        component: MrRequestComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'mnr-request-list',
        component: MrRequestListComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'dentention-waiver',
        component: DetentionWaverRequestComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'load-list',
        component: LoadListComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'track-booking/:BOOKING_NO',
        component: TrackBookingComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'test-map',
        component: TestMapComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
      {
        path: 'tdr',
        component: TdrComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Agent] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
