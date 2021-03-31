"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSettingsComponent = void 0;
var core_1 = require("@angular/core");
var ChatSettingsComponent = /** @class */ (function () {
    function ChatSettingsComponent(_globalStateServie, _authService) {
        var _this = this;
        this._globalStateServie = _globalStateServie;
        this._authService = _authService;
        this.subscriptions = [];
        this.settingsChanged = false;
        this.package = {};
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg;
            }
        }));
    }
    ChatSettingsComponent.prototype.ngOnInit = function () {
    };
    ChatSettingsComponent.prototype.STOPPROPAGATION = function (event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        this._globalStateServie.setSettingsMenu(false);
    };
    ChatSettingsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    ChatSettingsComponent.prototype.setActiveTab = function (state) {
        this.activeTab = state;
    };
    __decorate([
        core_1.Input()
    ], ChatSettingsComponent.prototype, "activeTab", void 0);
    ChatSettingsComponent = __decorate([
        core_1.Component({
            selector: 'app-chat-settings',
            templateUrl: './chat-settings.component.html',
            styleUrls: ['./chat-settings.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ChatSettingsComponent);
    return ChatSettingsComponent;
}());
exports.ChatSettingsComponent = ChatSettingsComponent;
//# sourceMappingURL=chat-settings.component.js.map