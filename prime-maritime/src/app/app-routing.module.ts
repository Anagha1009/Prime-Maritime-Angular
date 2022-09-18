import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';

const routes: Routes = [{
  path:'',
  component:MainLayoutComponent,
  children:[{
    path:'',
    component:HomeComponent
  },
  {
    path:'login',
    component:LoginComponent
  }
]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
