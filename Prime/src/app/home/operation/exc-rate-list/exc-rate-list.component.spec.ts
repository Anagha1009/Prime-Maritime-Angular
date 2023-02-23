import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcRateListComponent } from './exc-rate-list.component';

describe('ExcRateListComponent', () => {
  let component: ExcRateListComponent;
  let fixture: ComponentFixture<ExcRateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcRateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcRateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
