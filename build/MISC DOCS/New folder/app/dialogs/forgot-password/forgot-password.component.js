"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var ForgotPasswordComponent = /** @class */ (function () {
    function ForgotPasswordComponent(http, formbuilder, dialogRef, snackBar, _authService) {
        var _this = this;
        this.http = http;
        this.formbuilder = formbuilder;
        this.dialogRef = dialogRef;
        this.snackBar = snackBar;
        this._authService = _authService;
        this.subscriptions = [];
        this.forgot_email = '';
        this.disable = false;
        this.errorMsg = '';
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.forgotpswdForm = formbuilder.group({
            'email': [
                null,
                [
                    forms_1.Validators.required,
                    forms_1.Validators.pattern(this.emailPattern)
                ]
            ]
        });
        this.subscriptions.push(this._authService.getServer().subscribe(function (serverAddress) {
            _this.server = serverAddress;
        }));
    }
    ForgotPasswordComponent.prototype.ngOnInit = function () {
    };
    ForgotPasswordComponent.prototype.SubmitForgotPassword = function () {
        var _this = this;
        //console.log(this.forgot_email);
        //console.log("in submit forget password");
        if (this.forgotpswdForm.valid) {
            //Check if forgot password feature is enabled
            this._authService.isForgotPasswordEnabled(this.forgot_email).subscribe(function (enabled) {
                if (enabled) {
                    _this.subscriptions.push(_this.http.post(_this.server + "/agent/resetpswd/", {
                        email: _this.forgot_email
                    }, { withCredentials: true }).subscribe(function (response) {
                        _this._authService.setRequestState(false);
                        _this.dialogRef.close({ error: null, msg: "Successfull" });
                    }, function (err) {
                        console.log(err.status);
                        if (err.status == 403) {
                            _this._authService.setRequestState(false);
                            _this.snackBar.open("Invalid Email", null, {
                                duration: 3000,
                                panelClass: ['user-alert', 'error']
                            });
                        }
                    }));
                }
                else {
                    // alert()
                    _this.showErrorMessage('Forgot password feature has been disabled.');
                }
            });
        }
    };
    ForgotPasswordComponent.prototype.changeOccured = function (val) {
    };
    ForgotPasswordComponent.prototype.showErrorMessage = function (msg) {
        var _this = this;
        this.errorMsg = msg;
        setTimeout(function () {
            _this.errorMsg = '';
        }, 3000);
    };
    ForgotPasswordComponent = __decorate([
        core_1.Component({
            selector: 'app-forgot-password',
            templateUrl: './forgot-password.component.html',
            styleUrls: ['./forgot-password.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ForgotPasswordComponent);
    return ForgotPasswordComponent;
}());
exports.ForgotPasswordComponent = ForgotPasswordComponent;
//# sourceMappingURL=forgot-password.component.js.map