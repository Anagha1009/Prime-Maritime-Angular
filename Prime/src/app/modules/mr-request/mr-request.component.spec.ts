import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrRequestComponent } from './mr-request.component';

describe('MrRequestComponent', () => {
  let component: MrRequestComponent;
  let fixture: ComponentFixture<MrRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MrRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
