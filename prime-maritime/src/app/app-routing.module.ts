import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { MainLayoutModule } from './layouts/main-layout/main-layout.module';
import { AgentDashboardComponent } from './modules/agent-dashboard/agent-dashboard.component';
import { ContainerTrackingComponent } from './modules/container-tracking/container-tracking.component';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { NewQuotationComponent } from './modules/new-quotation/new-quotation.component';
import { QuotationDetailsComponent } from './modules/quotation-details/quotation-details.component';
import { LandingComponent } from './shared/components/landing/landing.component';

const routes: Routes = [
  {
    path: 'home',
    component: LandingComponent,
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'home/login',
        component: LoginComponent,
      },
      {
        path: 'home/agent-dashboard',
        component: AgentDashboardComponent,
      },
      {
        path: 'home/quotation-details',
        component: QuotationDetailsComponent,
      },
      {
        path: 'home/new-quotation',
        component: NewQuotationComponent,
      },
      {
        path: 'home/tracking',
        component: ContainerTrackingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
