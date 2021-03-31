"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreetingMessageComponent = void 0;
var core_1 = require("@angular/core");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var GreetingMessageComponent = /** @class */ (function () {
    function GreetingMessageComponent(_chatSettings, formBuilder, snackBar, _appStateService, _authService) {
        var _this = this;
        this._chatSettings = _chatSettings;
        this.formBuilder = formBuilder;
        this.snackBar = snackBar;
        this._appStateService = _appStateService;
        this._authService = _authService;
        this.subscriptions = [];
        this.greetingMessage = '';
        this.botGreetingMessage = '';
        this.package = {};
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Chat & Timeout Settings');
        this.subscriptions.push(this._chatSettings.getChattSettings().subscribe(function (settings) {
            // console.log('chat settings', settings);
            if (settings) {
                _this.settings = settings;
                _this.greetingMessage = settings.greetingMessage;
                _this.greetingMessageForm = formBuilder.group({
                    'greetingMessage': [
                        _this.greetingMessage,
                        []
                    ]
                });
                _this.botGreetingMessage = settings.botGreetingMessage;
                _this.botGreetingMessageForm = formBuilder.group({
                    'botGreetingMessage': [
                        _this.botGreetingMessage,
                        []
                    ]
                });
            }
        }));
        this.subscriptions.push(this._chatSettings.getSavingStatus('greetingMessage').subscribe(function (status) {
            _this.loading = status;
        }));
        this.subscriptions.push(this._chatSettings.getSavingStatus('botGreetingMessage').subscribe(function (status) {
            _this.loadingBot = status;
        }));
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg;
            }
        }));
    }
    GreetingMessageComponent.prototype.ngOnInit = function () {
    };
    GreetingMessageComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    GreetingMessageComponent.prototype.Submit = function () {
        var _this = this;
        this._chatSettings.setNSPChatSettings(this.greetingMessageForm.get('greetingMessage').value, 'greetingMessage')
            .subscribe(function (response) {
            console.log(response);
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Greeting Message updated Successfully!'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    };
    GreetingMessageComponent.prototype.SubmitBot = function () {
        var _this = this;
        this._chatSettings.setNSPChatSettings(this.botGreetingMessageForm.get('botGreetingMessage').value, 'botGreetingMessage')
            .subscribe(function (response) {
            console.log(response);
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Bot Greeting Message updated Successfully!'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'success']
                });
            }
        });
    };
    GreetingMessageComponent = __decorate([
        core_1.Component({
            selector: 'app-greeting-message',
            templateUrl: './greeting-message.component.html',
            styleUrls: ['./greeting-message.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], GreetingMessageComponent);
    return GreetingMessageComponent;
}());
exports.GreetingMessageComponent = GreetingMessageComponent;
//# sourceMappingURL=greeting-message.component.js.map