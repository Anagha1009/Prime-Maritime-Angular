import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout.component';
import { HomeComponent } from 'src/app/modules/home/home.component';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginComponent } from 'src/app/modules/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgentDashboardComponent } from 'src/app/modules/agent-dashboard/agent-dashboard.component';
import { QuotationDetailsComponent } from 'src/app/modules/quotation-details/quotation-details.component';
import { NewQuotationComponent } from 'src/app/modules/new-quotation/new-quotation.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    HomeComponent,
    LoginComponent,
    AgentDashboardComponent,
    QuotationDetailsComponent,
    NewQuotationComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class MainLayoutModule {}
