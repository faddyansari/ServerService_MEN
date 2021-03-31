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
exports.ConfirmationDialogComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var ConfirmationDialogComponent = /** @class */ (function () {
    function ConfirmationDialogComponent(headerData) {
        this.headerData = headerData;
        this.msg = '';
        (headerData.headermsg) ? this.msg = headerData.headermsg : 'Confirmation';
    }
    ConfirmationDialogComponent.prototype.ngOnInit = function () {
    };
    ConfirmationDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-confirmation-dialog',
            templateUrl: './confirmation-dialog.component.html',
            styleUrls: ['./confirmation-dialog.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], ConfirmationDialogComponent);
    return ConfirmationDialogComponent;
}());
exports.ConfirmationDialogComponent = ConfirmationDialogComponent;
//# sourceMappingURL=confirmation-dialog.component.js.map