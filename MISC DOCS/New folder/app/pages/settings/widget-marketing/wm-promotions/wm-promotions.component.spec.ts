import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WmPromotionsComponent } from './wm-promotions.component';

describe('WmPromotionsComponent', () => {
  let component: WmPromotionsComponent;
  let fixture: ComponentFixture<WmPromotionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WmPromotionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WmPromotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
