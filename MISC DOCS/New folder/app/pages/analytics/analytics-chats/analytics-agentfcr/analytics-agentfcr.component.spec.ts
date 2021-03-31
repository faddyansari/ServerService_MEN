import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsAgentfcrComponent } from './analytics-agentfcr.component';

describe('AnalyticsAgentfcrComponent', () => {
  let component: AnalyticsAgentfcrComponent;
  let fixture: ComponentFixture<AnalyticsAgentfcrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsAgentfcrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsAgentfcrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
