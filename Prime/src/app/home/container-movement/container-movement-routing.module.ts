import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/@core/services/auth.guard';
import { Role } from 'src/app/models/login';
import { CtListComponent } from './ct-list/ct-list.component';
import { DetentionComponent } from './detention/detention.component';
import { NewContainerMovementComponent } from './new-container-movement/new-container-movement.component';
import { NewTrackComponent } from './new-track/new-track.component';

const routes: Routes = [
  {
    path: 'new-container-movement',
    component: NewContainerMovementComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent, Role.Depot] },
  },
  {
    path: 'container-tracking',
    component: NewTrackComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent, Role.Depot] },
  },
  {
    path: 'container-history',
    component: CtListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent, Role.Depot] },
  },
  {
    path: 'detention',
    component: DetentionComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContainerMovementRoutingModule {}
