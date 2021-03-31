"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var keyboard_shortcuts_component_1 = require("./keyboard-shortcuts.component");
describe('KeyboardShortcutsComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [keyboard_shortcuts_component_1.KeyboardShortcutsComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(keyboard_shortcuts_component_1.KeyboardShortcutsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=keyboard-shortcuts.component.spec.js.map