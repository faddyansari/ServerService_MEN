"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainComponent = void 0;
var core_1 = require("@angular/core");
var ContactService_1 = require("../../services/ContactService");
var TagsAutomationSettings_1 = require("../../services/LocalServices/TagsAutomationSettings");
var reciever_call_dialog_component_1 = require("../dialogs/reciever-call-dialog/reciever-call-dialog.component");
var crmService_1 = require("../../services/crmService");
var MainComponent = /** @class */ (function () {
    function MainComponent(routeService, _globalStateService, _socketService, _chatService, dialog, _callingService, _localStorageService, _authService) {
        var _this = this;
        this.routeService = routeService;
        this._globalStateService = _globalStateService;
        this._socketService = _socketService;
        this._chatService = _chatService;
        this.dialog = dialog;
        this._callingService = _callingService;
        this._localStorageService = _localStorageService;
        this._authService = _authService;
        this.subscriptions = [];
        this.timer = undefined;
        this.verified = true;
        this.drawerActive = false;
        this.drawerActive_exit = false;
        this.exit = false;
        this.navbarState = false;
        this.navbarState_exit = false;
        this.navbarSidebar_state = false;
        this.loadingRouteConfig = false;
        this.loadingNestedRouteConfig = false;
        this.fetching = true;
        this.sbt = false;
        this.autoLogout = -1;
        this.subscriptions.push(this._authService.getSettings().subscribe(function (settings) {
            if (settings)
                _this.verified = settings.verified;
            _this.fetching = false;
        }));
        this.subscriptions.push(this._authService.SBT.subscribe(function (data) {
            _this.sbt = data;
        }));
        this.subscriptions.push(_callingService.CallRecieved().subscribe(function (data) {
            if (data) {
                _this.RecieveCall();
            }
        }));
        this.subscriptions.push(this._authService.getSettings().subscribe(function (data) {
            // //console.log(data);
            if (data && data.permissions && data.permissions.agents.autoLogout) {
                _this.autoLogout = data.permissions.agents.autoLogout;
            }
        }));
        // this.subscriptions.push(_callingService.callEnd.subscribe(data => {
        // 	if (data) {
        // 		this.EndCall();
        // 	}
        // }));
        this.subscriptions.push(_globalStateService.drawerActive.subscribe(function (data) {
            _this.drawerActive = data;
        }));
        this.subscriptions.push(_globalStateService.drawerActive_exit.subscribe(function (data) {
            _this.drawerActive_exit = data;
        }));
        this.subscriptions.push(this._globalStateService.navbarState.subscribe(function (state) {
            _this.navbarState = state;
        }));
        this.subscriptions.push(this._globalStateService.loadingRouteConfig.subscribe(function (data) {
            _this.loadingRouteConfig = data;
        }));
        this.subscriptions.push(this._globalStateService.loadingNestedRouteConfig.subscribe(function (data) {
            _this.loadingNestedRouteConfig = data;
        }));
        this.subscriptions.push(this._globalStateService.navbarState_exit.subscribe(function (state) {
            _this.navbarState_exit = state;
        }));
        // this.subscriptions.push(this.keyBoardEvent.subscribe(data => {
        // 	//console.log"keyBoardEvent");
        // 	//console.logdata);
        // }));
    }
    MainComponent.prototype.ngOnInit = function () {
        var _this = this;
        // //console.log'Main component Initialized');
        this.subscriptions.push(this.routeService.getRoute().subscribe(function (observer) {
            _this.currentRoute = observer;
        }));
    };
    MainComponent.prototype.updateSideBar = function () {
        this._globalStateService.ToggleSideBarState();
    };
    MainComponent.prototype.visibilitychange = function () {
        var _this = this;
        //   console.log(document.visibilityState);
        event.preventDefault();
        if (!document.visibilityState)
            return;
        if (document.visibilityState == 'hidden' && this.autoLogout && this.autoLogout > 0) {
            this.logoutTimer = setTimeout(function () {
                _this._authService.logout();
                _this._localStorageService.setValue('logout', true);
            }, 1000 * 60 * this.autoLogout);
        }
        else if (document.visibilityState == 'visible') {
            if (this.logoutTimer)
                clearTimeout(this.logoutTimer);
        }
    };
    MainComponent.prototype.onfocus = function (event) {
        // Do something
        this.routeService.setFocusedState(true);
        this.routeService.setNotificationState(false);
        // if (this.currentRoute == '/chats') {
        // 	let currentConversation = this._chatService.getCurrentConversation().getValue();
        // 	if (currentConversation._id != undefined) {
        // 		this._chatService.setCurrentConversation(currentConversation._id);
        // 	}
        // }
    };
    MainComponent.prototype.onBlur = function (event) {
        // Do something
        this.routeService.setFocusedState(false);
        this.routeService.setNotificationState(true);
    };
    MainComponent.prototype.unloadNotification = function (event) {
        // Do something
        event.preventDefault();
        this._chatService.TypingOnReload();
    };
    MainComponent.prototype.onKeydownHandler = function (event) {
        if (event.keyCode == 74 && event.altKey && event.ctrlKey) {
            this.routeService.RequestQue();
        }
        else if (event.keyCode == 68 && event.shiftKey && event.altKey) {
            this.routeService.setSelectedThread('next');
        }
        else if (event.keyCode == 65 && event.shiftKey && event.altKey) {
            this.routeService.setSelectedThread('previous');
        }
    };
    MainComponent.prototype.onResize = function (event) {
        event.preventDefault();
        this._globalStateService.ResizeEvent(event);
    };
    // FocusIn(event: Event) {
    //   //console.log'Focus In');
    // }
    // FocusOut(event: Event) {
    //   //console.log'Focus Out');
    // }
    MainComponent.prototype.ngOnDestroy = function () {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        //console.log'Main Destroyed');
        this._socketService.Disconnect();
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    MainComponent.prototype.closeDrawerAndNavBar = function () {
        this.routeService.drawerActive.next(false);
        this._globalStateService.navbarState.next(false);
    };
    MainComponent.prototype.RecieveCall = function () {
        var _this = this;
        this.subscriptions.push(this.dialog.open(reciever_call_dialog_component_1.RecieverCallDialogComponent, {
            panelClass: ['calling-dialog'],
            disableClose: true,
            autoFocus: true
        }).afterClosed().subscribe(function (data) {
            _this._callingService.EndCall();
        }));
    };
    __decorate([
        core_1.HostListener('document:visibilitychange', ['$event'])
    ], MainComponent.prototype, "visibilitychange", null);
    __decorate([
        core_1.HostListener('window:focus', ['$event'])
    ], MainComponent.prototype, "onfocus", null);
    __decorate([
        core_1.HostListener('window:blur', ['$event'])
    ], MainComponent.prototype, "onBlur", null);
    __decorate([
        core_1.HostListener('window:beforeunload', ['$event'])
    ], MainComponent.prototype, "unloadNotification", null);
    __decorate([
        core_1.HostListener('window:keydown', ['$event'])
    ], MainComponent.prototype, "onKeydownHandler", null);
    __decorate([
        core_1.HostListener('window:resize', ['$event'])
    ], MainComponent.prototype, "onResize", null);
    MainComponent = __decorate([
        core_1.Component({
            selector: 'main',
            templateUrl: './main.component.html',
            styleUrls: ['./main.component.scss'],
            providers: [
                ContactService_1.Contactservice,
                TagsAutomationSettings_1.TagsAutomationSettings,
                ContactService_1.Contactservice,
                crmService_1.CRMService
            ],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], MainComponent);
    return MainComponent;
}());
exports.MainComponent = MainComponent;
//# sourceMappingURL=main.component.js.map