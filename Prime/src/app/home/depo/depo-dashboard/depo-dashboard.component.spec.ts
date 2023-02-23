import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepoDashboardComponent } from './depo-dashboard.component';

describe('DepoDashboardComponent', () => {
  let component: DepoDashboardComponent;
  let fixture: ComponentFixture<DepoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepoDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
