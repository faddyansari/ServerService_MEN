"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var analytics_visitorleftwithoutlivechat_component_1 = require("./analytics-visitorleftwithoutlivechat.component");
describe('AnalyticsVisitorleftwithoutlivechatComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [analytics_visitorleftwithoutlivechat_component_1.AnalyticsVisitorleftwithoutlivechatComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(analytics_visitorleftwithoutlivechat_component_1.AnalyticsVisitorleftwithoutlivechatComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=analytics-visitorleftwithoutlivechat.component.spec.js.map