"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertBarComponent = void 0;
var core_1 = require("@angular/core");
var AlertBarComponent = /** @class */ (function () {
    function AlertBarComponent(routeService, _socketService, _chatService, dialog, _callingService, _authService) {
        var _this = this;
        this.routeService = routeService;
        this._socketService = _socketService;
        this._chatService = _chatService;
        this.dialog = dialog;
        this._callingService = _callingService;
        this._authService = _authService;
        this.subscriptions = [];
        this.verified = true;
        this.subscriptions.push(this._authService.getSettings().subscribe(function (settings) {
            if (settings)
                _this.verified = settings.verified;
        }));
    }
    AlertBarComponent.prototype.ngOnInit = function () {
    };
    AlertBarComponent = __decorate([
        core_1.Component({
            selector: 'app-alert-bar',
            templateUrl: './alert-bar.component.html',
            styleUrls: ['./alert-bar.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AlertBarComponent);
    return AlertBarComponent;
}());
exports.AlertBarComponent = AlertBarComponent;
//# sourceMappingURL=alert-bar.component.js.map