"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var analytics_ticketcustomdashboard_component_1 = require("./analytics-ticketcustomdashboard.component");
describe('AnalyticsTicketcustomdashboardComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [analytics_ticketcustomdashboard_component_1.AnalyticsTicketcustomdashboardComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(analytics_ticketcustomdashboard_component_1.AnalyticsTicketcustomdashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=analytics-ticketcustomdashboard.component.spec.js.map