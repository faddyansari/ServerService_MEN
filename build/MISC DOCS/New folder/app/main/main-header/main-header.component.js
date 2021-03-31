"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainHeaderComponent = void 0;
var core_1 = require("@angular/core");
var confirmation_dialog_component_1 = require("../../dialogs/confirmation-dialog/confirmation-dialog.component");
var overlay_dialog_component_1 = require("../../dialogs/overlay-dialog/overlay-dialog.component");
var help_window_service_1 = require("../../../services/help-window.service");
var post_message_service_1 = require("../../../services/post-message.service");
var Subject_1 = require("rxjs/Subject");
var MainHeaderComponent = /** @class */ (function () {
    function MainHeaderComponent(routeService, _authService, _globalStateService, _chatService, _agentService, _contactService, _socketService, _ticketService, _localStorageService, dialog, snackBar, _helpService, sanitizer, _postMessageService, _whatsAppService, _visitorService) {
        var _this = this;
        this.routeService = routeService;
        this._authService = _authService;
        this._globalStateService = _globalStateService;
        this._chatService = _chatService;
        this._agentService = _agentService;
        this._contactService = _contactService;
        this._socketService = _socketService;
        this._ticketService = _ticketService;
        this._localStorageService = _localStorageService;
        this.dialog = dialog;
        this.snackBar = snackBar;
        this._helpService = _helpService;
        this.sanitizer = sanitizer;
        this._postMessageService = _postMessageService;
        this._whatsAppService = _whatsAppService;
        this._visitorService = _visitorService;
        // @ViewChild('searchPopper') searchPopper: PopperContent;
        // currentRoute = '/home';
        this.subscriptions = [];
        //Side Bar Customized
        this.showSubMenu = false;
        this.status = '';
        this.role = '';
        this.nsp = '';
        this.routeAllowed = true;
        this.allconversations = [];
        this.messageReadCount = 0;
        this.pendingTicketsCount = 0;
        this.openTicketsCount = 0;
        this.agentMessageReadCount = 0;
        this.contactMessageReadCount = 0;
        this.acceptingChatMode = false;
        this.agentId = '';
        this.reconnectionStatus = false;
        this.agentConversations = [];
        // agentList: Array<any> = [];
        this.contactThreadList = [];
        this.verified = true;
        this.production = false;
        this.sbt = false;
        this.showSettingsMenu = false;
        this.settingsSelectedRoute = '';
        //Help Window Functionality
        this.helpWindow = false;
        this.helpFrameAddress = '';
        this.msgNotification = false;
        this.msgNotificationCount = undefined;
        this.searchActive = false;
        this.rendered = false;
        //Search Tickets
        this.searchValue = '';
        this.searchInput = new Subject_1.Subject();
        this.searchedTickets = [];
        this.showPopper = false;
        this.popperClick = false;
        this.showCallmenu = false;
        this.chattingVisitorsCount = 0;
        this.queuedVisitorsCount = 0;
        this.WapUnreadCount = 0;
        this.getQueuedVisitorOnAccepting = new Subject_1.Subject();
        this.package = undefined;
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            // //console.logdata);
            if (data && data.permissions) {
                _this.permissions = data.permissions;
                // //console.logthis.permissions);
            }
        }));
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg;
            }
        }));
        this.subscriptions.push(_globalStateService.getRoute().subscribe(function (data) {
            _this.currentRoute = data;
        }));
        this.subscriptions.push(_globalStateService.showSettingsMenu.subscribe(function (data) {
            _this.showSettingsMenu = data;
        }));
        this.subscriptions.push(_globalStateService.settingsSelectedRoute.subscribe(function (data) {
            _this.settingsSelectedRoute = data;
        }));
        this.subscriptions.push(_authService.SBT.subscribe(function (data) {
            _this.sbt = data;
        }));
        this.subscriptions.push(_socketService.GetStatus().subscribe(function (status) {
            //Open Dialog here
            if (status == 'Connected' && _this.status == 'Disconnected') {
                setTimeout(function () {
                    _this.dialogRef.componentInstance.Connected('Connected');
                    setTimeout(function () {
                        _this.dialog.closeAll();
                        _this.dialogOpenedTrue = false;
                    }, 1000);
                }, 1000);
            }
            if (status == 'Disconnected') {
                //Hack To Open Dialog In Constructor
                // Remove Angular Expression Changed after View Checked Exception
                _this.dialogRef = _this.dialog.open(overlay_dialog_component_1.OverlayDialogComponent, {
                    panelClass: ['searching-server-dialog'],
                    disableClose: true,
                    backdropClass: 'opacity1'
                });
                _this.dialogOpenedTrue = true;
            }
            _this.status = status;
        }));
        this.subscriptions.push(_authService.getAgent().subscribe(function (data) {
            _this.agent = data;
            _this.agentId = data._id;
            _this.role = data.role;
            _this.nsp = data.nsp;
            if (_this.role == 'admin' || _this.role == 'superadmin') {
                _this.routeAllowed = true;
            }
        }));
        this.subscriptions.push(_chatService.AllConversations.subscribe(function (data) {
            _this.allconversations = data;
            _this.messageReadCount = 0;
            _this.allconversations.map(function (conversation) {
                if (conversation.messageReadCount && conversation.state == 2)
                    _this.messageReadCount += conversation.messageReadCount;
                if (conversation.messages.length) {
                    conversation.lastmessageTime = Math.floor((new Date().getTime() -
                        new Date(conversation.messages[conversation.messages.length - 1].date).getTime())
                        / 1000 / 60 % 60);
                }
            });
            _this._globalStateService.SetTitle(_this.messageReadCount);
        }));
        this.subscriptions.push(_ticketService.getTicketsCount().subscribe(function (countsWRTState) {
            _this.pendingTicketsCount = 0;
            _this.openTicketsCount = 0;
            countsWRTState.map(function (group) {
                if (group.state == "PENDING")
                    _this.pendingTicketsCount += group.count;
                else if (group.state == "OPEN")
                    _this.openTicketsCount += group.count;
            });
        }));
        this.subscriptions.push(_ticketService.Filters.subscribe(function (filters) {
            if (filters) {
                _this.filters = filters;
                _this.searchValue = filters.query;
                if (!_this.searchValue) {
                    _this.searchedTickets = [];
                }
            }
        }));
        this.subscriptions.push(_ticketService.headerSearch.subscribe(function (searchvalue) {
            _this.searchValue = searchvalue;
        }));
        // this.subscriptions.push(this._agentService.getAllAgentsList().subscribe(data => {
        // 	////console.log'Agent List Subscribed');
        // 	this.agentList = data;
        // }));
        this.subscriptions.push(this._globalStateService.navbarSidebar_state.subscribe(function (state) {
            // //console.log'Main Side Bar COmponent Initialized');
            _this.navbarSidebar_state = state;
            //  //console.logthis.currentRoute);
        }));
        this.subscriptions.push(_contactService.isSelfViewingChat.subscribe(function (data) {
            _this.isSelfViewingContactChat = data;
        }));
        this.subscriptions.push(_agentService.isSelfViewingChat.subscribe(function (data) {
            _this.isSelfViewingAgentChat = data;
        }));
        this.subscriptions.push(this._agentService.agentConversationList.subscribe(function (data) {
            _this.agentConversations = data;
            var unreadCount = 0;
            _this.agentConversations.map(function (conversation) {
                if (!(_this.isSelfViewingAgentChat.chatId == conversation._id && _this.isSelfViewingAgentChat.value)) {
                    if (conversation.members.filter(function (m) { return m.email == _this.agent.email; }).length) {
                        var temp_1 = conversation.LastSeen.filter(function (user) { return user.email == _this.agent.email; });
                        (temp_1 && temp_1.length) ? unreadCount += temp_1[0].messageReadCount : undefined;
                    }
                }
            });
            _this.agentMessageReadCount = unreadCount;
        }));
        this.subscriptions.push(this._contactService.conversationList.subscribe(function (data) {
            _this.contactThreadList = data;
            var unreadCount = 0;
            _this.contactThreadList.map(function (conversation) {
                if (!(_this.isSelfViewingContactChat.chatId == conversation._id && _this.isSelfViewingContactChat.value)) {
                    if (conversation.to == _this.agent.email || conversation.from == _this.agent.email) {
                        unreadCount += conversation.LastSeen.filter(function (user) { return user.id == _this.agent.email; })[0].messageReadCount;
                    }
                }
            });
            _this.contactMessageReadCount = unreadCount;
        }));
        this.subscriptions.push(_authService.getSettings().subscribe(function (settings) {
            if (Object.keys(settings).length) {
                _this.settings = settings;
                _this.acceptingChatMode = _this.settings.applicationSettings.acceptingChatMode;
            }
        }));
        this.subscriptions.push(this._authService.helpWindowFrameURL.subscribe(function (url) {
            _this.helpFrameAddress = url;
        }));
        this.subscriptions.push(this._postMessageService.msgNotification.subscribe(function (data) {
            // //console.logdata);
            if (data == 0) {
                _this.msgNotification = false;
            }
            else {
                _this.msgNotification = true;
                _this.msgNotificationCount = data;
            }
        }));
        // this.subscriptions.push(_visitorService.ChattingVisitorsCount().subscribe((data) => {
        //     //console.log(data);
        // 	this.chattingVisitorsCount = data;
        // }));
        this.subscriptions.push(_visitorService.GetVisitorsList().debounceTime(500).subscribe(function (data) {
            _this.chattingVisitorsCount = 0;
            //console.logthis.agent);
            if (data && data.length) {
                data.map(function (visitor) {
                    if ((visitor.state == 3 || visitor.state == 4) && (visitor.agent && visitor.agent.id && visitor.agent.id == _this.agent.csid && !visitor.inactive)) {
                        _this.chattingVisitorsCount += 1;
                    }
                });
            }
        }));
        this.subscriptions.push(_visitorService.QueuedVisitorsCount().subscribe(function (data) {
            _this.queuedVisitorsCount = data;
        }));
        this.subscriptions.push(this.getQueuedVisitorOnAccepting.debounceTime(2000).subscribe(function (data) {
            if (_this.fetchQueue)
                _this._chatService.AutoSync.next(true);
        }));
        this.subscriptions.push(this._whatsAppService.MessageUnreadCount.subscribe(function (count) {
            _this.WapUnreadCount = count;
        }));
        this.searchInput
            .debounceTime(300)
            .subscribe(function () {
            // this._ticketService.Filters.next(this.ApplyFilter());
            var value = _this.searchValue.trim();
            if (value) {
                if (value.length > 1) {
                    _this._ticketService.getTicketsByQuery(value, 5).subscribe(function (tickets) {
                        //console.logthis.searchValue);
                        //console.logtickets);
                        _this.searchedTickets = tickets;
                        _this.showPopper = true;
                    });
                }
            }
            else {
                // this.searchAllTickets();
                _this._ticketService.headerSearch.next(value);
                // this._ticketService.Filters.next(this.ApplyFilter());
                _this.showPopper = false;
                _this.searchedTickets = [];
            }
        });
    }
    MainHeaderComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.rendered = true;
        }, 0);
    };
    MainHeaderComponent.prototype.KeyUp = function (event) {
        if (event.which == 13) {
            this.searchAllTickets();
        }
    };
    MainHeaderComponent.prototype.closeDrawerAndNavBar = function () {
        this.routeService.drawerActive.next(false);
        this._globalStateService.navbarState.next(false);
    };
    MainHeaderComponent.prototype.displaySource = function (source) {
        switch (source) {
            case 'email':
                return { name: 'Email', img: 'email-colored' };
            case 'livechat':
                return { name: 'Live Chat', img: 'visitors-colored' };
            case 'panel':
                return { name: 'Beelinks Portal', img: 'agents-colored' };
            default:
                return { name: 'N/A', img: 'agents' };
        }
    };
    MainHeaderComponent.prototype.toggleDrawer = function () {
        this._globalStateService.ToggleDrawer();
    };
    MainHeaderComponent.prototype.sideBarDropDownState = function (event) {
        event.preventDefault();
        this.showSubMenu = !(this.showSubMenu);
    };
    MainHeaderComponent.prototype.toggleSettingsMenu = function () {
        this._globalStateService.toggleSettingsMenu();
    };
    MainHeaderComponent.prototype.hideSettingsMenu = function () {
        this._globalStateService.setSettingsMenu(false);
    };
    // public setCurrentConversation(event: any) {
    // 	event.preventDefault();
    // 	setTimeout(() => {
    // 		let currentConversation = event.srcElement.attributes.getNamedItem('cid').value;
    // 		this._chatService.setCurrentConversation(currentConversation);
    // 	}, 300);
    // }
    MainHeaderComponent.prototype.Logout = function (e) {
        var _this = this;
        e.preventDefault();
        // //console.loge);
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: 'Are you sure you want to logout?' }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._authService.logout();
                _this._localStorageService.setValue('logout', true);
            }
        });
    };
    MainHeaderComponent.prototype.selectSettings = function (name) {
        this._globalStateService.setSettingsSelectedRoute(name);
        // this.settingsSelectedRoute = name;
    };
    MainHeaderComponent.prototype.ngOnDestroy = function () {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    MainHeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subscriptions.push(this._globalStateService.currentRoute.subscribe(function (route) {
            // //console.log'Main Side Bar COmponent Initialized');
            _this.currentRoute = route;
        }));
    };
    MainHeaderComponent.prototype.ToogleAcceptingChatMode = function () {
        if (!this.acceptingChatMode) {
            this.fetchQueue = true;
            this.getQueuedVisitorOnAccepting.next(true);
        }
        else
            this.fetchQueue = false;
        this._chatService.ToogleChatMode(!this.acceptingChatMode);
    };
    MainHeaderComponent.prototype.updateNavBar = function () {
        this._globalStateService.ToggleNavBarState();
    };
    MainHeaderComponent.prototype.toggleNavBar = function () {
        this._globalStateService.ToggleNavBarState();
    };
    MainHeaderComponent.prototype.toggleSearch = function () {
        this.searchActive = !this.searchActive;
    };
    MainHeaderComponent.prototype.HidePopper = function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
        this.popperToolboxContent.hide();
    };
    MainHeaderComponent.prototype.seeCMID = function (ticket) {
        var res = ticket.subject.split('/');
        if (res && res.length) {
            if (res[4] && res[4].trim() == 'Beelinks' && ticket.CustomerInfo && ticket.CustomerInfo.customerId) {
                if (res[2] && res[2].toString().trim() == ticket.CustomerInfo.customerId.toString().trim()) {
                    return false;
                }
                else
                    return true;
            }
        }
        else
            return false;
    };
    MainHeaderComponent.prototype.toggleNavbarSidebar = function () {
        this._globalStateService.navbarSidebar_state.next(!this.navbarSidebar_state);
    };
    MainHeaderComponent.prototype.GetHelp = function () {
        this.msgNotification = false;
        this._helpService.OpenHelpWindow(this.helpWindowFrame);
    };
    MainHeaderComponent.prototype.searchAllTickets = function () {
        // if (this.searchValue) {
        // this.searchPopper.hide();
        // this._ticketService.Filters.next(this.ApplyFilter());
        this._ticketService.headerSearch.next(this.searchValue.trim());
        this._globalStateService.NavigateForce('/tickets/list');
        this.showPopper = false;
        this.searchContainer.nativeElement.focus();
        this.searchContainer.nativeElement.blur();
        // }
    };
    MainHeaderComponent.prototype.Blurred = function (val) {
        //console.logval);
    };
    // ApplyFilter() {
    // 	if(this.filters && this.filters.query != undefined){
    // 		this.filters.query = this.searchValue;
    // 	}else{
    // 		Object.assign(this.filters, { query: this.searchValue });
    // 	}
    // 	// let filters = {
    // 	// 	priority: [],
    // 	// 	state: [],
    // 	// 	assigned_to: [],
    // 	// 	// tags: this.selectedTags,
    // 	// 	contactNames: [],
    // 	// 	source: [],
    // 	// 	createdDate: [],
    // 	// 	group: []
    // 	// }
    // 	// let matchObject = {};
    // 	// Object.keys(filters).map(key => {
    // 	// 	// //console.logkey + ' ' + filters[key]);
    // 	// 	if (filters[key].length) {
    // 	// 		Object.assign(matchObject, { [key]: filters[key] });
    // 	// 	}
    // 	// });
    // 	// let query = this.searchValue
    // 	return this.filters;
    // }
    MainHeaderComponent.prototype.selectTicket = function (id) {
        this._globalStateService.NavigateForce('/tickets/ticket-view/' + id);
        this.searchContainer.nativeElement.focus();
        this.searchContainer.nativeElement.blur();
    };
    // hidePopper(){
    // 	//console.log'Hide Popper');
    // 	setTimeout(() => {
    // 		this.searchPopper.hide()
    // 	}, 100);
    // }
    MainHeaderComponent.prototype.inputBlur = function () {
        var _this = this;
        //if popper not clicked then blur div
        setTimeout(function () {
            if (!_this.popperClick) {
                _this.searchContainer.nativeElement.focus();
                _this.searchContainer.nativeElement.blur();
            }
        }, 200);
    };
    MainHeaderComponent.prototype.clicked = function () {
        // console.log('div clicked');
        // (this.searchContainer.nativeElement as any).focus();
    };
    MainHeaderComponent.prototype.focus = function () {
        // console.log('div focused');
    };
    MainHeaderComponent.prototype.blur = function () {
        // console.log('div blurred');
        this.showPopper = false;
        this.popperClick = false;
    };
    MainHeaderComponent.prototype.popperClicked = function (event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        // console.log('popper clicked');
        this.popperClick = true;
    };
    // blur(){
    // 	// setTimeout(() => {
    // 	// 	this.searchPopper.hide();
    // 	// }, 300);
    // }
    MainHeaderComponent.prototype.closePopper = function () {
        this.showPopper = false;
        // this.searchPopper.hide();
    };
    MainHeaderComponent.prototype.ShowPopper = function () {
        if (this.searchedTickets.length) {
            this.showPopper = true;
        }
        // this.searchPopper.show();
    };
    // hidePopper(){
    // }
    MainHeaderComponent.prototype.Disconnect = function () {
        this._socketService.TestingDisconnect();
    };
    MainHeaderComponent.prototype.Reconnect = function () {
        this._socketService.TestingReconnect();
    };
    __decorate([
        core_1.ViewChild(overlay_dialog_component_1.OverlayDialogComponent)
    ], MainHeaderComponent.prototype, "overlayRef", void 0);
    __decorate([
        core_1.ViewChild('helpFrame')
    ], MainHeaderComponent.prototype, "helpWindowFrame", void 0);
    __decorate([
        core_1.ViewChild('searchContainer')
    ], MainHeaderComponent.prototype, "searchContainer", void 0);
    __decorate([
        core_1.ViewChild('searchBox')
    ], MainHeaderComponent.prototype, "searchBox", void 0);
    __decorate([
        core_1.ViewChild('popperToolboxContent')
    ], MainHeaderComponent.prototype, "popperToolboxContent", void 0);
    MainHeaderComponent = __decorate([
        core_1.Component({
            selector: 'app-main-header',
            templateUrl: './main-header.component.html',
            styleUrls: ['./main-header.component.scss'],
            providers: [
                help_window_service_1.HelpWindowService,
                post_message_service_1.PostmessageService
            ],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], MainHeaderComponent);
    return MainHeaderComponent;
}());
exports.MainHeaderComponent = MainHeaderComponent;
//# sourceMappingURL=main-header.component.js.map