import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerAllotmentComponent } from './container-allotment.component';

describe('ContainerAllotmentComponent', () => {
  let component: ContainerAllotmentComponent;
  let fixture: ComponentFixture<ContainerAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerAllotmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
