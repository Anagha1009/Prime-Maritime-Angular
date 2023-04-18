import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewPwdComponent } from './renew-pwd.component';

describe('RenewPwdComponent', () => {
  let component: RenewPwdComponent;
  let fixture: ComponentFixture<RenewPwdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenewPwdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewPwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
