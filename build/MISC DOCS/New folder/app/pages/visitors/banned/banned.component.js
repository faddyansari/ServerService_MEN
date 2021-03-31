"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannedComponent = void 0;
var core_1 = require("@angular/core");
var toast_notifications_component_1 = require("../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var confirmation_dialog_component_1 = require("../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var BannedComponent = /** @class */ (function () {
    function BannedComponent(_visitorService, snackBar, _chatService, _authService, _applicationStateService, dialog) {
        var _this = this;
        this._visitorService = _visitorService;
        this.snackBar = snackBar;
        this._chatService = _chatService;
        this._authService = _authService;
        this._applicationStateService = _applicationStateService;
        this.dialog = dialog;
        this.BannedvisitorList = [];
        this.subscriptions = [];
        //selectedVisitor: any;
        this.loading = true;
        this.subscriptions.push(_visitorService.getLoadingVisitors().subscribe(function (data) {
            _this.loading = data;
        }));
        this.subscriptions.push(_visitorService.getBannedVisitors().subscribe(function (data) {
            // console.log(data);
            _this.BannedvisitorList = data;
            _this.BannedvisitorList.map(function (visitor) {
                var currentDate = Date.parse(new Date().toISOString()) - Date.parse(new Date(visitor.bannedOn).toISOString());
                visitor.seconds = Math.floor((currentDate / 1000) % 60);
                visitor.minutes = Math.floor((currentDate / 1000 / 60) % 60);
                visitor.hours = Math.floor((currentDate / 1000) / 60 / 60);
            });
        }));
        this.subscriptions.push(_authService.getAgent().subscribe(function (data) {
            _this.agent = data;
        }));
    }
    BannedComponent.prototype.ngOnInit = function () { };
    BannedComponent.prototype.ngAfterViewInit = function () { };
    BannedComponent.prototype.SelectVisitor = function (visitorId) {
        //this._visitorService.setSelectedBannedVisitor(visitorId, true);
    };
    BannedComponent.prototype.ngOnDestroy = function () {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        // this._visitorService.Destroy()
    };
    BannedComponent.prototype.UnbanVisitor = function (deviceID) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are you sure you want to unban this user?' }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._chatService.UnBanVisitorChat(deviceID).subscribe(function (data) {
                    if (data) {
                        //this._visitorService.RemoveBannedVisitorFormList(deviceID);
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Visitor Unbanned successfully!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
                    }
                    else {
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Cannot Unban Visitor!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'error']
                        });
                    }
                });
            }
            else {
                return;
            }
        });
    };
    BannedComponent = __decorate([
        core_1.Component({
            selector: 'app-banned',
            templateUrl: './banned.component.html',
            styleUrls: ['./banned.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], BannedComponent);
    return BannedComponent;
}());
exports.BannedComponent = BannedComponent;
//# sourceMappingURL=banned.component.js.map