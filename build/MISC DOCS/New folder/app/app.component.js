"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppComponent = void 0;
//Angular Import
var core_1 = require("@angular/core");
var Highcharts = require("highcharts/highcharts");
var AppComponent = /** @class */ (function () {
    function AppComponent(_applicationStateService, _authService, _titleService) {
        var _this = this;
        this._applicationStateService = _applicationStateService;
        this._authService = _authService;
        this._titleService = _titleService;
        this.Highcharts = Highcharts;
        this.tabID = undefined;
        this.navbarSidebar_state = true;
        //#endregion
        this.title = 'app';
        //Derived From Auth Service
        this.login = false;
        //Derived From Global State Service
        //Maintaining Application State
        this.state = 'login';
        this.agentModal = false;
        this.currentRoute = '/home';
        //SideBar State
        this.sidebarstate = true;
        this.controlsidebarstate = true;
        this.loadingRouteConfig = false;
        this.loadingNestedRouteConfig = false;
        this.showChatBar = false;
        this.chatBarEnabled = false;
        _authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) {
                _this.permissions = data.permissions.chats;
            }
        });
        _applicationStateService.title.subscribe(function (data) {
            _this._titleService.setTitle(data);
        });
        _applicationStateService.getDisplayReady().subscribe(function (data) {
            _this.display = data;
        });
        this._applicationStateService.loadingRouteConfig.subscribe(function (data) {
            if (!data) {
                setTimeout(function () {
                    _this.loadingRouteConfig = data;
                }, 2000);
            }
            else {
                _this.loadingRouteConfig = data;
            }
        });
        this._applicationStateService.loadingNestedRouteConfig.subscribe(function (data) {
            if (!data) {
                setTimeout(function () {
                    _this.loadingNestedRouteConfig = data;
                }, 2000);
            }
            else {
                _this.loadingNestedRouteConfig = data;
            }
        });
        _authService.CheckLogin();
        _authService.isLoggedin().subscribe(function (data) {
            _this.login = data;
        });
        this._applicationStateService.state.subscribe(function (data) {
            _this.state = data;
        });
        this._applicationStateService.currentRoute.subscribe(function (data) {
            _this.currentRoute = data;
        });
        this._applicationStateService.navbarSidebar_state.subscribe(function (state) {
            _this.navbarSidebar_state = state;
        });
        _applicationStateService.currentRoute.subscribe(function (data) {
            _this.currentRoute = data;
        });
        _applicationStateService.sidebarState.subscribe(function (data) {
            _this.sidebarstate = data;
        });
        _applicationStateService.controlSidebarState.subscribe(function (data) {
            _this.controlsidebarstate = data;
        });
        _applicationStateService.chatBarEnabled.subscribe(function (data) {
            setTimeout(function () {
                _this.chatBarEnabled = data;
            }, 0);
        });
        _applicationStateService.showChatBar.subscribe(function (data) {
            _this.showChatBar = data;
        });
    }
    //#region Global Events
    AppComponent.prototype.onKeydownHandler = function (event) {
        if (event.ctrlKey == true) {
            // 107 Num Key  +
            // 109 Num Key  -
            // 173 Min Key  hyphen/underscor Hey
            // 61 Plus key  +/=
            switch (event.keyCode.toString()) {
                case '61':
                case '107':
                case '173':
                case '109':
                case '187':
                case '189':
                    event.preventDefault();
                    break;
            }
        }
    };
    AppComponent.prototype.PreventZooming = function (event) {
        if (event.ctrlKey == true) {
            event.preventDefault();
        }
    };
    AppComponent.prototype.ngOnInit = function () {
    };
    AppComponent.prototype.ngAfterViewChecked = function () {
        //Called after every check of the component's view. Applies to components only.
        //Add 'implements AfterViewChecked' to the class.
    };
    AppComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this._applicationStateService.agentModal.throttleTime(200).subscribe(function (data) {
            _this.agentModal = data;
        });
        setTimeout(function () {
            var loader = document.getElementById('loader');
            if (loader) {
                loader.classList.remove('fadeIn');
                loader.classList.add('fadeOut');
            }
        }, 0);
    };
    // velocity({ translateY: 125 }, 1150, [ 6 ]);
    AppComponent.prototype.subcribeModal = function () {
        var _this = this;
        this._applicationStateService.agentModal.subscribe(function (data) {
            _this.agentModal = data;
        });
    };
    AppComponent.prototype.ngOnDestroy = function () { };
    __decorate([
        core_1.HostListener('document:keydown', ['$event'])
    ], AppComponent.prototype, "onKeydownHandler", null);
    __decorate([
        core_1.HostListener('window:mousewheel', ['$event']),
        core_1.HostListener('window:DOMMouseScroll', ['$event'])
    ], AppComponent.prototype, "PreventZooming", null);
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map