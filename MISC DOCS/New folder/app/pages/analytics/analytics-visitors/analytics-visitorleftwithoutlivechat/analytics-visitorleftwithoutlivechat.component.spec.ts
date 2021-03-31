import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsVisitorleftwithoutlivechatComponent } from './analytics-visitorleftwithoutlivechat.component';

describe('AnalyticsVisitorleftwithoutlivechatComponent', () => {
  let component: AnalyticsVisitorleftwithoutlivechatComponent;
  let fixture: ComponentFixture<AnalyticsVisitorleftwithoutlivechatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsVisitorleftwithoutlivechatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsVisitorleftwithoutlivechatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
