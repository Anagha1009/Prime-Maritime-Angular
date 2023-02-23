import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBlComponent } from './new-bl.component';

describe('NewBlComponent', () => {
  let component: NewBlComponent;
  let fixture: ComponentFixture<NewBlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
