"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var analytics_visitorleftfromfirstpage_component_1 = require("./analytics-visitorleftfromfirstpage.component");
describe('AnalyticsVisitorleftfromfirstpageComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [analytics_visitorleftfromfirstpage_component_1.AnalyticsVisitorleftfromfirstpageComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(analytics_visitorleftfromfirstpage_component_1.AnalyticsVisitorleftfromfirstpageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=analytics-visitorleftfromfirstpage.component.spec.js.map