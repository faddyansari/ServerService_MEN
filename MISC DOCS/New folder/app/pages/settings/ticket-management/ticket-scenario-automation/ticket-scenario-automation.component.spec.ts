import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketScenarioAutomationComponent } from './ticket-scenario-automation.component';

describe('TicketScenarioAutomationComponent', () => {
  let component: TicketScenarioAutomationComponent;
  let fixture: ComponentFixture<TicketScenarioAutomationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketScenarioAutomationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketScenarioAutomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
