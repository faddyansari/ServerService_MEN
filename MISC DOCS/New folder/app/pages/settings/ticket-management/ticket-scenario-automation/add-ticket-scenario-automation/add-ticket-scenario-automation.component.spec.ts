import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTicketScenarioAutomationComponent } from './add-ticket-scenario-automation.component';

describe('AddTicketScenarioAutomationComponent', () => {
  let component: AddTicketScenarioAutomationComponent;
  let fixture: ComponentFixture<AddTicketScenarioAutomationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTicketScenarioAutomationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTicketScenarioAutomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
