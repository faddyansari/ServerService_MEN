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
exports.AddFaqDialogComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var WidgetMarketing_1 = require("../../../services/LocalServices/WidgetMarketing");
var toast_notifications_component_1 = require("../SnackBar-Dialog/toast-notifications.component");
var AddFaqDialogComponent = /** @class */ (function () {
    function AddFaqDialogComponent(data, _WMService, dialogRef, snackBar) {
        this.data = data;
        this._WMService = _WMService;
        this.dialogRef = dialogRef;
        this.snackBar = snackBar;
        this.question = '';
        this.answer = '';
        this.loading = false;
        (data.question) ? this.question = data.question : '';
    }
    AddFaqDialogComponent.prototype.ngOnInit = function () {
    };
    AddFaqDialogComponent.prototype.addFaq = function () {
        var _this = this;
        this.loading = true;
        this._WMService.AddMessageAsFaq({ question: this.question, answer: this.answer }).subscribe(function (response) {
            _this.loading = false;
            if (response == 'ok') {
                _this.dialogRef.close();
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'FAQ added successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else if (response == 'already-exists') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'FAQ already exists!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
            }
            else if (response == 'error') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Error!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
            }
        });
    };
    AddFaqDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-add-faq-dialog',
            templateUrl: './add-faq-dialog.component.html',
            styleUrls: ['./add-faq-dialog.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: [
                WidgetMarketing_1.WidgetMarketingService
            ]
        }),
        __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], AddFaqDialogComponent);
    return AddFaqDialogComponent;
}());
exports.AddFaqDialogComponent = AddFaqDialogComponent;
//# sourceMappingURL=add-faq-dialog.component.js.map