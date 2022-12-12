import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmSidebarComponent } from './pm-sidebar.component';

describe('PmSidebarComponent', () => {
  let component: PmSidebarComponent;
  let fixture: ComponentFixture<PmSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
