import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { MainLayoutModule } from './layouts/main-layout/main-layout.module';
import { AgentDashboardComponent } from './modules/agent-dashboard/agent-dashboard.component';
import { BookingListComponent } from './modules/booking-list/booking-list.component';
import { CroListComponent } from './modules/cro-list/cro-list.component';
import { LoginComponent } from './modules/login/login.component';
import { NewBlComponent } from './modules/new-bl/new-bl.component';
import { NewCroComponent } from './modules/new-cro/new-cro.component';
import { NewQuotationComponent } from './modules/new-quotation/new-quotation.component';
import { LandingComponent } from './shared/components/landing/landing.component';

const routes: Routes = [
  {
    path: 'home',
    component: LandingComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'home/agent-dashboard',
        component: AgentDashboardComponent,
      },
      {
        path: 'home/new-quotation',
        component: NewQuotationComponent,
      },
      {
        path: 'home/new-cro',
        component: NewCroComponent,
      },
      {
        path: 'home/new-bl',
        component: NewBlComponent,
      },
      {
        path: 'home/bookings',
        component: BookingListComponent,
      },
      {
        path: 'home/cro-list',
        component: CroListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
