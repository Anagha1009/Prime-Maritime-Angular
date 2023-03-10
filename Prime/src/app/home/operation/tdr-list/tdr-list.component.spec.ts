import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdrListComponent } from './tdr-list.component';

describe('TdrListComponent', () => {
  let component: TdrListComponent;
  let fixture: ComponentFixture<TdrListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TdrListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TdrListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
