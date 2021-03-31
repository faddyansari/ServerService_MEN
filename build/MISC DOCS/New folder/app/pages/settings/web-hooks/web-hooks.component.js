"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebHooksComponent = void 0;
var core_1 = require("@angular/core");
var WebHooksComponent = /** @class */ (function () {
    function WebHooksComponent(_globalStateServie, _authService) {
        var _this = this;
        this._globalStateServie = _globalStateServie;
        this._authService = _authService;
        this.subscription = [];
        this.package = undefined;
        this.subscription.push(this._authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg.integratons;
            }
        }));
    }
    WebHooksComponent.prototype.ngOnInit = function () {
    };
    WebHooksComponent.prototype.STOPPROPAGATION = function (event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        this._globalStateServie.setSettingsMenu(false);
    };
    __decorate([
        core_1.Input()
    ], WebHooksComponent.prototype, "activeTab", void 0);
    WebHooksComponent = __decorate([
        core_1.Component({
            selector: 'app-web-hooks',
            templateUrl: './web-hooks.component.html',
            styleUrls: ['./web-hooks.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], WebHooksComponent);
    return WebHooksComponent;
}());
exports.WebHooksComponent = WebHooksComponent;
//# sourceMappingURL=web-hooks.component.js.map