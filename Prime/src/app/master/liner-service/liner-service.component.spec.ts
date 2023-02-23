import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinerServiceComponent } from './liner-service.component';

describe('LinerServiceComponent', () => {
  let component: LinerServiceComponent;
  let fixture: ComponentFixture<LinerServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinerServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinerServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
