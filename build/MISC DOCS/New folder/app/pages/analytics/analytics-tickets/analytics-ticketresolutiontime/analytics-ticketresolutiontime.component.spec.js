"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var analytics_ticketresolutiontime_component_1 = require("./analytics-ticketresolutiontime.component");
describe('AnalyticsTicketresolutiontimeComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [analytics_ticketresolutiontime_component_1.AnalyticsTicketresolutiontimeComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(analytics_ticketresolutiontime_component_1.AnalyticsTicketresolutiontimeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=analytics-ticketresolutiontime.component.spec.js.map