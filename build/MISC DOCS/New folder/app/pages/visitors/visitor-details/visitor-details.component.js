"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitorDetailsComponent = void 0;
var core_1 = require("@angular/core");
// import { Visitorservice } from '../../../../services/VisitorService';
var visitor_ban_time_component_1 = require("../../../dialogs/visitor-ban-time/visitor-ban-time.component");
var confirmation_dialog_component_1 = require("../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var toast_notifications_component_1 = require("../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var VisitorDetailsComponent = /** @class */ (function () {
    function VisitorDetailsComponent(_visitorService, _authService, _chatService, dialog, snackBar, _changeDetectionRef) {
        // this.subscriptions.push(_visitorService.getSelectedVisitor().subscribe(visitor => {
        var _this = this;
        this._visitorService = _visitorService;
        this._authService = _authService;
        this._chatService = _chatService;
        this.dialog = dialog;
        this.snackBar = snackBar;
        this._changeDetectionRef = _changeDetectionRef;
        this._visitor = undefined;
        this.AdditionalData = false;
        this.pageState = '';
        // @Input() state: any = '';
        this.Logs = [];
        this.BanVisitorEmitter = new core_1.EventEmitter();
        this.actionValue = new core_1.EventEmitter();
        this.subscriptions = [];
        this.state = {
            "chatting": true,
            "queued": false,
            "browsing": false,
            "inactive": false,
            'invited': false,
            'left': false,
        };
        this.tabs = {
            "visitorHistory": true,
            "browsingHistory": false,
            "sessionLogs": false,
            "additionalData": false
        };
        // this.selectedVisitor = visitor;
        // // //console.logthis.selectedVisitor);
        // }));
        this.subscriptions.push(_visitorService.getPageState().subscribe(function (pageState) {
            _this.pageState = pageState;
            _this.state[pageState] = true;
        }));
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) {
                // console.log(data);
                _this.permissions = data.permissions.agents;
            }
        }));
        this.subscriptions.push(_chatService.SuperVisedChatList.subscribe(function (data) {
            _this.SuperVisedChatList = data;
        }));
        this._changeDetectionRef.detach();
    }
    Object.defineProperty(VisitorDetailsComponent.prototype, "visitor", {
        set: function (value) {
            this._visitor = value;
            this._changeDetectionRef.detectChanges();
        },
        enumerable: false,
        configurable: true
    });
    VisitorDetailsComponent.prototype.ngOnInit = function () {
    };
    VisitorDetailsComponent.prototype.ngAfterViewInit = function () {
        this._changeDetectionRef.detectChanges();
    };
    VisitorDetailsComponent.prototype.vhListTabs = function (tabName) {
        var _this = this;
        Object.keys(this.tabs).map(function (k) {
            if (k == tabName) {
                _this.tabs[k] = true;
            }
            else {
                _this.tabs[k] = false;
            }
        });
        this._changeDetectionRef.detectChanges();
    };
    VisitorDetailsComponent.prototype.performAction = function (action) {
        this._visitorService.performChildAction(action);
        this._changeDetectionRef.detectChanges();
    };
    // BanVisitor() {
    // if (confirm('Are you sure you want to Ban the Visitor for Chat')) {
    // //console.log"banning");
    // this._chatService.BanVisitorChat(this.selectedVisitor._id, this.selectedVisitor.deviceID).subscribe(data => {
    // //console.log"banned");
    // });;
    // }
    // }
    // BanVisitor() {
    // this.dialog.open(ConfirmationDialogComponent, {
    // panelClass: ['confirmation-dialog'],
    // data: { headermsg: "Are you sure you want to Ban the Visitor " + this.selectedVisitor.username + " ?" }
    // }).afterClosed().subscribe(data => {
    // if (data == 'ok') {
    // this.subscriptions.push(this.dialog.open(VisitorBanTimeComponent, {
    // panelClass: ['confirmation-dialog'],
    // data: {
    // sessionid: this.selectedVisitor._id,
    // deviceID: this.selectedVisitor.deviceID
    // }
    // }).afterClosed().subscribe(response => {
    // }));
    // }
    // });
    // }
    VisitorDetailsComponent.prototype.BanVisitor = function () {
        var _this = this;
        this.subscriptions.push(this.dialog.open(visitor_ban_time_component_1.VisitorBanTimeComponent, {
            panelClass: ['confirmation-dialog'],
            data: {
                sessionid: this._visitor._id,
                deviceID: this._visitor.deviceID
            }
        }).afterClosed().subscribe(function (response) {
            if (response && response.hours) {
                _this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
                    panelClass: ['confirmation-dialog'],
                    data: { headermsg: "Are you sure you want to Ban the Visitor " + _this._visitor.username + " for " + response.hours + " " + ((response.hours < 2) ? "hour" : "hours") + "?" }
                }).afterClosed().subscribe(function (data) {
                    if (data == 'ok') {
                        _this._chatService.BanVisitorChat(_this._visitor._id, _this._visitor.deviceID, parseInt(response.hours)).subscribe(function (response) {
                            if (response) {
                                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                                    data: {
                                        img: 'ok',
                                        msg: 'Visitor Banned successfully!'
                                    },
                                    duration: 2000,
                                    panelClass: ['user-alert', 'success']
                                });
                            }
                            else {
                                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                                    data: {
                                        img: 'warning',
                                        msg: 'Visitor already banned !'
                                    },
                                    duration: 2000,
                                    panelClass: ['user-alert', 'error']
                                });
                            }
                        }, function (err) {
                            _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                                data: {
                                    img: 'warning',
                                    msg: 'Visitor banning failed!'
                                },
                                duration: 2000,
                                panelClass: ['user-alert', 'error']
                            });
                        });
                    }
                });
            }
            _this._changeDetectionRef.detectChanges();
        }));
    };
    VisitorDetailsComponent.prototype.SuperviseChat = function (visitor) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure you want to supervise this Conversation?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._visitorService.SuperViseChat(visitor).subscribe(function (data) {
                    if (data && data.status == 'ok') {
                        _this.SuperVisedChatList.push(visitor.conversationID);
                    }
                });
            }
            _this._changeDetectionRef.detectChanges();
        });
    };
    VisitorDetailsComponent.prototype.CheckIfChatSuperVised = function (cid) {
        return this.SuperVisedChatList.includes(cid);
    };
    VisitorDetailsComponent.prototype.EndSuperVision = function () {
        var _this = this;
        var visitor = this._visitor;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure you want to end supervising this Conversation?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._visitorService.EndSuperVisesChat(visitor.conversationID.toString(), true).subscribe(function (data) {
                    if (data && data.status == 'ok') {
                        _this._chatService.SuperVisedChatList.next(_this._chatService.SuperVisedChatList.getValue().filter(function (id) { return id != visitor.conversationID; }));
                        _this.SuperVisedChatList = _this.SuperVisedChatList.filter(function (id) { return id != visitor.conversationID; });
                        console.log(_this.SuperVisedChatList);
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'ok',
                                msg: 'Super Vision Ended successfully!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'success']
                        });
                    }
                    else {
                        _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                            data: {
                                img: 'warning',
                                msg: 'Error in ending super vision!'
                            },
                            duration: 2000,
                            panelClass: ['user-alert', 'error']
                        });
                    }
                });
            }
            _this._changeDetectionRef.detectChanges();
        });
    };
    __decorate([
        core_1.Input()
    ], VisitorDetailsComponent.prototype, "visitor", null);
    __decorate([
        core_1.Input()
    ], VisitorDetailsComponent.prototype, "agent", void 0);
    __decorate([
        core_1.Input()
    ], VisitorDetailsComponent.prototype, "pageState", void 0);
    __decorate([
        core_1.Input()
    ], VisitorDetailsComponent.prototype, "Logs", void 0);
    __decorate([
        core_1.Output('BanVisitorEmitter')
    ], VisitorDetailsComponent.prototype, "BanVisitorEmitter", void 0);
    __decorate([
        core_1.Output('actionValue')
    ], VisitorDetailsComponent.prototype, "actionValue", void 0);
    VisitorDetailsComponent = __decorate([
        core_1.Component({
            selector: 'app-visitor-details',
            templateUrl: './visitor-details.component.html',
            styleUrls: ['./visitor-details.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], VisitorDetailsComponent);
    return VisitorDetailsComponent;
}());
exports.VisitorDetailsComponent = VisitorDetailsComponent;
//# sourceMappingURL=visitor-details.component.js.map