import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmBlListComponent } from './pm-bl-list.component';

describe('PmBlListComponent', () => {
  let component: PmBlListComponent;
  let fixture: ComponentFixture<PmBlListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmBlListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmBlListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
