import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeBlComponent } from './merge-bl.component';

describe('MergeBlComponent', () => {
  let component: MergeBlComponent;
  let fixture: ComponentFixture<MergeBlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeBlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeBlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
