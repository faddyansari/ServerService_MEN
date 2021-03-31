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
exports.VisitorBanTimeComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var VisitorBanTimeComponent = /** @class */ (function () {
    function VisitorBanTimeComponent(data, _chatService, dialogRef, snackBar) {
        this.data = data;
        this._chatService = _chatService;
        this.dialogRef = dialogRef;
        this.snackBar = snackBar;
        this.hours = '';
        this.loading = false;
        this.invalidHours = false;
        this.shiftdown = false;
        this.numberRangeRegex = /^\d+$/;
        this.sessionid = '';
        this.deviceID = '';
        (data.sessionid) ? this.sessionid = data.sessionid : '';
        (data.deviceID) ? this.deviceID = data.deviceID : '';
        //console.log(data);
    }
    VisitorBanTimeComponent.prototype.ngOnInit = function () {
    };
    VisitorBanTimeComponent.prototype.BanChat = function () {
        if (this.numberRangeRegex.test(this.hours)) {
            this.invalidHours = false;
            this.dialogRef.close({ hours: this.hours });
        }
        else
            this.invalidHours = true;
    };
    VisitorBanTimeComponent = __decorate([
        core_1.Component({
            selector: 'app-visitor-ban-time',
            templateUrl: './visitor-ban-time.component.html',
            styleUrls: ['./visitor-ban-time.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], VisitorBanTimeComponent);
    return VisitorBanTimeComponent;
}());
exports.VisitorBanTimeComponent = VisitorBanTimeComponent;
//# sourceMappingURL=visitor-ban-time.component.js.map