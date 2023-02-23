import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewContainerMovementComponent } from './new-container-movement.component';

describe('NewContainerMovementComponent', () => {
  let component: NewContainerMovementComponent;
  let fixture: ComponentFixture<NewContainerMovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewContainerMovementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewContainerMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
