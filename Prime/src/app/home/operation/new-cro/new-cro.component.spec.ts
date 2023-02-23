import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCroComponent } from './new-cro.component';

describe('NewCroComponent', () => {
  let component: NewCroComponent;
  let fixture: ComponentFixture<NewCroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
