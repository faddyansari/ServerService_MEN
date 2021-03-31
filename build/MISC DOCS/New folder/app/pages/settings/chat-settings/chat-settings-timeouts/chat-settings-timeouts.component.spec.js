"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var chat_settings_timeouts_component_1 = require("./chat-settings-timeouts.component");
describe('ChatSettingsTimeoutsComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [chat_settings_timeouts_component_1.ChatSettingsTimeoutsComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(chat_settings_timeouts_component_1.ChatSettingsTimeoutsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=chat-settings-timeouts.component.spec.js.map