"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var analytics_returnvisitorratio_component_1 = require("./analytics-returnvisitorratio.component");
describe('AnalyticsReturnvisitorratioComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [analytics_returnvisitorratio_component_1.AnalyticsReturnvisitorratioComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(analytics_returnvisitorratio_component_1.AnalyticsReturnvisitorratioComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=analytics-returnvisitorratio.component.spec.js.map