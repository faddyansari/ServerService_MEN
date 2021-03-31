"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSharingComponent = void 0;
var core_1 = require("@angular/core");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var FileSharingComponent = /** @class */ (function () {
    function FileSharingComponent(_chatSettings, formbuilder, _appStateService, snackBar) {
        var _this = this;
        this._chatSettings = _chatSettings;
        this.formbuilder = formbuilder;
        this._appStateService = _appStateService;
        this.snackBar = snackBar;
        this.subscriptions = [];
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Chat & Timeout Settings');
        this.fileSharingSettingsForm = formbuilder.group({});
        this.subscriptions.push(_chatSettings.getChattSettings().subscribe(function (settings) {
            if (settings) {
                //console.log('chat settings',settings);
                _this.permissions = settings.permissions;
            }
        }));
        this.subscriptions.push(_chatSettings.getSavingStatus('permissions').subscribe(function (status) {
            _this.loading = status;
        }));
    }
    FileSharingComponent.prototype.ngOnInit = function () {
    };
    FileSharingComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    FileSharingComponent.prototype.SetPermission = function (value) {
        switch (value) {
            case 'forVisitors':
                this.permissions.forVisitors = !this.permissions.forVisitors;
                break;
            case 'forAgents':
                this.permissions.forAgents = !this.permissions.forAgents;
                break;
            case 'showRecentChats':
                this.permissions.showRecentChats = !this.permissions.showRecentChats;
                break;
            case 'chatAsGuest':
                this.permissions.chatAsGuest = !this.permissions.chatAsGuest;
                break;
            case 'invitationChatInitiations':
                this.permissions.invitationChatInitiations = !this.permissions.invitationChatInitiations;
                break;
        }
    };
    FileSharingComponent.prototype.Submit = function () {
        var _this = this;
        this._chatSettings
            .setNSPChatSettings(this.permissions, 'permissions')
            .subscribe(function (response) {
            if (response.status == "ok") {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Permissions updated Successfully!'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'success']
                });
            }
            //Do Some Error Logic If Any
            //Check Server Responses For this Event
        });
    };
    FileSharingComponent = __decorate([
        core_1.Component({
            selector: 'app-file-sharing',
            templateUrl: './file-sharing.component.html',
            styleUrls: ['./file-sharing.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], FileSharingComponent);
    return FileSharingComponent;
}());
exports.FileSharingComponent = FileSharingComponent;
//# sourceMappingURL=file-sharing.component.js.map