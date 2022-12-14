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
import { ServiceComponent } from './masters/service/service.component';
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
import { SrrCalculatorComponent } from './pm-modules/srr-calculator/srr-calculator.component';
import { TdrComponent } from './modules/tdr/tdr.component';

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
      },
      {
        path: 'quotation-list',
        component: PmQuotationListComponent,
      },
      {
        path: 'container-movement',
        component: PmCmComponent,
      },
      {
        path: 'mr-request',
        component: PmMrRequestComponent,
      },
      {
        path: 'quotation-details',
        component: PmQuotationDetailsComponent,
      },
      {
        path: 'srr-calculator',
        component: SrrCalculatorComponent,
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
        path: 'quotation-list',
        component: QuotationListComponent,
      },
      {
        path: 'quotation-details',
        component: QuotationDetailsComponent,
      },
      {
        path: 'new-quotation',
        component: NewQuotationComponent,
      },
      {
        path: 'booking-list',
        component: BookingListComponent,
      },
      {
        path: 'split-booking',
        component: SplitBookingComponent,
      },
      {
        path: 'new-cro',
        component: NewCroComponent,
      },
      {
        path: 'new-er',
        component: NewErComponent,
      },
      {
        path: 'new-do',
        component: NewDoComponent,
      },
      {
        path: 'cro-list',
        component: CroListComponent,
      },
      {
        path: 'do',
        component: NewDoComponent,
      },
      {
        path: 'do-list',
        component: DoListComponent,
      },
      {
        path: 'do-details',
        component: DoDetailsComponent,
      },
      {
        path: 'party',
        component: PartyComponent,
      },
      {
        path: 'container',
        component: ContainerComponent,
      },
      {
        path: 'containerSize',
        component: ContainerSizeComponent,
      },
      {
        path: 'servicetype',
        component: ServicetypeComponent,
      },
      {
        path: 'currency',
        component: CurrencyComponent,
      },
      {
        path: 'unit',
        component: UnitComponent,
      },
      {
        path: 'port',
        component: PortComponent,
      },
      {
        path: 'new-bl',
        component: NewBlComponent,
      },
      {
        path: 'new-cm',
        component: NewCmComponent,
      },
      {
        path: 'tracking',
        component: TrackingComponent,
      },
      {
        path: 'ct-list',
        component: CtListComponent,
      },
      {
        path: 'activity-mapping',
        component: ActivityMappingComponent,
      },
      {
        path: 'depo',
        component: DepoDashboardComponent,
      },
      {
        path: 'container-allotment',
        component: ContainerAllotmentComponent,
      },
      {
        path: 'container-allotment-list',
        component: ContainerAllotmentListComponent,
      },
      {
        path: 'vessel',
        component: VesselComponent,
      },
      {
        path: 'service',
        component: ServiceComponent,
      },
      {
        path: 'containerType',
        component: ContainerTypeComponent,
      },
      {
        path: 'manifest-list',
        component: ManifestListComponent,
      },
      {
        path: 'notification',
        component: PushNotificationComponent,
      },
      {
        path: 'm&r-request',
        component: MrRequestComponent,
      },
      {
        path: 'm&r-request-list',
        component: MrRequestListComponent,
      },
      {
        path: 'dentention-waiver',
        component: DetentionWaverRequestComponent,
      },
      {
        path: 'load-list',
        component: LoadListComponent,
      },
      {
        path: 'track-booking',
        component: TrackBookingComponent,
      },
      {
        path:'test-map',
        component:TestMapComponent,
      },
      {
        path:'tdr',
        component:TdrComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
