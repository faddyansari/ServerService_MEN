"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsComponent = void 0;
var core_1 = require("@angular/core");
var IntegrationsComponent = /** @class */ (function () {
    function IntegrationsComponent(_authService, _globalStateServie) {
        var _this = this;
        this._authService = _authService;
        this._globalStateServie = _globalStateServie;
        this.subscriptions = [];
        this.package = undefined;
        this.subscriptions.push(this._authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg.integratons;
                if (!_this.package.allowed) {
                    _this._globalStateServie.NavigateTo('/noaccess');
                }
            }
        }));
        // this.subscriptions.push(_settingsService.getChattSettings().subscribe(chatSettings => {
        //   if (!chatSettings) {
        //     _settingsService.getChattSettingsFromBackend();
        //   }
        // }));
        // this.subscriptions.push(_settingsService.getSettingsChangedStatus().subscribe(status => {
        //   if (status) this.settingsChanged = status;
        // }));
    }
    IntegrationsComponent.prototype.ngOnInit = function () {
    };
    IntegrationsComponent.prototype.STOPPROPAGATION = function (event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        this._globalStateServie.setSettingsMenu(false);
    };
    IntegrationsComponent.prototype.ngOnDestroy = function () {
    };
    IntegrationsComponent = __decorate([
        core_1.Component({
            selector: 'app-integrations',
            templateUrl: './integrations.component.html',
            styleUrls: ['./integrations.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], IntegrationsComponent);
    return IntegrationsComponent;
}());
exports.IntegrationsComponent = IntegrationsComponent;
//# sourceMappingURL=integrations.component.js.map