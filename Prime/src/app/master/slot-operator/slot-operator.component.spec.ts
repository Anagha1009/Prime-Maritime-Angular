import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotOperatorComponent } from './slot-operator.component';

describe('SlotOperatorComponent', () => {
  let component: SlotOperatorComponent;
  let fixture: ComponentFixture<SlotOperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlotOperatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
