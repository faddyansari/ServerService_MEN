import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketScenarioAutomationListComponent } from './ticket-scenario-automation-list.component';

describe('TicketScenarioAutomationListComponent', () => {
  let component: TicketScenarioAutomationListComponent;
  let fixture: ComponentFixture<TicketScenarioAutomationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketScenarioAutomationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketScenarioAutomationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
