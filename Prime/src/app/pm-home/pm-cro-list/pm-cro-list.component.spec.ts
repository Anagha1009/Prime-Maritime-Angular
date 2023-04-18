import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmCroListComponent } from './pm-cro-list.component';

describe('PmCroListComponent', () => {
  let component: PmCroListComponent;
  let fixture: ComponentFixture<PmCroListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmCroListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmCroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
