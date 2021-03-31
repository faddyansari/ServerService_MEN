import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsRegvialivechatComponent } from './analytics-regvialivechat.component';

describe('AnalyticsRegvialivechatComponent', () => {
  let component: AnalyticsRegvialivechatComponent;
  let fixture: ComponentFixture<AnalyticsRegvialivechatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsRegvialivechatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsRegvialivechatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
