"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var ticket_scenario_automation_list_component_1 = require("./ticket-scenario-automation-list.component");
describe('TicketScenarioAutomationListComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [ticket_scenario_automation_list_component_1.TicketScenarioAutomationListComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(ticket_scenario_automation_list_component_1.TicketScenarioAutomationListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=ticket-scenario-automation-list.component.spec.js.map