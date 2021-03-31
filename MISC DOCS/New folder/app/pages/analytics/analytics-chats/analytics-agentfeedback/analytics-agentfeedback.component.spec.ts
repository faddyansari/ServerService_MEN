import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsAgentfeedbackComponent } from './analytics-agentfeedback.component';

describe('AnalyticsAgentfeedbackComponent', () => {
  let component: AnalyticsAgentfeedbackComponent;
  let fixture: ComponentFixture<AnalyticsAgentfeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsAgentfeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsAgentfeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
