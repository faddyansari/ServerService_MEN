"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralSettingsComponent = void 0;
var core_1 = require("@angular/core");
var GeneralSettingsComponent = /** @class */ (function () {
    function GeneralSettingsComponent(_authService, _globalStateServie) {
        var _this = this;
        this._globalStateServie = _globalStateServie;
        this.subscriptions = [];
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg;
            }
        }));
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            // console.log(data);
            if (data && data.permissions) {
                _this.permissions = data.permissions.settings;
                // console.log(this.permissions);			
            }
        }));
        this.subscriptions.push(_authService.getAgent().subscribe(function (data) {
            // console.log(data);
            _this.agent = data;
        }));
    }
    GeneralSettingsComponent.prototype.ngOnInit = function () {
    };
    GeneralSettingsComponent.prototype.STOPPROPAGATION = function (event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        this._globalStateServie.setSettingsMenu(false);
    };
    GeneralSettingsComponent = __decorate([
        core_1.Component({
            selector: 'app-general-settings',
            templateUrl: './general-settings.component.html',
            styleUrls: ['./general-settings.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], GeneralSettingsComponent);
    return GeneralSettingsComponent;
}());
exports.GeneralSettingsComponent = GeneralSettingsComponent;
//# sourceMappingURL=general-settings.component.js.map