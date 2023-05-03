import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatoryComponent } from './mandatory.component';

describe('MandatoryComponent', () => {
  let component: MandatoryComponent;
  let fixture: ComponentFixture<MandatoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MandatoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
