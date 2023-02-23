import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/@core/services/auth.guard';
import { Role } from 'src/app/models/login';
import { ContainerAllotmentListComponent } from './container-allotment-list/container-allotment-list.component';
import { ContainerAllotmentComponent } from './container-allotment/container-allotment.component';
import { DepoDashboardComponent } from './depo-dashboard/depo-dashboard.component';
import { DetentionListComponent } from './detention-list/detention-list.component';
import { DetentionWaverRequestComponent } from './detention-waver-request/detention-waver-request.component';
import { MrRequestListComponent } from './mr-request-list/mr-request-list.component';
import { MrRequestComponent } from './mr-request/mr-request.component';

const routes: Routes = [
  {
    path: 'container-allotment',
    component: ContainerAllotmentComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent,Role.Depot] },
  },
  {
    path: 'container-allotment-list',
    component: ContainerAllotmentListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent,Role.Depot] },
  },
  {
    path: 'depo-dashboard',
    component: DepoDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent,Role.Depot] },
  },
  {
    path: 'detention-list',
    component: DetentionListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent,Role.Depot] },
  },
  {
    path: 'detention-waver-request',
    component: DetentionWaverRequestComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent,Role.Depot] },
  },
  {
    path: 'mr-request',
    component: MrRequestComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent,Role.Depot] },
  },
  {
    path: 'mr-request-list',
    component: MrRequestListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent,Role.Depot] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepoRoutingModule { }
