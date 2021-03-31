"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var analytics_totalvisitors_new_component_1 = require("./analytics-totalvisitors-new.component");
describe('AnalyticsTotalvisitorsNewComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [analytics_totalvisitors_new_component_1.AnalyticsTotalvisitorsNewComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(analytics_totalvisitors_new_component_1.AnalyticsTotalvisitorsNewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=analytics-totalvisitors-new.component.spec.js.map