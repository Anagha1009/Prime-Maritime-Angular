import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../@core/services/auth.guard';
import { Role } from '../models/login';
import { ContainerSizeComponent } from './container-size/container-size.component';
import { ContainerTypeComponent } from './container-type/container-type.component';
import { ContainerComponent } from './container/container.component';
import { CurrencyComponent } from './currency/currency.component';
import { LinerServiceComponent } from './liner-service/liner-service.component';
import { LinerComponent } from './liner/liner.component';
import { PartyComponent } from './party/party.component';
import { PortComponent } from './port/port.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ServicetypeComponent } from './servicetype/servicetype.component';
import { UnitComponent } from './unit/unit.component';
import { VesselComponent } from './vessel/vessel.component';
import { VoyageComponent } from './voyage/voyage.component';

const routes: Routes = [
  {
    path: 'container-master',
    component: ContainerComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Principal] },
  },
  {
    path: 'container-size-master',
    component: ContainerSizeComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Principal] },
  },
  {
    path: 'container-type-master',
    component: ContainerTypeComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Principal, Role.Agent] },
  },
  {
    path: 'currency-master',
    component: CurrencyComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Principal, Role.Agent] },
  },
  {
    path: 'liner-master',
    component: LinerComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Principal, Role.Agent] },
  },
  {
    path: 'liner-service-master',
    component: LinerServiceComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Principal, Role.Agent] },
  },
  {
    path: 'party-master',
    component: PartyComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Principal, Role.Agent] },
  },
  {
    path: 'port-master',
    component: PortComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Principal] },
  },
  {
    path: 'schedule-master',
    component: ScheduleComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Principal, Role.Agent] },
  },
  {
    path: 'service-type-master',
    component: ServicetypeComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Principal, Role.Agent] },
  },
  {
    path: 'unit-master',
    component: UnitComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Principal, Role.Agent] },
  },
  {
    path: 'vessel-master',
    component: VesselComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Principal, Role.Agent] },
  },
  {
    path: 'voyage-master',
    component: VoyageComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Principal, Role.Agent] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule {}
