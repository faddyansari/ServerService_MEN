"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var analytics_agentscorecard_component_1 = require("./analytics-agentscorecard.component");
describe('AnalyticsAgentscorecardComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [analytics_agentscorecard_component_1.AnalyticsAgentscorecardComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(analytics_agentscorecard_component_1.AnalyticsAgentscorecardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=analytics-agentscorecard.component.spec.js.map