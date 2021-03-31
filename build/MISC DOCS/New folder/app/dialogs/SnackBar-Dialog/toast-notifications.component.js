"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToastNotifications = void 0;
var core_1 = require("@angular/core");
var snack_bar_1 = require("@angular/material/snack-bar");
var ToastNotifications = /** @class */ (function () {
    function ToastNotifications(data) {
        this.data = data;
        this.icon = '';
        this.msg = '';
        this.img = '';
        this.icon = data.icon;
        this.msg = data.msg;
        if (data.img)
            this.img = data.img;
    }
    ToastNotifications = __decorate([
        core_1.Component({
            selector: 'app-toast-notifications',
            templateUrl: './toast-notifications.component.html',
            styleUrls: ['./toast-notifications.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(0, core_1.Inject(snack_bar_1.MAT_SNACK_BAR_DATA))
    ], ToastNotifications);
    return ToastNotifications;
}());
exports.ToastNotifications = ToastNotifications;
//# sourceMappingURL=toast-notifications.component.js.map