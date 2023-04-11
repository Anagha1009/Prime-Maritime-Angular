import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../@core/services/auth.guard';
import { Role } from '../models/login';
import { PmBlListComponent } from './pm-bl-list/pm-bl-list.component';
import { PmBookingListComponent } from './pm-booking-list/pm-booking-list.component';
import { PmCroListComponent } from './pm-cro-list/pm-cro-list.component';
import { PmDoListComponent } from './pm-do-list/pm-do-list.component';
import { PmMrRequestComponent } from './pm-mr-request/pm-mr-request.component';
import { PmQuotationDetailsComponent } from './pm-quotation-details/pm-quotation-details.component';
import { PmQuotationListComponent } from './pm-quotation-list/pm-quotation-list.component';

const routes: Routes = [
  {
    path: 'mnr-request',
    component: PmMrRequestComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Principal, Role.EQC] },
  },
  {
    path: 'srr-details/:SRR_NO',
    component: PmQuotationDetailsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Principal, Role.Admin] },
  },
  {
    path: 'srr-list',
    component: PmQuotationListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Principal, Role.Admin] },
  },
  {
    path: 'booking-list',
    component: PmBookingListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Principal, Role.Admin] },
  },
  {
    path: 'cro-list',
    component: PmCroListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Principal, Role.Admin] },
  },
  {
    path: 'bl-list',
    component: PmBlListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Principal, Role.Admin] },
  },
  {
    path: 'do-list',
    component: PmDoListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Principal, Role.Admin] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PmHomeRoutingModule {}
