import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDoComponent } from './new-do.component';

describe('NewDoComponent', () => {
  let component: NewDoComponent;
  let fixture: ComponentFixture<NewDoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewDoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
