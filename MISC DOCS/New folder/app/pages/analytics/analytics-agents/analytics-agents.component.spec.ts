import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsAgentComponent } from './analytics-agents.component';

describe('AnalyticsAgentComponent', () => {
  let component: AnalyticsAgentComponent;
  let fixture: ComponentFixture<AnalyticsAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
