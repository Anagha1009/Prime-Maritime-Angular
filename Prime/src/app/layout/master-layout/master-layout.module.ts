import { NgModule } from '@angular/core';
import { MasterLayoutComponent } from './master-layout.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    MasterLayoutComponent
  ],
  imports: [
    SharedModule,
    RouterModule
  ]
})
export class MasterLayoutModule { }
