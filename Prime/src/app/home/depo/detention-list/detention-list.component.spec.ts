import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetentionListComponent } from './detention-list.component';

describe('DetentionListComponent', () => {
  let component: DetentionListComponent;
  let fixture: ComponentFixture<DetentionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetentionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetentionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
