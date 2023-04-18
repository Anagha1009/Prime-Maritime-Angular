import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RenewPwdComponent } from './renew-pwd/renew-pwd.component';

const routes: Routes = [
  {
    path: '',
    component: RenewPwdComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RenewPwdRoutingModule {}
