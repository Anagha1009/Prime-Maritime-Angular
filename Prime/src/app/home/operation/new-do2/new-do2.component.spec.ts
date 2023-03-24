import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDo2Component } from './new-do2.component';

describe('NewDo2Component', () => {
  let component: NewDo2Component;
  let fixture: ComponentFixture<NewDo2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewDo2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDo2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
