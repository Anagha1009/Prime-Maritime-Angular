import { NgModule } from '@angular/core';
import { MainLayoutComponent } from './main-layout.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from 'src/app/helpers/jwt.interceptor';

@NgModule({
  declarations: [
    MainLayoutComponent,
  ],
  imports: [
    RouterModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
})
export class MainLayoutModule {}
