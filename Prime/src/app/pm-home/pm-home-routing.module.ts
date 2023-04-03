import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../@core/services/auth.guard';
import { Role } from '../models/login';
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PmHomeRoutingModule {}
