"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallSettingsComponent = void 0;
var core_1 = require("@angular/core");
var CallSettingsComponent = /** @class */ (function () {
    function CallSettingsComponent(_globalStateServie) {
        this._globalStateServie = _globalStateServie;
    }
    CallSettingsComponent.prototype.ngOnInit = function () {
    };
    CallSettingsComponent.prototype.STOPPROPAGATION = function (event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        this._globalStateServie.setSettingsMenu(false);
    };
    __decorate([
        core_1.Input()
    ], CallSettingsComponent.prototype, "activeTab", void 0);
    CallSettingsComponent = __decorate([
        core_1.Component({
            selector: 'app-call-settings',
            templateUrl: './call-settings.component.html',
            styleUrls: ['./call-settings.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], CallSettingsComponent);
    return CallSettingsComponent;
}());
exports.CallSettingsComponent = CallSettingsComponent;
//# sourceMappingURL=call-settings.component.js.map