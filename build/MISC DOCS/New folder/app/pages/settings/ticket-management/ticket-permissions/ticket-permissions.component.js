"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketPermissionsComponent = void 0;
var core_1 = require("@angular/core");
var toast_notifications_component_1 = require("../../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var TicketPermissionsComponent = /** @class */ (function () {
    function TicketPermissionsComponent(_settingsService, formbuilder, snackBar, _appStateService) {
        var _this = this;
        this._settingsService = _settingsService;
        this.formbuilder = formbuilder;
        this.snackBar = snackBar;
        this._appStateService = _appStateService;
        this.subscriptions = [];
        this.loading = false;
        this.hours = '';
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Ticket Management');
        this.ticketSettingsForm = formbuilder.group({});
        this.subscriptions.push(this._settingsService.ticketSettings.subscribe(function (data) {
            //console.log(data);
            if (!data)
                _this._settingsService.GetTicketSettings();
            else
                _this.ticketSettings = data;
        }));
    }
    TicketPermissionsComponent.prototype.SetPermissions = function (value) {
        switch (value) {
            case 'allowedAgentAvailable':
                this.ticketSettings.allowedAgentAvailable = !this.ticketSettings.allowedAgentAvailable;
                break;
            case 'allowAssignment':
                this.ticketSettings.allowAssignment = !this.ticketSettings.allowAssignment;
                break;
        }
    };
    TicketPermissionsComponent.prototype.ngOnInit = function () {
    };
    TicketPermissionsComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
    };
    TicketPermissionsComponent.prototype.Submit = function () {
        var _this = this;
        //console.log(this.hours);
        this.loading = true;
        this._settingsService
            .SetTicketSettings(this.ticketSettings)
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
    TicketPermissionsComponent = __decorate([
        core_1.Component({
            selector: 'app-ticket-permissions',
            templateUrl: './ticket-permissions.component.html',
            styleUrls: ['./ticket-permissions.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], TicketPermissionsComponent);
    return TicketPermissionsComponent;
}());
exports.TicketPermissionsComponent = TicketPermissionsComponent;
//# sourceMappingURL=ticket-permissions.component.js.map