import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetentionComponent } from './detention.component';

describe('DetentionComponent', () => {
  let component: DetentionComponent;
  let fixture: ComponentFixture<DetentionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetentionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
