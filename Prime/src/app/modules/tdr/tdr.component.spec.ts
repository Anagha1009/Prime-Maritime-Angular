import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdrComponent } from './tdr.component';

describe('TdrComponent', () => {
  let component: TdrComponent;
  let fixture: ComponentFixture<TdrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TdrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TdrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
