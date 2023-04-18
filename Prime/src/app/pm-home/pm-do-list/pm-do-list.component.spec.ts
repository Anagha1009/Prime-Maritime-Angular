import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmDoListComponent } from './pm-do-list.component';

describe('PmDoListComponent', () => {
  let component: PmDoListComponent;
  let fixture: ComponentFixture<PmDoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmDoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmDoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
