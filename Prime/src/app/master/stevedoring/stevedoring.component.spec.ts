import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StevedoringComponent } from './stevedoring.component';

describe('StevedoringComponent', () => {
  let component: StevedoringComponent;
  let fixture: ComponentFixture<StevedoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StevedoringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StevedoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
