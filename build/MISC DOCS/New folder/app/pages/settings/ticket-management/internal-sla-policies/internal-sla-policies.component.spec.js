"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var internal_sla_policies_component_1 = require("./internal-sla-policies.component");
describe('InternalSlaPoliciesComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [internal_sla_policies_component_1.InternalSlaPoliciesComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(internal_sla_policies_component_1.InternalSlaPoliciesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=internal-sla-policies.component.spec.js.map