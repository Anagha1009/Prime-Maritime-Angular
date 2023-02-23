import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCmComponent } from './new-cm.component';

describe('NewCmComponent', () => {
  let component: NewCmComponent;
  let fixture: ComponentFixture<NewCmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
