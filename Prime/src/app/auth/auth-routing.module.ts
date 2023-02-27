import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PmLoginComponent } from './pm-login/pm-login.component';

const routes: Routes = [

  {
    path: '',
    component:PmLoginComponent,
    data: {
      title: 'Landing'
    }
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
