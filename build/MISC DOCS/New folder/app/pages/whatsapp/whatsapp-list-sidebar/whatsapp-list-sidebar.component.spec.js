"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var whatsapp_list_sidebar_component_1 = require("./whatsapp-list-sidebar.component");
describe('WhatsappListSidebarComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [whatsapp_list_sidebar_component_1.WhatsappListSidebarComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(whatsapp_list_sidebar_component_1.WhatsappListSidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=whatsapp-list-sidebar.component.spec.js.map