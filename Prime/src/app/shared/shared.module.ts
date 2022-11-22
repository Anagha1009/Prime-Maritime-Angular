import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PmLandingComponent } from './pm-landing/pm-landing.component';

@NgModule({
  declarations: [LandingComponent, HeaderComponent, FooterComponent, PmLandingComponent],
  imports: [CommonModule],
  exports: [HeaderComponent, FooterComponent],
})
export class SharedModule {}
