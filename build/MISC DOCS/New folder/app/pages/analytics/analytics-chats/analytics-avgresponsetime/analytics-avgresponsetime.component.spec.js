"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var analytics_avgresponsetime_component_1 = require("./analytics-avgresponsetime.component");
describe('AnalyticsAvgresponsetimeComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [analytics_avgresponsetime_component_1.AnalyticsAvgresponsetimeComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(analytics_avgresponsetime_component_1.AnalyticsAvgresponsetimeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=analytics-avgresponsetime.component.spec.js.map