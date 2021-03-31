import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsAgentactivityComponent } from './analytics-agentactivity.component';

describe('AnalyticsAgentactivityComponent', () => {
  let component: AnalyticsAgentactivityComponent;
  let fixture: ComponentFixture<AnalyticsAgentactivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsAgentactivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsAgentactivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
