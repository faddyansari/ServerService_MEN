import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetMarketingComponent } from './widget-marketing.component';

describe('WidgetMarketingComponent', () => {
  let component: WidgetMarketingComponent;
  let fixture: ComponentFixture<WidgetMarketingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetMarketingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
