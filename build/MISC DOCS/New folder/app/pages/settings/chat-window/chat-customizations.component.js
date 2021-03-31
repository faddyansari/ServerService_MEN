"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatCustomizationsComponent = void 0;
var core_1 = require("@angular/core");
var ChatCustomizationsComponent = /** @class */ (function () {
    function ChatCustomizationsComponent(_globalStateServie, _authService) {
        var _this = this;
        this._globalStateServie = _globalStateServie;
        this._authService = _authService;
        this.package = {};
        // this._globalStateServie.contentInfo.next('');
        // this._globalStateServie.breadCrumbTitle.next('Chat Window Customizations');
        _authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg;
            }
        });
    }
    ChatCustomizationsComponent.prototype.ngOnInit = function () {
    };
    ChatCustomizationsComponent.prototype.STOPPROPAGATION = function (event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        this._globalStateServie.setSettingsMenu(false);
    };
    ChatCustomizationsComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
    };
    ChatCustomizationsComponent = __decorate([
        core_1.Component({
            selector: 'app-chat-customizations',
            templateUrl: './chat-customizations.component.html',
            styleUrls: ['./chat-customizations.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ChatCustomizationsComponent);
    return ChatCustomizationsComponent;
}());
exports.ChatCustomizationsComponent = ChatCustomizationsComponent;
//# sourceMappingURL=chat-customizations.component.js.map