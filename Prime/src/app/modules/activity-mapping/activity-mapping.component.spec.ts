import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityMappingComponent } from './activity-mapping.component';

describe('ActivityMappingComponent', () => {
  let component: ActivityMappingComponent;
  let fixture: ComponentFixture<ActivityMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
