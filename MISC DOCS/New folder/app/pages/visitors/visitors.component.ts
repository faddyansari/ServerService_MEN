import { SocketService } from './../../../services/SocketService';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

// Service Injection
import { Visitorservice } from '../../../services/VisitorService';
import { Subscription } from 'rxjs/Subscription';
import { ChatService } from '../../../services/ChatService';
import { AuthService } from '../../../services/AuthenticationService';
import { GlobalStateService } from '../../../services/GlobalStateService';
import { FormGroup, FormBuilder } from '@angular/forms';

import { AdminSettingsService } from '../../../services/adminSettingsService';
import { ToastNotifications } from '../../dialogs/SnackBar-Dialog/toast-notifications.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransferChatDialog } from '../../dialogs/transfer-chat-dialog/transfer-chat-dialog.component';

@Component({
    selector: 'app-visitors',
    templateUrl: './visitors.component.html',
    styleUrls: ['./visitors.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VisitorsComponent implements OnInit {

    visitorList = [];
    LeftvisitorList = [];
    performingAction = {};
    subscriptions: Subscription[] = [];
    Logs = [];
    browsingVisitorsCount = 0;
    chattingVisitorsCount = 0;
    queuedVisitorsCount = 0;
    invitedVisitorsCount = 0
    inactiveVisitorsCount = 0;
    leftVisitorsCount = 0;

    totalVisitors = this.visitorList.length;
    pageState = 'browsing';
    agent: any;
    selectedVisitor: any;
    aEng = false;
    loading = false;
    verified = true;
    tick: any;
    socket: any;
    ManualAssign: any;
    permissions: any;
    action: string;
    public searchForm: FormGroup;
    state = {
        "chatting": true,
        "queued": false,
        "browsing": false,
        "inactive": false,
        'invited': false,
        'left': false,
    }
    SuperVisedChatList: Array<any> = []

    package = undefined;

    constructor(private _visitorService: Visitorservice,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
        public _chatService: ChatService,
        private _socketService: SocketService,
        public _authService: AuthService,
        public _applicationStateService: GlobalStateService,
        public _adminSettings: AdminSettingsService,
        public formbuilder: FormBuilder) {

        this.subscriptions.push(this._authService.getPackageInfo().subscribe(pkg => {
            // console.log('Package : ', pkg);
            if (pkg) {
                this.package = pkg.tracking;
                if (!this.package.allowed) {
                    this._applicationStateService.NavigateTo('/noaccess');
                }
            }
        }));

        this.searchForm = formbuilder.group({
            'searchValue': ['', []]
        });

        // this.visitorList = _visitorService.visitorList.getValue();



        this.subscriptions.push(_adminSettings.getEngagementSettings().subscribe(data => {
            this.aEng = data;
        }));

        this.subscriptions.push(this._socketService.getSocket().subscribe(socket => {
            if (socket) {
                if (this.selectedVisitor) {
                    if (!this.selectedVisitor.logsFetched) this.selectedVisitor.logsFetched = false;
                    if (!this.selectedVisitor.logsFetched && !this.selectedVisitor.logs) {
                        this._visitorService.GetVisitorLogs(this.selectedVisitor._id).subscribe(data => {
                            if (data && this.selectedVisitor) {
                                this.selectedVisitor.logs = data.slice();
                                this.selectedVisitor.logsFetched = true;
                                this._visitorService.UpdateVisitor(this.selectedVisitor).subscribe(data => {
                                    if (data) {
                                        let transformedLogs = this.transformVisitorsLog(this.selectedVisitor.logs);
                                        this.Logs = transformedLogs;
                                    }
                                    else { }
                                });
                            }
                        })
                    }
                    else {
                        let transformedLogs = this.transformVisitorsLog(this.selectedVisitor.logs);
                        this.Logs = transformedLogs;
                    }
                }
            }
        }));

        this.subscriptions.push(this._authService.getSettings().subscribe(settings => {
            if (settings && Object.keys(settings).length) this.verified = settings.verified;
        }));

        this.subscriptions.push(this._applicationStateService.shortcutEvents.subscribe(data => {
            // console.log('Set Selected Visitor Visitor Component');
            this._visitorService.SelectVisitor(data);
        }));


        this.subscriptions.push(_authService.getAgent().subscribe(data => {
            this.agent = data;
        }));


        this.subscriptions.push(_authService.getSettings().subscribe(data => {
            if (data && data.permissions) {
                // console.log(data);

                this.permissions = data.permissions.agents;
            }
        }));

        this.subscriptions.push(_applicationStateService.requestQue.subscribe(data => {
            this.ManualQueueAssignment(this.visitorList[this.visitorList.findIndex(visitor => {
                return (visitor.state == 2)
            })].id)
        }));


    }

    ngOnInit() {
        // (window.innerWidth <= 768) ? this.viewMode = 'sv' : undefined;
        this.subscriptions.push(this._visitorService.GetVisitorsList().debounceTime(500).subscribe((data) => {
            this.visitorList = data;
            // console.log('Updting Visitor Component count', this.visitorList.length);
            // console.log('Data : ' , data)
            // console.log(this.visitorList);
            // console.log()
            // console.log('equivalency : ', this.visitorList === data)

        }));

        this.subscriptions.push(this._chatService.SuperVisedChatList.subscribe(data => {
            // console.log(data);

            this.SuperVisedChatList = data;
        }));

        this.subscriptions.push(this._visitorService.getLoadingVisitors().subscribe(data => {
            this.loading = data;
        }));

        this.subscriptions.push(this._visitorService.getPageState().subscribe(data => {
            this.pageState = data;
        }));

        this.subscriptions.push(this._visitorService.getSelectedVisitor().subscribe(visitor => {
            this.selectedVisitor = visitor;
        }));

        this.subscriptions.push(this._visitorService.timer.subscribe(tick => {
            this.tick = tick;
        }));

        this.subscriptions.push(this._visitorService.getAction().subscribe(action => {
            if (this.selectedVisitor && this.selectedVisitor._id)
                switch (action) {
                    case 'initiateChat':
                        this.InitiateChat(this.selectedVisitor._id)
                        break;
                    case 'inviteChat':
                        this.ManualQueueAssignment(this.selectedVisitor._id)
                        break;
                    case 'transferChat':
                        this.TransferChat({
                            sid: this.selectedVisitor.id,
                            location: this.selectedVisitor.location
                        })
                        break;
                    default:
                        break;
                }
        }));

        this.subscriptions.push(this._visitorService.getNotification().subscribe(data => {
            if (data) {
                this.snackBar.openFromComponent(ToastNotifications, {
                    data: {
                        img: data.img,
                        msg: data.msg
                    },
                    duration: 2000,
                    panelClass: ['user-alert', data.type]
                }).afterDismissed().subscribe(data => {
                    this._visitorService.setNotification('', '', '');
                });
            }

        }));

        this.subscriptions.push(this._visitorService.getLeftVisitors().subscribe((data) => {
            this.LeftvisitorList = data;
        }));

        this.subscriptions.push(this._visitorService.BrowsingVisitorsCount().subscribe((data) => {
            this.browsingVisitorsCount = data;
            this.totalVisitors = this.visitorList.length
        }));

        this.subscriptions.push(this._visitorService.ChattingVisitorsCount().subscribe((data) => {
            this.chattingVisitorsCount = data;
            this.totalVisitors = this.visitorList.length
        }));

        this.subscriptions.push(this._visitorService.QueuedVisitorsCount().subscribe((data) => {
            this.queuedVisitorsCount = data;
            this.totalVisitors = this.visitorList.length
        }));

        this.subscriptions.push(this._visitorService.InvitedVisitorsCount().subscribe(data => {
            this.invitedVisitorsCount = data;
            this.totalVisitors = this.visitorList.length;
        }));

        this.subscriptions.push(this._visitorService.InactiveVisitorsCount().subscribe(data => {
            this.inactiveVisitorsCount = data;
            this.totalVisitors = this.visitorList.length;
        }));


        this.subscriptions.push(this._visitorService.LeftVisitorsCount().subscribe(data => {
            this.leftVisitorsCount = data;
            this.totalVisitors = this.visitorList.length;
        }));

        this.subscriptions.push(this._visitorService.performingAction.subscribe(data => {
            this.performingAction = data;
        }));
    }

    // ngOnInit() {
    //     // (window.innerWidth <= 768) ? this.viewMode = 'sv' : undefined;
    // }
    changeState(state: string) {
        this.pageState = state;
        this._visitorService.changeState(state);
    }

    transformVisitorsLog(log: Array<any>): Array<any> {
        let Visitorlogarr = [];
        let Visitorlogsingular: any;
        Visitorlogarr = log;
        if (Visitorlogarr.length > 0) {
            Visitorlogarr = Visitorlogarr.reduce((previous, current) => {
                if (!previous[new Date(current.time_stamp).toDateString()]) {
                    previous[new Date(current.time_stamp).toDateString()] = [current];
                } else {
                    previous[new Date(current.time_stamp).toDateString()].push(current);
                }

                return previous;
            }, {});
        }

        Visitorlogsingular = Object.keys(Visitorlogarr).map(key => {
            return { date: key, groupedvisitorlogList: Visitorlogarr[key] }
        }).sort((a, b) => {

            if (new Date(a.date) > new Date(b.date)) return -1;
            else if (new Date(a.date) < new Date(b.date)) return 1;
            else 0;

        });

        Visitorlogsingular.forEach(element => {
            element.groupedvisitorlogList.sort((a, b) => {
                if (new Date(a.time_stamp) > new Date(b.time_stamp)) return -1;
                else if (new Date(a.time_stamp) < new Date(b.time_stamp)) return 1;
                else 0;
            })
        });
        return Visitorlogsingular;
    }

    SelectVisitor(visitorId) {
        this._visitorService.setSelectedVisitor(visitorId);
    }

    SelectedVisitorLeft(visitorId) {
        this._visitorService.setSelectedVisitor(visitorId, true);
    }

    performAction(action) {
        this._visitorService.performChildAction(action);
    }

    BanVisitor(data) {
        this._chatService.BanVisitorChat(data.id, data.deviceId, data.forHours).subscribe((response) => {
            if (response) {
                this.snackBar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Visitor Banned successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            } else {
                this.snackBar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Visitor already banned !'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
            }

        }, err => {
            this.snackBar.openFromComponent(ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Visitor banning failed!'
                },
                duration: 2000,
                panelClass: ['user-alert', 'error']
            });
        });
    }
    InitiateChat(visitorid: string) {
        console.log(visitorid);
        //this.performingAction[visitorid] = true;
        this._visitorService.InitiateChat(visitorid).subscribe(data => {
            //setTimeout(() => {
            // delete this.performingAction[visitorid];
            if (data.status == 'ok') {
                this.visitorList = this.visitorList.filter(data => { return (data._id != visitorid) });
                this._chatService.InserNewConversation(data.conversation);
            }
            // }, 5000);
        });
    }

    SuperviseChat(visitor) {
        // console.log(visitor);
        // this.performingAction[visitor._id] = true;
        this._visitorService.SuperViseChat(visitor).subscribe(data => {
            // delete this.performingAction[visitor._id];
            if (data && data.status == 'ok') {
                // console.log('supervision started');
            }
            else {
                // console.log('supervision error');
            }
        })
    }

    TransferChat(transferChatData) {

        this._chatService.GetLiveAgent(transferChatData.location).subscribe(data => {
            if (data && data.length) {
                this.dialog.open(TransferChatDialog, {
                    panelClass: ['responsive-dialog'],
                    data: data
                }).afterClosed().subscribe(selectedAgent => {
                    if (selectedAgent) {
                        if (selectedAgent.id != 'dummy') {
                            this._visitorService.performingAction.getValue()[transferChatData.sid] = true;
                            this._visitorService.performingAction.next(this._visitorService.performingAction.getValue())
                            this._chatService.TransferChatRest({ id: selectedAgent.id, name: selectedAgent.nickname }, transferChatData.sid).subscribe(data => {
                                if (data) {
                                    setTimeout(() => {

                                        this._visitorService.performingAction.getValue()[transferChatData.sid] = false
                                        this._visitorService.performingAction.next(this._visitorService.performingAction.getValue())
                                    }, 0);
                                }
                            });
                        }
                    }
                });
            } else {
                this.snackBar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'No Agents Available to Transfer'
                    },
                    duration: 3000,
                    panelClass: ['user-alert', 'warning']
                });
            }
        });
    }

    ManualQueueAssignment(visitorid: string) {
        console.log(visitorid);

        // this.performingAction[visitorid] = true;
        this._visitorService.RequestQueueRest(visitorid).subscribe(data => {
            // delete this.performingAction[visitorid];
        });
    }

    EndSuperVision(visitor: any) {

        this._visitorService.EndSuperVisesChat(visitor.cid.toString(), true).subscribe(data => {
            if (data && data.status == 'ok') {
                this._chatService.SuperVisedChatList.next(this._chatService.SuperVisedChatList.getValue().filter((id) => { return id != visitor.cid.toString() }))
                this.snackBar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Super Vision Ended successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            } else {
                this.snackBar.openFromComponent(ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Error in ending super vision!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'error']
                });
            }

        })
    }

    // browsingVisitors(visitorList) {
    //     let temp = visitorList.filter(visitor => {
    //         setTimeout(() => {

    //             if ((visitor.state == 1 || visitor.state == 8) && !visitor.inactive) return visitor
    //         }, 0);
    //     });
    //     return temp;
    // }

    ngOnDestroy() {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }
}
