import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErDetailsComponent } from './er-details.component';

describe('ErDetailsComponent', () => {
  let component: ErDetailsComponent;
  let fixture: ComponentFixture<ErDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
