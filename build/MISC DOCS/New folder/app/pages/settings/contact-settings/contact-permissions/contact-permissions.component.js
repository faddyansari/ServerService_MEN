"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactPermissionsComponent = void 0;
var core_1 = require("@angular/core");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var ContactPermissionsComponent = /** @class */ (function () {
    function ContactPermissionsComponent(_settingsService, formbuilder, snackBar, _appStateService) {
        var _this = this;
        this._settingsService = _settingsService;
        this.formbuilder = formbuilder;
        this.snackBar = snackBar;
        this._appStateService = _appStateService;
        this.subscriptions = [];
        this.loading = false;
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Contact Settings');
        this.contactSettingsForm = formbuilder.group({});
        this.subscriptions.push(this._settingsService.contactSettings.subscribe(function (data) {
            //console.log(data);
            _this.contactSettings = data;
        }));
    }
    ContactPermissionsComponent.prototype.ngOnInit = function () {
    };
    ContactPermissionsComponent.prototype.SetPermissions = function (value) {
        switch (value) {
            case 'levelBased':
                this.contactSettings.permissions.levelBased = !this.contactSettings.permissions.levelBased;
                // console.log(this.contactSettings.permissions.levelBased);
                break;
        }
    };
    ContactPermissionsComponent.prototype.Submit = function () {
        var _this = this;
        // console.log(this.contactSettings);
        this.loading = true;
        this._settingsService
            .setNSPContactSettings('permissions', this.contactSettings.permissions)
            .subscribe(function (response) {
            _this.loading = false;
            if (response.status == 'ok') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Settings saved successfully!'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else if (response.status == 'error') {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Error!'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'error']
                });
            }
            //Do Some Error Logic If Any
            //Check Server Responses For this Event
        }, function (err) {
            //TO DO ERROR LOGIC
            _this.loading = false;
        });
    };
    ContactPermissionsComponent = __decorate([
        core_1.Component({
            selector: 'app-contact-permissions',
            templateUrl: './contact-permissions.component.html',
            styleUrls: ['./contact-permissions.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ContactPermissionsComponent);
    return ContactPermissionsComponent;
}());
exports.ContactPermissionsComponent = ContactPermissionsComponent;
//# sourceMappingURL=contact-permissions.component.js.map