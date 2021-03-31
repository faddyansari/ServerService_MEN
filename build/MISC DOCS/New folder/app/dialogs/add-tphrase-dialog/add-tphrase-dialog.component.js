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
exports.AddTphraseDialogComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var WidgetMarketing_1 = require("../../../services/LocalServices/WidgetMarketing");
var toast_notifications_component_1 = require("../SnackBar-Dialog/toast-notifications.component");
var adminSettingsService_1 = require("../../../services/adminSettingsService");
var AddTphraseDialogComponent = /** @class */ (function () {
    function AddTphraseDialogComponent(data, BotService, dialogRef, snackBar) {
        var _this = this;
        this.data = data;
        this.BotService = BotService;
        this.dialogRef = dialogRef;
        this.snackBar = snackBar;
        this.tPhrase = '';
        this.intents = '';
        this.loading = false;
        this.intent_list = [];
        this.subscriptions = [];
        (data.tPhrase) ? this.tPhrase = data.tPhrase : '';
        this.subscriptions.push(BotService.getIntent().subscribe(function (data) {
            _this.intent_list = data;
        }));
    }
    AddTphraseDialogComponent.prototype.ngOnInit = function () {
    };
    AddTphraseDialogComponent.prototype.addTPhrase = function () {
        var _this = this;
        this.loading = true;
        this.BotService.AddMessageAsTPhrase({ tPhrase: this.tPhrase, intents: this.intents }).subscribe(function (response) {
            _this.loading = false;
            if (response == 'ok') {
                _this.dialogRef.close();
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Training Phrase added successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else if (response == 'already-exists') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Training Phrase already exists!'
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
    AddTphraseDialogComponent.prototype.selectIntent = function (event) {
        if (event.target.value) {
            this.intents = event.target.value;
        }
    };
    AddTphraseDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-add-tphrase-dialog',
            templateUrl: './add-tphrase-dialog.component.html',
            styleUrls: ['./add-tphrase-dialog.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: [
                WidgetMarketing_1.WidgetMarketingService,
                adminSettingsService_1.AdminSettingsService
            ]
        }),
        __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], AddTphraseDialogComponent);
    return AddTphraseDialogComponent;
}());
exports.AddTphraseDialogComponent = AddTphraseDialogComponent;
//# sourceMappingURL=add-tphrase-dialog.component.js.map