import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsAgentscorecardComponent } from './analytics-agentscorecard.component';

describe('AnalyticsAgentscorecardComponent', () => {
  let component: AnalyticsAgentscorecardComponent;
  let fixture: ComponentFixture<AnalyticsAgentscorecardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsAgentscorecardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsAgentscorecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
