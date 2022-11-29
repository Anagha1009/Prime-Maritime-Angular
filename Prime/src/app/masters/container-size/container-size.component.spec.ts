import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerSizeComponent } from './container-size.component';

describe('ContainerSizeComponent', () => {
  let component: ContainerSizeComponent;
  let fixture: ComponentFixture<ContainerSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContainerSizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
