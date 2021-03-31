"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetMarketingComponent = void 0;
var core_1 = require("@angular/core");
var WidgetMarketingComponent = /** @class */ (function () {
    function WidgetMarketingComponent(_globalStateServie) {
        this._globalStateServie = _globalStateServie;
    }
    WidgetMarketingComponent.prototype.ngOnInit = function () {
    };
    WidgetMarketingComponent.prototype.STOPPROPAGATION = function (event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        this._globalStateServie.setSettingsMenu(false);
    };
    __decorate([
        core_1.Input()
    ], WidgetMarketingComponent.prototype, "activeTab", void 0);
    WidgetMarketingComponent = __decorate([
        core_1.Component({
            selector: 'app-widget-marketing',
            templateUrl: './widget-marketing.component.html',
            styleUrls: ['./widget-marketing.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], WidgetMarketingComponent);
    return WidgetMarketingComponent;
}());
exports.WidgetMarketingComponent = WidgetMarketingComponent;
//# sourceMappingURL=widget-marketing.component.js.map