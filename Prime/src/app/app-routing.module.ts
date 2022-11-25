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

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
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
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
