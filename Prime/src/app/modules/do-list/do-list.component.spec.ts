import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoListComponent } from './do-list.component';

describe('DoListComponent', () => {
  let component: DoListComponent;
  let fixture: ComponentFixture<DoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
