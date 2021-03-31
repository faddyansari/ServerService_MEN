"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var visitors_fixed_chat_sidebar_component_1 = require("./visitors-fixed-chat-sidebar.component");
describe('VisitorsFixedChatSidebarComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [visitors_fixed_chat_sidebar_component_1.VisitorsFixedChatSidebarComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(visitors_fixed_chat_sidebar_component_1.VisitorsFixedChatSidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=visitors-fixed-chat-sidebar.component.spec.js.map