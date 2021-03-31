"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalStateService = void 0;
var core_1 = require("@angular/core");
require("rxjs/add/operator/map");
require("rxjs/add/operator/filter");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var router_1 = require("@angular/router");
var Subject_1 = require("rxjs/Subject");
//End RxJs Imports
var GlobalStateService = /** @class */ (function () {
    // breadCrumbLink: BehaviorSubject<string> = new BehaviorSubject('');
    // Subscribing Observable of Router event of NavigationStart
    // Upon New Subscription assigning New value to Current Route Behaviour
    // This BheaviourSubject will be Subscribed to any component via shared Observable Service to take action upon
    function GlobalStateService(http, _router, _titleService) {
        var _this = this;
        this.http = http;
        this._router = _router;
        this._titleService = _titleService;
        this.sbt = true;
        this.titleString = (this.sbt) ? 'SBT | Live Chat Platform' : 'Beelinks | Innovative Live Chat Platform';
        this.currentRoute = new BehaviorSubject_1.BehaviorSubject('');
        this.agentModal = new BehaviorSubject_1.BehaviorSubject(false);
        this.state = new BehaviorSubject_1.BehaviorSubject('login');
        this.sidebarState = new BehaviorSubject_1.BehaviorSubject(true);
        this.navbarState = new BehaviorSubject_1.BehaviorSubject(false);
        this.navbarState_exit = new BehaviorSubject_1.BehaviorSubject(false);
        this.controlSidebarState = new BehaviorSubject_1.BehaviorSubject(true);
        this.title = new BehaviorSubject_1.BehaviorSubject((this.sbt) ? 'SBT | Live Chat Platform' : 'Beelinks | Innovative Live Chat Platform');
        this.windowFocused = new BehaviorSubject_1.BehaviorSubject(false);
        this.showNotification = new BehaviorSubject_1.BehaviorSubject(false);
        this.canAccessTicketView = new BehaviorSubject_1.BehaviorSubject(false);
        this.displayReady = new BehaviorSubject_1.BehaviorSubject(false);
        this.ismobile = new BehaviorSubject_1.BehaviorSubject(false);
        this.copyrightYear = new BehaviorSubject_1.BehaviorSubject((new Date).getFullYear().toString());
        this.drawerActive = new BehaviorSubject_1.BehaviorSubject(false);
        this.drawerActive_exit = new BehaviorSubject_1.BehaviorSubject(false);
        this.navbarSidebar_state = new BehaviorSubject_1.BehaviorSubject(false);
        this.accessRoute = new BehaviorSubject_1.BehaviorSubject('');
        this.accessSet = new BehaviorSubject_1.BehaviorSubject(false);
        this.showChatBar = new BehaviorSubject_1.BehaviorSubject(false);
        this.chatBarEnabled = new BehaviorSubject_1.BehaviorSubject(true);
        this.loadingRouteConfig = new BehaviorSubject_1.BehaviorSubject(false);
        this.loadingNestedRouteConfig = new BehaviorSubject_1.BehaviorSubject(false);
        this.loadingRouteConfigEnabled = true;
        this.loadingNestedRouteConfigEnabled = true;
        //KeyBoard Shortcuts
        this.shortcutEvents = new Subject_1.Subject();
        //Main Guards
        this.canAccessDashboard = new BehaviorSubject_1.BehaviorSubject(true);
        this.canAccessChats = new BehaviorSubject_1.BehaviorSubject(true);
        this.canAccessTickets = new BehaviorSubject_1.BehaviorSubject(true);
        this.canAccessVisitors = new BehaviorSubject_1.BehaviorSubject(true);
        this.canAccessSettings = new BehaviorSubject_1.BehaviorSubject(true);
        this.canAccessAgents = new BehaviorSubject_1.BehaviorSubject(true);
        this.canAccessAnalytics = new BehaviorSubject_1.BehaviorSubject(true);
        this.canAccessContacts = new BehaviorSubject_1.BehaviorSubject(false);
        this.canAccessInstallation = new BehaviorSubject_1.BehaviorSubject(true);
        this.canAccessCRM = new BehaviorSubject_1.BehaviorSubject(true);
        this.canAccessPageNotFound = new BehaviorSubject_1.BehaviorSubject(false);
        //Settings Guards
        this.canAccessAllSettings = new BehaviorSubject_1.BehaviorSubject(false);
        this.canAccessAutomatedResponses = new BehaviorSubject_1.BehaviorSubject(false);
        this.canAccessFormDesigner = new BehaviorSubject_1.BehaviorSubject(false);
        this.canAccessTicketManagementSettings = new BehaviorSubject_1.BehaviorSubject(false);
        this.canAccessTemplateDesignSettings = new BehaviorSubject_1.BehaviorSubject(false);
        this.canAccessChatAndTimeoutSettings = new BehaviorSubject_1.BehaviorSubject(false);
        this.canAccessContactSettings = new BehaviorSubject_1.BehaviorSubject(false);
        this.canAccessCallSettings = new BehaviorSubject_1.BehaviorSubject(false);
        this.canAccessChatWindowSettings = new BehaviorSubject_1.BehaviorSubject(false);
        this.canAccessChatAssistantSettings = new BehaviorSubject_1.BehaviorSubject(false);
        this.canAccessWebhookSettings = new BehaviorSubject_1.BehaviorSubject(false);
        this.canAccessKnowledgeBaseSettings = new BehaviorSubject_1.BehaviorSubject(false);
        this.canAccessWidgetMarketingSettings = new BehaviorSubject_1.BehaviorSubject(false);
        this.canAccessIntegerationsSettings = new BehaviorSubject_1.BehaviorSubject(false);
        this.canAccessGroupManagementSettings = new BehaviorSubject_1.BehaviorSubject(false);
        this.canAccessKeyboardShortcutsSettings = new BehaviorSubject_1.BehaviorSubject(false);
        this.canAccessProfileSettings = new BehaviorSubject_1.BehaviorSubject(false);
        this.canAccessWhatsApp = new BehaviorSubject_1.BehaviorSubject(true);
        // canAccessBulkMarketingEmail: BehaviorSubject<boolean> = new BehaviorSubject(false);
        this.contentInfo = new BehaviorSubject_1.BehaviorSubject('');
        this.breadCrumbTitle = new BehaviorSubject_1.BehaviorSubject('');
        this.showSettingsMenu = new BehaviorSubject_1.BehaviorSubject(false);
        this.showPopper = new BehaviorSubject_1.BehaviorSubject(false);
        this.settingsSelectedRoute = new BehaviorSubject_1.BehaviorSubject('general');
        this.redirectURL = new BehaviorSubject_1.BehaviorSubject('');
        this.requestQue = new Subject_1.Subject();
        //resize Event
        this.resizeEvent = new Subject_1.Subject();
        //ThreadSelection
        this.selectingThread = new Subject_1.Subject();
        _router.events
            .filter(function (event) { return event instanceof router_1.NavigationEnd; })
            .subscribe(function (event) {
            _this.currentRoute.next(event.url);
        });
        _router.events
            .filter(function (event) { return event instanceof router_1.NavigationStart; })
            .subscribe(function (event) {
            // console.log(event.url);
            if (event.url != '/') {
                localStorage.setItem('redirectURL', event.url);
            }
            _this.accessRoute.next(event.url);
            // this.currentRoute.next(event.url);
            // console.log(event.url.match(/\//g).length > 1);
            if (event.url && event.url.match(/\//g).length > 1) {
                _this.loadingNestedRouteConfigEnabled = true;
                _this.loadingRouteConfigEnabled = false;
            }
            else if (event.url && event.url.match(/\//g).length == 1) {
                _this.loadingRouteConfigEnabled = true;
                _this.loadingNestedRouteConfigEnabled = false;
            }
            //   console.log(event.url);
        });
        _router.events.subscribe(function (event) {
            if (event instanceof router_1.RouteConfigLoadStart) {
                // console.log('Route Config Start');
                // console.log(this.currentRoute.getValue());
                // console.log(this.currentRoute.getValue().match(/\//g).length);
                if (_this.loadingNestedRouteConfigEnabled) {
                    _this.loadingNestedRouteConfig.next(true);
                    _this.loadingRouteConfig.next(false);
                }
                if (_this.loadingRouteConfigEnabled) {
                    _this.loadingRouteConfig.next(true);
                }
                // console.log(this.loadingNestedRouteConfig.getValue());
            }
            else if (event instanceof router_1.RouteConfigLoadEnd) {
                _this.loadingRouteConfig.next(false);
                _this.loadingNestedRouteConfig.next(false);
                // this.showSettingsMenu.next(false);
            }
        });
        this.ismobile.next((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1));
    }
    GlobalStateService.prototype.getIsMobile = function () {
        return this.ismobile.asObservable();
    };
    GlobalStateService.prototype.getCopyrightYear = function () {
        return this.copyrightYear.asObservable();
    };
    GlobalStateService.prototype.isMobileDevice = function () {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    };
    ;
    GlobalStateService.prototype.getDisplayReady = function () {
        return this.displayReady.asObservable();
    };
    GlobalStateService.prototype.setDisplayReady = function (state) {
        this.displayReady.next(state);
    };
    GlobalStateService.prototype.getRoute = function () {
        return this.currentRoute.asObservable();
    };
    GlobalStateService.prototype.showAgentModal = function (data) {
        this.agentModal.next(data);
    };
    GlobalStateService.prototype.setState = function (data) {
        this.state.next(data);
    };
    GlobalStateService.prototype.Successfull = function (route) {
        this.currentRoute.next(route);
    };
    GlobalStateService.prototype.ToggleSideBarState = function () {
        this.sidebarState.next(!(this.sidebarState.getValue()));
    };
    GlobalStateService.prototype.ToggleNavBarState = function () {
        this.navbarState.next(!(this.navbarState.getValue()));
        this.navbarState_exit.next(true);
    };
    GlobalStateService.prototype.ToggleControlSideBarState = function () {
        this.controlSidebarState.next(!(this.controlSidebarState.getValue()));
    };
    GlobalStateService.prototype.ToggleDrawer = function () {
        this.drawerActive.next(!(this.drawerActive.getValue()));
        this.drawerActive_exit.next(true);
    };
    GlobalStateService.prototype.CloseControlSideBar = function () {
        this.controlSidebarState.next(true);
    };
    GlobalStateService.prototype.OpenControlSideBar = function () {
        this.controlSidebarState.next(false);
    };
    GlobalStateService.prototype.SetTitle = function (notificationCount) {
        if (notificationCount > 0) {
            this.title.next('(' + notificationCount + ') ' + this.titleString);
        }
        else {
            this.title.next(this.titleString);
        }
    };
    GlobalStateService.prototype.getTitle = function () {
        return this.title.asObservable();
    };
    GlobalStateService.prototype.getFocusedState = function () {
        return this.windowFocused.asObservable();
    };
    GlobalStateService.prototype.setFocusedState = function (state) {
        this.windowFocused.next(state);
    };
    GlobalStateService.prototype.getNotificationState = function () {
        return this.showNotification.asObservable();
    };
    GlobalStateService.prototype.setNotificationState = function (state) {
        this.showNotification.next(state);
    };
    GlobalStateService.prototype.setTicketViewAccess = function (permission) {
        this.canAccessTicketView.next(permission);
    };
    GlobalStateService.prototype.getTicketViewAccess = function () {
        return this.canAccessTicketView.getValue();
    };
    GlobalStateService.prototype.NavigateTo = function (route) {
        this._router.navigate([route]);
    };
    GlobalStateService.prototype.NavigateForce = function (route) {
        this._router.navigateByUrl(route);
    };
    GlobalStateService.prototype.setPopper = function (value) {
        this.showPopper.next(value);
    };
    //Guards
    //Setters
    GlobalStateService.prototype.setRouteAccess = function () {
        this.canAccessDashboard.next(true);
        this.canAccessChats.next(true);
        this.canAccessTickets.next(true);
        this.canAccessVisitors.next(true);
        this.canAccessSettings.next(true);
        this.canAccessAllSettings.next(true);
        this.canAccessAgents.next(true);
        this.canAccessInstallation.next(true);
        this.canAccessCRM.next(true);
        this.canAccessAnalytics.next(true);
        this.accessSet.next(true);
    };
    GlobalStateService.prototype.toggleSettingsMenu = function () {
        this.showSettingsMenu.next(!this.showSettingsMenu.getValue());
    };
    GlobalStateService.prototype.setSettingsMenu = function (value) {
        this.showSettingsMenu.next(value);
    };
    GlobalStateService.prototype.setSettingsSelectedRoute = function (value) {
        this.settingsSelectedRoute.next(value);
    };
    GlobalStateService.prototype.setContactRouteAccess = function (nsp) {
        if (nsp == '/sps-uat' || nsp == '/hrm.sbtjapan.com' || nsp == '/localhost.com') {
            this.canAccessContacts.next(true);
        }
        else {
            this.canAccessContacts.next(false);
        }
    };
    GlobalStateService.prototype.toggleChatBar = function () {
        this.showChatBar.next(!this.showChatBar.getValue());
    };
    GlobalStateService.prototype.setChatBar = function (value) {
        this.showChatBar.next(value);
    };
    GlobalStateService.prototype.displayChatBar = function (value) {
        this.chatBarEnabled.next(value);
    };
    GlobalStateService.prototype.setSelectedThread = function (value) {
        this.shortcutEvents.next(value);
    };
    GlobalStateService.prototype.ResizeEvent = function (event) {
        if (event.target) {
            if (event.target.innerWidth <= 1024) {
                this.resizeEvent.next(false);
            }
            else if (event.target.innerWidth > 1024) {
                this.resizeEvent.next(true);
            }
            else
                this.resizeEvent.next(true);
        }
    };
    GlobalStateService.prototype.RequestQue = function () {
        this.requestQue.next(true);
    };
    GlobalStateService = __decorate([
        core_1.Injectable()
    ], GlobalStateService);
    return GlobalStateService;
}());
exports.GlobalStateService = GlobalStateService;
//# sourceMappingURL=GlobalStateService.js.map