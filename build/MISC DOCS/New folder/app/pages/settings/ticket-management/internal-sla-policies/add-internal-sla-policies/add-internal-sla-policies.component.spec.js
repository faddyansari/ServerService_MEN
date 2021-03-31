"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var add_internal_sla_policies_component_1 = require("./add-internal-sla-policies.component");
describe('AddInternalSlaPoliciesComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [add_internal_sla_policies_component_1.AddInternalSlaPoliciesComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(add_internal_sla_policies_component_1.AddInternalSlaPoliciesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=add-internal-sla-policies.component.spec.js.map