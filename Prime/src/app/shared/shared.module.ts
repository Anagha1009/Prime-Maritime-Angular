import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
  declarations: [LandingComponent, HeaderComponent, FooterComponent],
  imports: [CommonModule],
  exports: [HeaderComponent, FooterComponent,SimpleNotificationsModule],
})
export class SharedModule {}
