import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmContainerListComponent } from './pm-container-list.component';

describe('PmContainerListComponent', () => {
  let component: PmContainerListComponent;
  let fixture: ComponentFixture<PmContainerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmContainerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmContainerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
