import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrRequestListComponent } from './mr-request-list.component';

describe('MrRequestListComponent', () => {
  let component: MrRequestListComponent;
  let fixture: ComponentFixture<MrRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrRequestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MrRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
