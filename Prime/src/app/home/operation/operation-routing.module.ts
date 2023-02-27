import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/@core/services/auth.guard';
import { Role } from 'src/app/models/login';
import { CroListComponent } from './cro-list/cro-list.component';
import { DoDetailsComponent } from './do-details/do-details.component';
import { DoListComponent } from './do-list/do-list.component';
import { ExcRateListComponent } from './exc-rate-list/exc-rate-list.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { LoadListComponent } from './load-list/load-list.component';
import { ManifestListComponent } from './manifest-list/manifest-list.component';
import { NewBlComponent } from './new-bl/new-bl.component';
import { NewCroComponent } from './new-cro/new-cro.component';
import { NewDoComponent } from './new-do/new-do.component';
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';
import { TdrComponent } from './tdr/tdr.component';

const routes: Routes = [
  {
    path: 'cro-list',
    component: CroListComponent,
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
    path: 'do-list',
    component: DoListComponent,
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
    path: 'manifest-list',
    component: ManifestListComponent,
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
    path: 'new-do',
    component: NewDoComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'tdr',
    component: TdrComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'exc-rate-list',
    component: ExcRateListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'new-invoice',
    component: NewInvoiceComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'invoice-list',
    component: InvoiceListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationRoutingModule {}
