"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactSettingsComponent = void 0;
var core_1 = require("@angular/core");
var ContactSettingsComponent = /** @class */ (function () {
    function ContactSettingsComponent(_globalStateServie) {
        this._globalStateServie = _globalStateServie;
    }
    ContactSettingsComponent.prototype.ngOnInit = function () {
    };
    ContactSettingsComponent.prototype.STOPPROPAGATION = function (event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        this._globalStateServie.setSettingsMenu(false);
    };
    __decorate([
        core_1.Input()
    ], ContactSettingsComponent.prototype, "activeTab", void 0);
    ContactSettingsComponent = __decorate([
        core_1.Component({
            selector: 'app-contact-settings',
            templateUrl: './contact-settings.component.html',
            styleUrls: ['./contact-settings.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ContactSettingsComponent);
    return ContactSettingsComponent;
}());
exports.ContactSettingsComponent = ContactSettingsComponent;
//# sourceMappingURL=contact-settings.component.js.map