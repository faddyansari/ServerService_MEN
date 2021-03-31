"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var acknowledge_message_list_component_1 = require("./acknowledge-message-list.component");
describe('AcknowledgeMessageListComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [acknowledge_message_list_component_1.AcknowledgeMessageListComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(acknowledge_message_list_component_1.AcknowledgeMessageListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=acknowledge-message-list.component.spec.js.map