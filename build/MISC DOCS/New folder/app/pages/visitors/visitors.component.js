"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitorsComponent = void 0;
var core_1 = require("@angular/core");
var toast_notifications_component_1 = require("../../dialogs/SnackBar-Dialog/toast-notifications.component");
var transfer_chat_dialog_component_1 = require("../../dialogs/transfer-chat-dialog/transfer-chat-dialog.component");
var VisitorsComponent = /** @class */ (function () {
    function VisitorsComponent(_visitorService, snackBar, dialog, _chatService, _socketService, _authService, _applicationStateService, _adminSettings, formbuilder) {
        var _this = this;
        this._visitorService = _visitorService;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this._chatService = _chatService;
        this._socketService = _socketService;
        this._authService = _authService;
        this._applicationStateService = _applicationStateService;
        this._adminSettings = _adminSettings;
        this.formbuilder = formbuilder;
        this.visitorList = [];
        this.LeftvisitorList = [];
        this.performingAction = {};
        this.subscriptions = [];
        this.Logs = [];
        this.browsingVisitorsCount = 0;
        this.chattingVisitorsCount = 0;
        this.queuedVisitorsCount = 0;
        this.invitedVisitorsCount = 0;
        this.inactiveVisitorsCount = 0;
        this.leftVisitorsCount = 0;
        this.totalVisitors = this.visitorList.length;
        this.pageState = 'browsing';
        this.aEng = false;
        this.loading = false;
        this.verified = true;
        this.state = {
            "chatting": true,
            "queued": false,
            "browsing": false,
            "inactive": false,
            'invited': false,
            'left': false,
        };
        this.SuperVisedChatList = [];
        this.package = undefined;
        this.subscriptions.push(this._authService.getPackageInfo().subscribe(function (pkg) {
            // console.log('Package : ', pkg);
            if (pkg) {
                _this.package = pkg.tracking;
                if (!_this.package.allowed) {
                    _this._applicationStateService.NavigateTo('/noaccess');
                }
            }
        }));
        this.searchForm = formbuilder.group({
            'searchValue': ['', []]
        });
        // this.visitorList = _visitorService.visitorList.getValue();
        this.subscriptions.push(_adminSettings.getEngagementSettings().subscribe(function (data) {
            _this.aEng = data;
        }));
        this.subscriptions.push(this._socketService.getSocket().subscribe(function (socket) {
            if (socket) {
                if (_this.selectedVisitor) {
                    if (!_this.selectedVisitor.logsFetched)
                        _this.selectedVisitor.logsFetched = false;
                    if (!_this.selectedVisitor.logsFetched && !_this.selectedVisitor.logs) {
                        _this._visitorService.GetVisitorLogs(_this.selectedVisitor._id).subscribe(function (data) {
                            if (data && _this.selectedVisitor) {
                                _this.selectedVisitor.logs = data.slice();
                                _this.selectedVisitor.logsFetched = true;
                                _this._visitorService.UpdateVisitor(_this.selectedVisitor).subscribe(function (data) {
                                    if (data) {
                                        var transformedLogs = _this.transformVisitorsLog(_this.selectedVisitor.logs);
                                        _this.Logs = transformedLogs;
                                    }
                                    else { }
                                });
                            }
                        });
                    }
                    else {
                        var transformedLogs = _this.transformVisitorsLog(_this.selectedVisitor.logs);
                        _this.Logs = transformedLogs;
                    }
                }
            }
        }));
        this.subscriptions.push(this._authService.getSettings().subscribe(function (settings) {
            if (settings && Object.keys(settings).length)
                _this.verified = settings.verified;
        }));
        this.subscriptions.push(this._applicationStateService.shortcutEvents.subscribe(function (data) {
            // console.log('Set Selected Visitor Visitor Component');
            _this._visitorService.SelectVisitor(data);
        }));
        this.subscriptions.push(_authService.getAgent().subscribe(function (data) {
            _this.agent = data;
        }));
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) {
                // console.log(data);
                _this.permissions = data.permissions.agents;
            }
        }));
        this.subscriptions.push(_applicationStateService.requestQue.subscribe(function (data) {
            _this.ManualQueueAssignment(_this.visitorList[_this.visitorList.findIndex(function (visitor) {
                return (visitor.state == 2);
            })].id);
        }));
    }
    VisitorsComponent.prototype.ngOnInit = function () {
        var _this = this;
        // (window.innerWidth <= 768) ? this.viewMode = 'sv' : undefined;
        this.subscriptions.push(this._visitorService.GetVisitorsList().debounceTime(500).subscribe(function (data) {
            _this.visitorList = data;
            // console.log('Updting Visitor Component count', this.visitorList.length);
            // console.log('Data : ' , data)
            // console.log(this.visitorList);
            // console.log()
            // console.log('equivalency : ', this.visitorList === data)
        }));
        this.subscriptions.push(this._chatService.SuperVisedChatList.subscribe(function (data) {
            // console.log(data);
            _this.SuperVisedChatList = data;
        }));
        this.subscriptions.push(this._visitorService.getLoadingVisitors().subscribe(function (data) {
            _this.loading = data;
        }));
        this.subscriptions.push(this._visitorService.getPageState().subscribe(function (data) {
            _this.pageState = data;
        }));
        this.subscriptions.push(this._visitorService.getSelectedVisitor().subscribe(function (visitor) {
            _this.selectedVisitor = visitor;
        }));
        this.subscriptions.push(this._visitorService.timer.subscribe(function (tick) {
            _this.tick = tick;
        }));
        this.subscriptions.push(this._visitorService.getAction().subscribe(function (action) {
            if (_this.selectedVisitor && _this.selectedVisitor._id)
                switch (action) {
                    case 'initiateChat':
                        _this.InitiateChat(_this.selectedVisitor._id);
                        break;
                    case 'inviteChat':
                        _this.ManualQueueAssignment(_this.selectedVisitor._id);
                        break;
                    case 'transferChat':
                        _this.TransferChat({
                            sid: _this.selectedVisitor.id,
                            location: _this.selectedVisitor.location
                        });
                        break;
                    default:
                        break;
                }
        }));
        this.subscriptions.push(this._visitorService.getNotification().subscribe(function (data) {
            if (data) {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: data.img,
                        msg: data.msg
                    },
                    duration: 2000,
                    panelClass: ['user-alert', data.type]
                }).afterDismissed().subscribe(function (data) {
                    _this._visitorService.setNotification('', '', '');
                });
            }
        }));
        this.subscriptions.push(this._visitorService.getLeftVisitors().subscribe(function (data) {
            _this.LeftvisitorList = data;
        }));
        this.subscriptions.push(this._visitorService.BrowsingVisitorsCount().subscribe(function (data) {
            _this.browsingVisitorsCount = data;
            _this.totalVisitors = _this.visitorList.length;
        }));
        this.subscriptions.push(this._visitorService.ChattingVisitorsCount().subscribe(function (data) {
            _this.chattingVisitorsCount = data;
            _this.totalVisitors = _this.visitorList.length;
        }));
        this.subscriptions.push(this._visitorService.QueuedVisitorsCount().subscribe(function (data) {
            _this.queuedVisitorsCount = data;
            _this.totalVisitors = _this.visitorList.length;
        }));
        this.subscriptions.push(this._visitorService.InvitedVisitorsCount().subscribe(function (data) {
            _this.invitedVisitorsCount = data;
            _this.totalVisitors = _this.visitorList.length;
        }));
        this.subscriptions.push(this._visitorService.InactiveVisitorsCount().subscribe(function (data) {
            _this.inactiveVisitorsCount = data;
            _this.totalVisitors = _this.visitorList.length;
        }));
        this.subscriptions.push(this._visitorService.LeftVisitorsCount().subscribe(function (data) {
            _this.leftVisitorsCount = data;
            _this.totalVisitors = _this.visitorList.length;
        }));
        this.subscriptions.push(this._visitorService.performingAction.subscribe(function (data) {
            _this.performingAction = data;
        }));
    };
    // ngOnInit() {
    //     // (window.innerWidth <= 768) ? this.viewMode = 'sv' : undefined;
    // }
    VisitorsComponent.prototype.changeState = function (state) {
        this.pageState = state;
        this._visitorService.changeState(state);
    };
    VisitorsComponent.prototype.transformVisitorsLog = function (log) {
        var Visitorlogarr = [];
        var Visitorlogsingular;
        Visitorlogarr = log;
        if (Visitorlogarr.length > 0) {
            Visitorlogarr = Visitorlogarr.reduce(function (previous, current) {
                if (!previous[new Date(current.time_stamp).toDateString()]) {
                    previous[new Date(current.time_stamp).toDateString()] = [current];
                }
                else {
                    previous[new Date(current.time_stamp).toDateString()].push(current);
                }
                return previous;
            }, {});
        }
        Visitorlogsingular = Object.keys(Visitorlogarr).map(function (key) {
            return { date: key, groupedvisitorlogList: Visitorlogarr[key] };
        }).sort(function (a, b) {
            if (new Date(a.date) > new Date(b.date))
                return -1;
            else if (new Date(a.date) < new Date(b.date))
                return 1;
            else
                0;
        });
        Visitorlogsingular.forEach(function (element) {
            element.groupedvisitorlogList.sort(function (a, b) {
                if (new Date(a.time_stamp) > new Date(b.time_stamp))
                    return -1;
                else if (new Date(a.time_stamp) < new Date(b.time_stamp))
                    return 1;
                else
                    0;
            });
        });
        return Visitorlogsingular;
    };
    VisitorsComponent.prototype.SelectVisitor = function (visitorId) {
        this._visitorService.setSelectedVisitor(visitorId);
    };
    VisitorsComponent.prototype.SelectedVisitorLeft = function (visitorId) {
        this._visitorService.setSelectedVisitor(visitorId, true);
    };
    VisitorsComponent.prototype.performAction = function (action) {
        this._visitorService.performChildAction(action);
    };
    VisitorsComponent.prototype.BanVisitor = function (data) {
        var _this = this;
        this._chatService.BanVisitorChat(data.id, data.deviceId, data.forHours).subscribe(function (response) {
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
    };
    VisitorsComponent.prototype.InitiateChat = function (visitorid) {
        var _this = this;
        console.log(visitorid);
        //this.performingAction[visitorid] = true;
        this._visitorService.InitiateChat(visitorid).subscribe(function (data) {
            //setTimeout(() => {
            // delete this.performingAction[visitorid];
            if (data.status == 'ok') {
                _this.visitorList = _this.visitorList.filter(function (data) { return (data._id != visitorid); });
                _this._chatService.InserNewConversation(data.conversation);
            }
            // }, 5000);
        });
    };
    VisitorsComponent.prototype.SuperviseChat = function (visitor) {
        // console.log(visitor);
        // this.performingAction[visitor._id] = true;
        this._visitorService.SuperViseChat(visitor).subscribe(function (data) {
            // delete this.performingAction[visitor._id];
            if (data && data.status == 'ok') {
                // console.log('supervision started');
            }
            else {
                // console.log('supervision error');
            }
        });
    };
    VisitorsComponent.prototype.TransferChat = function (transferChatData) {
        var _this = this;
        this._chatService.GetLiveAgent(transferChatData.location).subscribe(function (data) {
            if (data && data.length) {
                _this.dialog.open(transfer_chat_dialog_component_1.TransferChatDialog, {
                    panelClass: ['responsive-dialog'],
                    data: data
                }).afterClosed().subscribe(function (selectedAgent) {
                    if (selectedAgent) {
                        if (selectedAgent.id != 'dummy') {
                            _this._visitorService.performingAction.getValue()[transferChatData.sid] = true;
                            _this._visitorService.performingAction.next(_this._visitorService.performingAction.getValue());
                            _this._chatService.TransferChatRest({ id: selectedAgent.id, name: selectedAgent.nickname }, transferChatData.sid).subscribe(function (data) {
                                if (data) {
                                    setTimeout(function () {
                                        _this._visitorService.performingAction.getValue()[transferChatData.sid] = false;
                                        _this._visitorService.performingAction.next(_this._visitorService.performingAction.getValue());
                                    }, 0);
                                }
                            });
                        }
                    }
                });
            }
            else {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'No Agents Available to Transfer'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'warning']
                });
            }
        });
    };
    VisitorsComponent.prototype.ManualQueueAssignment = function (visitorid) {
        console.log(visitorid);
        // this.performingAction[visitorid] = true;
        this._visitorService.RequestQueueRest(visitorid).subscribe(function (data) {
            // delete this.performingAction[visitorid];
        });
    };
    VisitorsComponent.prototype.EndSuperVision = function (visitor) {
        var _this = this;
        this._visitorService.EndSuperVisesChat(visitor.cid.toString(), true).subscribe(function (data) {
            if (data && data.status == 'ok') {
                _this._chatService.SuperVisedChatList.next(_this._chatService.SuperVisedChatList.getValue().filter(function (id) { return id != visitor.cid.toString(); }));
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
    };
    // browsingVisitors(visitorList) {
    //     let temp = visitorList.filter(visitor => {
    //         setTimeout(() => {
    //             if ((visitor.state == 1 || visitor.state == 8) && !visitor.inactive) return visitor
    //         }, 0);
    //     });
    //     return temp;
    // }
    VisitorsComponent.prototype.ngOnDestroy = function () {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    VisitorsComponent = __decorate([
        core_1.Component({
            selector: 'app-visitors',
            templateUrl: './visitors.component.html',
            styleUrls: ['./visitors.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], VisitorsComponent);
    return VisitorsComponent;
}());
exports.VisitorsComponent = VisitorsComponent;
//# sourceMappingURL=visitors.component.js.map