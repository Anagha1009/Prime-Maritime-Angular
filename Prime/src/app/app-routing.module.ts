import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { PmLayoutComponent } from './layout/pm-layout/pm-layout.component';
import { PmLandingComponent } from './shared/pm-landing/pm-landing.component';
import { AuthGuard } from './@core/services/auth.guard';
import { Role } from './models/login';
import { MasterLayoutComponent } from './layout/master-layout/master-layout.component';

import { BaseLayoutComponent } from './layout/base-layout/base-layout.component';
import { PmLoginComponent } from './auth/pm-login/pm-login.component';

const RateRequestsModule = () =>
  import('./home/rate-requests/rate-requests.module').then(
    (x) => x.RateRequestsModule
  );
const BookingModule = () =>
  import('./home/booking/booking.module').then((x) => x.BookingModule);
const OperationModule = () =>
  import('./home/operation/operation.module').then((x) => x.OperationModule);
const ContainerModule = () =>
  import('./home/container-movement/container-movement.module').then(
    (x) => x.ContainerMovementModule
  );
const DepoModule = () =>
  import('./home/depo/depo.module').then((x) => x.DepoModule);
const MasterModule = () =>
  import('./master/master.module').then((x) => x.MasterModule);
const PmHomeModule = () =>
  import('./pm-home/pm-home.module').then((x) => x.PmHomeModule);
const LandingModule = () =>
  import('./landing/landing.module').then((m) => m.LandingModule);
const AuthModule = () => import('./auth/auth.module').then((m) => m.AuthModule);

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  {
    path: 'landing',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: LandingModule,
        data: {
          title: 'landing',
        },
      },
    ],
  },
  {
    path: 'pm',
    component: PmLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: PmLandingComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Principal] },
      },
      {
        path: '',
        loadChildren: PmHomeModule,
        canActivate: [AuthGuard],
        data: {
          title: 'PM Home',
        },
      },
    ],
  },
  {
    path: 'login',
    component: PmLoginComponent,
    children: [
      {
        path: '',
        loadChildren: AuthModule,
        data: {
          title: 'login',
        },
      },
    ],
  },

  {
    path: 'master',
    component: MasterLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: MasterModule,
        canActivate: [AuthGuard],
        data: {
          title: 'Master',
        },
      },
    ],
  },
  {
    path: 'home',
    component: MainLayoutComponent,
    children: [
      {
        path: 'rate-request',
        loadChildren: RateRequestsModule,
        canActivate: [AuthGuard],
        data: {
          title: 'Rate Requests',
        },
      },
      {
        path: 'booking',
        loadChildren: BookingModule,
        canActivate: [AuthGuard],
        data: {
          title: 'Booking',
        },
      },
      {
        path: 'operations',
        loadChildren: OperationModule,
        canActivate: [AuthGuard],
        data: {
          title: 'Operations',
        },
      },
      {
        path: 'container',
        loadChildren: ContainerModule,
        canActivate: [AuthGuard],
        data: {
          title: 'Container',
        },
      },
      {
        path: 'depo',
        loadChildren: DepoModule,
        canActivate: [AuthGuard],
        data: {
          title: 'Depo',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
