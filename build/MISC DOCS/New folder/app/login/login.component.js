"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginComponent = void 0;
var core_1 = require("@angular/core");
var registeration_form_dialog_component_1 = require("../dialogs/registeration-form-dialog/registeration-form-dialog.component");
var forgot_password_component_1 = require("../dialogs/forgot-password/forgot-password.component");
var toast_notifications_component_1 = require("../dialogs/SnackBar-Dialog/toast-notifications.component");
var forms_1 = require("@angular/forms");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(_routeService, _authService, dialog, snackBar, formbuilder) {
        var _this = this;
        this._routeService = _routeService;
        this._authService = _authService;
        this.dialog = dialog;
        this.snackBar = snackBar;
        this.formbuilder = formbuilder;
        this.subscriptions = [];
        this.showPassword = false;
        this.loading = false;
        this.loadingAccessCode = false;
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.copyRightYear = '';
        this.authCode = false;
        this.aCode = '';
        this.incorrect = false;
        this.tempEmail = '';
        //Reactive Form Validation
        this.accessForm = formbuilder.group({
            'email': [null,
                [
                    forms_1.Validators.pattern(this.emailPattern),
                    forms_1.Validators.required
                ]
            ],
            'password': [null, forms_1.Validators.required]
        });
        //Request State Boolean To Show Loading Ring
        //On Each Request to Server Request State is Enabled in DataService
        //Note : When Response Finished Call setRequestState(false) in DataService.
        //For this Component _authService is Data Service
        this.subscriptions.push(_authService.getRequestState().subscribe(function (data) {
            _this.loading = data;
            _this.loadingAccessCode = data;
            // console.log('After Subscription Loading');
            // console.log(this.loading);
        }));
        this.subscriptions.push(_routeService.getCopyrightYear().subscribe(function (copyRightYear) {
            _this.copyRightYear = copyRightYear;
        }));
        //To Show Notifications For This Component Data Service is Responsible For Pushing Data
        this.subscriptions.push(_authService.getNotification().subscribe(function (data) {
            _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: data.img,
                    msg: data.msg
                },
                duration: 30000,
                panelClass: ['user-alert', (data.type == 'success') ? 'ok' : 'error']
            });
            // .afterDismissed()
            // .subscribe(() => {
            //     _authService.setNotification('');
            // });
        }));
        this.subscriptions.push(_authService.showAuthCode.subscribe(function (data) {
            _this.authCode = data;
        }));
    }
    LoginComponent.prototype.ngOnInit = function () {
    };
    LoginComponent.prototype.ngAfterViewInit = function () {
    };
    LoginComponent.prototype.ngOnDestroy = function () {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    LoginComponent.prototype.loadRegisterForm = function () {
        var _this = this;
        this.subscriptions.push(this.dialog.open(registeration_form_dialog_component_1.RegisterationFormDialogComponent, {
            panelClass: ['register-form-dialog'],
            disableClose: true,
            autoFocus: true,
        }).afterClosed().subscribe(function (data) {
            //console.log('Register Form Dialog Closed');
            if (data.error == null) {
                _this._authService.setNotification('Welcome To BizzChats', 'success', 'ok');
            }
            else {
            }
        }));
    };
    LoginComponent.prototype.Login = function (form) {
        var _this = this;
        // console.log('Logging')
        this.loading = true;
        if (form.valid) {
            this._authService.incorrect = false;
            setTimeout(function () {
                _this.tempEmail = form.get('email').value;
                _this._authService.login(form.get('email').value, form.get('password').value);
            }, 1000);
        }
    };
    LoginComponent.prototype.SubmitAccessCode = function () {
        var _this = this;
        this.loadingAccessCode = true;
        setTimeout(function () {
            if (_this.aCode) {
                _this._authService.incorrect = false;
                _this._authService.SubmitAccessCode(_this.aCode.trim());
            }
        }, 1000);
    };
    LoginComponent.prototype.forgotPassword = function () {
        var _this = this;
        this.dialog.open(forgot_password_component_1.ForgotPasswordComponent, {
            panelClass: ['forgot-password-dialog'],
            disableClose: true,
            autoFocus: true,
        }).afterClosed().subscribe(function (data) {
            if (data.error == null) {
                _this._authService.setNotification('Your Password Reset Link Has Been Sent To Your Email Successfully', 'success', 'ok');
            }
            else {
            }
        });
    };
    LoginComponent.prototype.ShowPassword = function () {
        this.showPassword = !(this.showPassword);
        //  console.log(this.showPassword);
    };
    LoginComponent.prototype.GoBack = function () {
        this._authService.showAuthCode.next(false);
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map