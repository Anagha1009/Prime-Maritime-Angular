import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmLandingComponent } from './pm-landing.component';

describe('PmLandingComponent', () => {
  let component: PmLandingComponent;
  let fixture: ComponentFixture<PmLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
