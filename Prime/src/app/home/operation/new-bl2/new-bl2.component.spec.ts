import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBl2Component } from './new-bl2.component';

describe('NewBl2Component', () => {
  let component: NewBl2Component;
  let fixture: ComponentFixture<NewBl2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBl2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBl2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
