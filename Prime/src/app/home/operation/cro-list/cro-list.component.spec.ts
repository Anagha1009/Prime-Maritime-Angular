import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CroListComponent } from './cro-list.component';

describe('CroListComponent', () => {
  let component: CroListComponent;
  let fixture: ComponentFixture<CroListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CroListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
