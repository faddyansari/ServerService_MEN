"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsComponent = void 0;
var core_1 = require("@angular/core");
var toast_notifications_component_1 = require("../../dialogs/SnackBar-Dialog/toast-notifications.component");
var TicketsComponent = /** @class */ (function () {
    function TicketsComponent(_ticketService, _authService, snackBar, dialog) {
        var _this = this;
        this._ticketService = _ticketService;
        this._authService = _authService;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this.subscriptions = [];
        this.viewState = 'OPEN';
        this.schema = undefined;
        this.subscriptions.push(_ticketService.getSelectedThread().subscribe(function (selectedThread) {
            if (selectedThread && Object.keys(selectedThread).length) {
                if (!selectedThread.dynamicFields)
                    selectedThread.dynamicFields = {};
                _this.selectedThread = selectedThread;
                // console.log(this.selectedThread);
            }
        }));
        this.subscriptions.push(this._authService.getSettings().subscribe(function (settings) {
            if (settings)
                _this.verified = settings.verified;
            if (settings)
                _this.schema = settings.schemas.ticket.fields;
        }));
        this.subscriptions.push(_ticketService.getNotification().subscribe(function (notification) {
            if (notification) {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: notification.img,
                        msg: notification.msg
                    },
                    duration: 3000,
                    panelClass: ['user-alert', (notification.type == 'success') ? 'success' : 'error']
                }).afterDismissed().subscribe(function () {
                    _ticketService.clearNotification();
                });
            }
        }));
    }
    TicketsComponent.prototype.ngOnInit = function () {
    };
    TicketsComponent.prototype.ngAfterViewInit = function () {
    };
    TicketsComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        // this._appStateSerive.displayChatBar(true);
    };
    TicketsComponent.prototype.ngAfterViewChecked = function () {
    };
    __decorate([
        core_1.Input()
    ], TicketsComponent.prototype, "verified", void 0);
    TicketsComponent = __decorate([
        core_1.Component({
            selector: 'app-tickets',
            templateUrl: './tickets.component.html',
            styleUrls: ['./tickets.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], TicketsComponent);
    return TicketsComponent;
}());
exports.TicketsComponent = TicketsComponent;
//# sourceMappingURL=tickets.component.js.map