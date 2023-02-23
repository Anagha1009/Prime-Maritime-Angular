import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewErComponent } from './new-er.component';

describe('NewErComponent', () => {
  let component: NewErComponent;
  let fixture: ComponentFixture<NewErComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewErComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewErComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
