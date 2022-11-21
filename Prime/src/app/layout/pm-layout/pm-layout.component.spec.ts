import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmLayoutComponent } from './pm-layout.component';

describe('PmLayoutComponent', () => {
  let component: PmLayoutComponent;
  let fixture: ComponentFixture<PmLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
