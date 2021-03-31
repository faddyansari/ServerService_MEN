"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSettingsTimeoutsComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var ChatSettingsTimeoutsComponent = /** @class */ (function () {
    function ChatSettingsTimeoutsComponent(_chatSettings, formBuilder, snackBar, _appStateService) {
        var _this = this;
        this._chatSettings = _chatSettings;
        this.formBuilder = formBuilder;
        this.snackBar = snackBar;
        this._appStateService = _appStateService;
        this.subscriptions = [];
        this.changed = false;
        this.loadingSettings = false;
        this.invalideTimeoutSetting = false;
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Chat & Timeout Settings');
        this.subscriptions.push(_chatSettings.getChattSettings().subscribe(function (settings) {
            //console.log('chat settings', settings);
            if (settings) {
                _this.chatTimeoutSettings = settings.inactivityTimeouts;
                _this.chatTimeoutSettingsForm = formBuilder.group({
                    'transferIn': [
                        (_this.chatTimeoutSettings) ? _this.chatTimeoutSettings.transferIn : '',
                        [
                            forms_1.Validators.pattern(/^[0-9\-]+$/),
                            _this.inputValidator
                        ]
                    ],
                    'inactiveTimeout': [
                        (_this.chatTimeoutSettings) ? _this.chatTimeoutSettings.inactiveTimeout : '',
                        [
                            forms_1.Validators.pattern(/^[0-9\-]+$/),
                            _this.inputValidator
                        ]
                    ],
                    'endSessionTimeout': [
                        (_this.chatTimeoutSettings) ? _this.chatTimeoutSettings.endSessionTimeout || _this.chatTimeoutSettings.endchatTimeout : '',
                        [
                            forms_1.Validators.pattern(/^[0-9\-]+$/),
                            _this.inputValidator
                        ]
                    ]
                });
                _this.loadingSettings = true;
            }
        }));
        this.subscriptions.push(_chatSettings.getSavingStatus('inactivityTimeouts').subscribe(function (status) {
            _this.loading = status;
        }));
    }
    ChatSettingsTimeoutsComponent.prototype.ngOnInit = function () {
    };
    ChatSettingsTimeoutsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    ChatSettingsTimeoutsComponent.prototype.Submit = function (value) {
        var _this = this;
        this.invalideTimeoutSetting = false;
        if (value.transferIn >= value.inactiveTimeout) {
            this.invalideTimeoutSetting = true;
            return;
        }
        if (this.chatTimeoutSettingsForm.invalid) {
            return;
        }
        this._chatSettings.setNSPChatSettings({
            transferIn: value.transferIn,
            inactiveTimeout: value.inactiveTimeout,
            endSessionTimeout: value.endSessionTimeout
        }, 'inactivityTimeouts').subscribe(function (response) {
            if (response.status == 'error') {
                if (response.code == '403') {
                    response.reason.map(function (reason) {
                        if (reason == 'invalidTransferInTime')
                            _this.chatTimeoutSettingsForm.get('transferIn').setErrors({ invalidInput: true });
                        if (reason == 'invalidInactiveTimeoutTime')
                            _this.chatTimeoutSettingsForm.get('inactiveTimeout').setErrors({ invalidInput: true });
                        if (reason == 'invalidEndSessionTimeout')
                            _this.chatTimeoutSettingsForm.get('endSessionTimeout').setErrors({ invalidInput: true });
                    });
                    _this.chatTimeoutSettingsForm.setErrors({ invalid: true });
                }
            }
            else {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Timeout Settings updated Successfully!'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    };
    ChatSettingsTimeoutsComponent.prototype.inputValidator = function (control) {
        // if (control.value < 1 && control.value != -1) return { invalidInput: true }
        if (control.value <= 0 || control.value > 60)
            return { invalidInput: true };
        else
            return null;
    };
    ChatSettingsTimeoutsComponent = __decorate([
        core_1.Component({
            selector: 'app-chat-settings-timeouts',
            templateUrl: './chat-settings-timeouts.component.html',
            styleUrls: ['./chat-settings-timeouts.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ChatSettingsTimeoutsComponent);
    return ChatSettingsTimeoutsComponent;
}());
exports.ChatSettingsTimeoutsComponent = ChatSettingsTimeoutsComponent;
//# sourceMappingURL=chat-settings-timeouts.component.js.map