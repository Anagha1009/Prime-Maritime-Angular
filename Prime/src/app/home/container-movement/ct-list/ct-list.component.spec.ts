import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtListComponent } from './ct-list.component';

describe('CtListComponent', () => {
  let component: CtListComponent;
  let fixture: ComponentFixture<CtListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
