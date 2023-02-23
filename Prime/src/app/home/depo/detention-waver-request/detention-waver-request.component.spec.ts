import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetentionWaverRequestComponent } from './detention-waver-request.component';

describe('DetentionWaverRequestComponent', () => {
  let component: DetentionWaverRequestComponent;
  let fixture: ComponentFixture<DetentionWaverRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetentionWaverRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetentionWaverRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
