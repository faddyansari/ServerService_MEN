"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var add_ticket_scenario_automation_component_1 = require("./add-ticket-scenario-automation.component");
describe('AddTicketScenarioAutomationComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [add_ticket_scenario_automation_component_1.AddTicketScenarioAutomationComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(add_ticket_scenario_automation_component_1.AddTicketScenarioAutomationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=add-ticket-scenario-automation.component.spec.js.map