import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/@core/services/auth.guard';
import { Role } from 'src/app/models/login';
import { NewQuotationComponent } from './new-quotation/new-quotation.component';
import { QuotationDetailsComponent } from './quotation-details/quotation-details.component';
import { QuotationListComponent } from './quotation-list/quotation-list.component';

const routes: Routes = [
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
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateRequestsRoutingModule { }
