import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErListComponent } from './er-list.component';

describe('ErListComponent', () => {
  let component: ErListComponent;
  let fixture: ComponentFixture<ErListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
