import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurrenderedListComponent } from './surrendered-list.component';

describe('SurrenderedListComponent', () => {
  let component: SurrenderedListComponent;
  let fixture: ComponentFixture<SurrenderedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurrenderedListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurrenderedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
