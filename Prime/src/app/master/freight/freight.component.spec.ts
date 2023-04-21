import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightComponent } from './freight.component';

describe('FreightComponent', () => {
  let component: FreightComponent;
  let fixture: ComponentFixture<FreightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
