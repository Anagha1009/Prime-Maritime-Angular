import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetypeComponent } from './servicetype.component';

describe('ServicetypeComponent', () => {
  let component: ServicetypeComponent;
  let fixture: ComponentFixture<ServicetypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicetypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
