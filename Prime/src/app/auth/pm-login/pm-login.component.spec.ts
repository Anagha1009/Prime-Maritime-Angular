import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmLoginComponent } from './pm-login.component';

describe('PmLoginComponent', () => {
  let component: PmLoginComponent;
  let fixture: ComponentFixture<PmLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
