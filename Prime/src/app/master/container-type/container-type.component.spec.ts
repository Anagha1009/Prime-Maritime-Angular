import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerTypeComponent } from './container-type.component';

describe('ContainerTypeComponent', () => {
  let component: ContainerTypeComponent;
  let fixture: ComponentFixture<ContainerTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
