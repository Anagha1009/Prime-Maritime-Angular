import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PmLayoutComponent } from './pm-layout.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    PmLayoutComponent,
  ],

  imports: [
    SharedModule,
    RouterModule,    
  ],
})
export class PmLayoutModule {}
