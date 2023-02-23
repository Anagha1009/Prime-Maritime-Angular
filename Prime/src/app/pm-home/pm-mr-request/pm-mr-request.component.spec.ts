import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmMrRequestComponent } from './pm-mr-request.component';

describe('PmMrRequestComponent', () => {
  let component: PmMrRequestComponent;
  let fixture: ComponentFixture<PmMrRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmMrRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmMrRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
