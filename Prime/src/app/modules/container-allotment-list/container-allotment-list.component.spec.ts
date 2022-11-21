import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerAllotmentListComponent } from './container-allotment-list.component';

describe('ContainerAllotmentListComponent', () => {
  let component: ContainerAllotmentListComponent;
  let fixture: ComponentFixture<ContainerAllotmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerAllotmentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerAllotmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
