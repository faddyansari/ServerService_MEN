import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerFiltersComponent } from './drawer-filters.component';

describe('DrawerFiltersComponent', () => {
  let component: DrawerFiltersComponent;
  let fixture: ComponentFixture<DrawerFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawerFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
