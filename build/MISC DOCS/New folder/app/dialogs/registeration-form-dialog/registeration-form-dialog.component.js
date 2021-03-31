"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterationFormDialogComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var Observable_1 = require("rxjs/Observable");
var RegisterationFormDialogComponent = /** @class */ (function () {
    function RegisterationFormDialogComponent(http, _routeService, _router, formbuilder, _authService, _validationService, snackBar, dialogRef) {
        var _this = this;
        this.http = http;
        this._routeService = _routeService;
        this._router = _router;
        this.formbuilder = formbuilder;
        this._authService = _authService;
        this._validationService = _validationService;
        this.snackBar = snackBar;
        this.dialogRef = dialogRef;
        this.disable = false;
        this.working = false;
        this.subscriptions = [];
        this.emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.NumbersOnlyPatter = /^[0-9\-]+$/;
        this.subscriptions.push(this._authService.RestServiceURL.subscribe(function (serverAddress) {
            _this.server = serverAddress;
        }));
        this.subscriptions.push(this._authService.getRequestState().subscribe(function (data) {
            _this.loading = data;
        }));
        this.regForm = formbuilder.group({
            'full_name': [null, forms_1.Validators.required],
            'username': [null, forms_1.Validators.required],
            'email': [null,
                [
                    forms_1.Validators.required,
                    forms_1.Validators.pattern(this.emailPattern)
                ],
                this._validationService.isEmailUnique.bind(this)
            ],
            'password': [null,
                [
                    forms_1.Validators.required,
                    forms_1.Validators.minLength(8)
                ],
                this.isConfirmPassword.bind(this)
            ],
            'pswd_again': [null,
                [
                    forms_1.Validators.required,
                    forms_1.Validators.minLength(8)
                ],
                this.isConfirmPasswordAgain.bind(this)
            ],
            'website': [null,
                [
                    forms_1.Validators.required,
                    //Regex Changed For Engro
                    forms_1.Validators.pattern(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?|((http|https):\/\/[a-zA-Z0-9\S]*|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?$/gmi)
                    // Validators.pattern(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i)
                ],
                this._validationService.isWebsiteUnique.bind(this)
            ],
            'company_size': [''],
            'company_type': [''],
            'country_name': [null, forms_1.Validators.required],
            'phone_no': ['',
                [
                    forms_1.Validators.pattern(/^[0-9\-]+$/)
                ]
            ],
        });
    }
    RegisterationFormDialogComponent.prototype.ngOnInit = function () {
    };
    RegisterationFormDialogComponent.prototype.ngAfterViewInit = function () {
    };
    RegisterationFormDialogComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    //checks if password is confirmed
    RegisterationFormDialogComponent.prototype.isConfirmPassword = function (control) {
        var confirmPassword = this.regForm.get('pswd_again');
        if (control.value != confirmPassword.value) {
            confirmPassword.setErrors({ 'noMatch': true });
        }
        if (control.value == confirmPassword.value) {
            confirmPassword.updateValueAndValidity();
        }
        return Observable_1.Observable.of(null);
    };
    //confirm password validation
    RegisterationFormDialogComponent.prototype.isConfirmPasswordAgain = function (control) {
        var password = this.regForm.get('password');
        if (password.value != control.value) {
            return Observable_1.Observable.of({ 'noMatch': true });
        }
        else {
            return Observable_1.Observable.of(null);
        }
    };
    RegisterationFormDialogComponent.prototype.submitForm = function (form) {
        var _this = this;
        if (this.regForm.valid) {
            this._authService.setRequestState(true);
            var urlFormat = this.regForm.get('website').value.replace(/(www\.)?/ig, '');
            this.subscriptions.push(this.http.post(this.server + "/register/company/", {
                companyprofile: {
                    email: this.regForm.get('email').value,
                    username: this.regForm.get('username').value,
                    full_name: this.regForm.get('full_name').value,
                    password: this.regForm.get('password').value,
                    country: this.regForm.get('country_name').value,
                    phone_no: this.regForm.get('phone_no').value,
                    company_info: {
                        company_size: this.regForm.get('company_size').value,
                        company_type: this.regForm.get('company_type').value,
                        company_website: urlFormat
                    }
                }
            }, { withCredentials: true }).subscribe(function (response) {
                _this._authService.setRequestState(false);
                _this.dialogRef.close({ error: null, msg: "Successfull" });
            }, function (err) {
                if (err.status == 403) {
                    _this._authService.setRequestState(false);
                    _this.snackBar.open("Company Already Registered", null, {
                        duration: 3000,
                        panelClass: ['user-alert', 'error']
                    });
                    _this._websiteElemRef.nativeElement.focus();
                    _this.regForm.get('website').valid == false;
                }
            }));
        }
    };
    __decorate([
        core_1.ViewChild("website")
    ], RegisterationFormDialogComponent.prototype, "_websiteElemRef", void 0);
    RegisterationFormDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-registeration-form-dialog',
            templateUrl: './registeration-form-dialog.component.html',
            styleUrls: ['./registeration-form-dialog.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], RegisterationFormDialogComponent);
    return RegisterationFormDialogComponent;
}());
exports.RegisterationFormDialogComponent = RegisterationFormDialogComponent;
//# sourceMappingURL=registeration-form-dialog.component.js.map