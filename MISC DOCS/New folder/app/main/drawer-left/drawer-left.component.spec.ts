import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerLeftComponent } from './drawer-left.component';

describe('DrawerLeftComponent', () => {
  let component: DrawerLeftComponent;
  let fixture: ComponentFixture<DrawerLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawerLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
