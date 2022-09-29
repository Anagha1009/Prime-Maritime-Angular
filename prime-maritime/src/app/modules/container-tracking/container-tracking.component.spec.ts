import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerTrackingComponent } from './container-tracking.component';

describe('ContainerTrackingComponent', () => {
  let component: ContainerTrackingComponent;
  let fixture: ComponentFixture<ContainerTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerTrackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
