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
exports.ChangePasswordDialogComponent = void 0;
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var forms_1 = require("@angular/forms");
var dialog_1 = require("@angular/material/dialog");
var ChangePasswordDialogComponent = /** @class */ (function () {
    function ChangePasswordDialogComponent(data, formbuilder, _agentService, dialogRef) {
        this.data = data;
        this.formbuilder = formbuilder;
        this._agentService = _agentService;
        this.dialogRef = dialogRef;
        this.subscriptions = [];
        this.fieldCount = 3;
        this.fieldCount = data.fieldCount;
        this.email = data.email;
        // console.log(this.fieldCount);
        if (data.fieldCount == 2) {
            this.changePasswordForm = formbuilder.group({
                'newPassword': ['', [
                        forms_1.Validators.required,
                        forms_1.Validators.minLength(8)
                    ]],
                'confirmPassword': ['', [
                        forms_1.Validators.required
                    ], this.matchPasswords.bind(this)]
            });
        }
        else {
            this.changePasswordForm = formbuilder.group({
                'oldPassword': ['', [
                        forms_1.Validators.required
                    ], this.validateCurrentPassword.bind(this)],
                'newPassword': ['', [
                        forms_1.Validators.required,
                        forms_1.Validators.minLength(8)
                    ]],
                'confirmPassword': ['', [
                        forms_1.Validators.required
                    ], this.matchPasswords.bind(this)]
            });
        }
    }
    ChangePasswordDialogComponent.prototype.ngOnInit = function () {
    };
    ChangePasswordDialogComponent.prototype.Submit = function () {
        var _this = this;
        this._agentService.changePassword(this.email, this.changePasswordForm.get('newPassword').value).subscribe(function (status) {
            _this.dialogRef.close({
                status: (status) ? 'success' : 'error'
            });
        });
    };
    ChangePasswordDialogComponent.prototype.validateCurrentPassword = function (control) {
        var _this = this;
        return Observable_1.Observable.timer(2000).switchMap(function () {
            return _this._agentService.ValidatePassword(_this.email, control.value).map(function (res) {
                return res ? null : { incorrect: true };
            });
        });
    };
    ChangePasswordDialogComponent.prototype.matchPasswords = function (control) {
        var _this = this;
        return Observable_1.Observable.timer(2000).switchMap(function () {
            if (control.value !== _this.changePasswordForm.get('newPassword').value) {
                return Observable_1.Observable.of({ incorrect: true, same: false });
            }
            else if (_this.changePasswordForm.get('oldPassword') && control.value == _this.changePasswordForm.get('oldPassword').value) {
                return Observable_1.Observable.of({ incorrect: false, same: true });
            }
            else {
                return Observable_1.Observable.of(null);
            }
        });
    };
    ChangePasswordDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-change-password-dialog',
            templateUrl: './change-password-dialog.component.html',
            styleUrls: ['./change-password-dialog.component.scss']
        }),
        __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], ChangePasswordDialogComponent);
    return ChangePasswordDialogComponent;
}());
exports.ChangePasswordDialogComponent = ChangePasswordDialogComponent;
//# sourceMappingURL=change-password-dialog.component.js.map