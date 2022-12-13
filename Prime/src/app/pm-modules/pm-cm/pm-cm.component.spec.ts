import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmCmComponent } from './pm-cm.component';

describe('PmCmComponent', () => {
  let component: PmCmComponent;
  let fixture: ComponentFixture<PmCmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmCmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmCmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
