import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from 'src/app/helpers/jwt.interceptor';
import { MainLayoutComponent } from './main-layout.component';
import { LoginComponent } from 'src/app/modules/login/login.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgentDashboardComponent } from 'src/app/modules/agent-dashboard/agent-dashboard.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NewQuotationComponent } from 'src/app/modules/new-quotation/new-quotation.component';
import { NewCroComponent } from 'src/app/modules/new-cro/new-cro.component';
import { NewBlComponent } from 'src/app/modules/new-bl/new-bl.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    LoginComponent,
    AgentDashboardComponent,
    NewQuotationComponent,
    NewCroComponent,
    NewBlComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
})
export class MainLayoutModule {}
