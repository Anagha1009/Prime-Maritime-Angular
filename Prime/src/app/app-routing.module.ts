import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { PartyComponent } from './masters/party/party.component';
import { BookingListComponent } from './modules/booking-list/booking-list.component';
import { CroListComponent } from './modules/cro-list/cro-list.component';
import { DetentionListComponent } from './modules/detention-list/detention-list.component';
import { LoginComponent } from './modules/login/login.component';
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
import { ContainerAllotmentListComponent } from './modules/container-allotment-list/container-allotment-list.component';
import { ContainerAllotmentComponent } from './modules/container-allotment/container-allotment.component';
import { DepoDashboardComponent } from './modules/depo-dashboard/depo-dashboard.component';
import { NewBlComponent } from './modules/new-bl/new-bl.component';
import { NewCmComponent } from './modules/new-cm/new-cm.component';
import { PmLoginComponent } from './pm-modules/pm-login/pm-login.component';
import { VesselComponent } from './masters/vessel/vessel.component';
import { ServiceComponent } from './masters/service/service.component';
import { ContainerTypeComponent } from './masters/container-type/container-type.component';

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
        path: 'login',
        component: PmLoginComponent,
      },
      {
        path: 'quotation-list',
        component: PmQuotationListComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
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
        component:ServicetypeComponent,
      },
      {
        path:'currency',
        component:CurrencyComponent,
      },
      {
        path:'unit',
        component:UnitComponent,
      },
      {
        path:'port',
        component:PortComponent,
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
        path:'vessel',
        component:VesselComponent,
      },
      {
        path:'service',
        component:ServiceComponent,
        
      },
      {
        path:'containerType',
        component:ContainerTypeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
