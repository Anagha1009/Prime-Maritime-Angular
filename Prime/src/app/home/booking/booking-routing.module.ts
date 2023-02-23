import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/@core/services/auth.guard';
import { Role } from 'src/app/models/login';
import { BookingListComponent } from './booking-list/booking-list.component';
import { ErDetailsComponent } from './er-details/er-details.component';
import { ErListComponent } from './er-list/er-list.component';
import { NewErComponent } from './new-er/new-er.component';
import { SplitBookingComponent } from './split-booking/split-booking.component';
const routes: Routes = [
  {
    path: 'booking-list',
    component: BookingListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'rollover',
    component: SplitBookingComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'new-er',
    component: NewErComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'er-list',
    component: ErListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },
  {
    path: 'er-details',
    component: ErDetailsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Agent] },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }
