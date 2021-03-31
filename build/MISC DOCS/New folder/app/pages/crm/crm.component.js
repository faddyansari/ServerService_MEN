"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmComponent = void 0;
var core_1 = require("@angular/core");
var CrmComponent = /** @class */ (function () {
    // flags = [true, false, false, false];
    //hideConversation: boolean = true
    function CrmComponent(_appStateService, _crmService, _authService, _uploadingService, _router, dialog, snackBar, _callingService, _settingService) {
        var _this = this;
        this._appStateService = _appStateService;
        this._crmService = _crmService;
        this._authService = _authService;
        this._uploadingService = _uploadingService;
        this._router = _router;
        this.dialog = dialog;
        this.snackBar = snackBar;
        this._callingService = _callingService;
        this._settingService = _settingService;
        this.edit = false;
        this.subscription = [];
        // private loadingAgents: BehaviorSubject<boolean> = new BehaviorSubject(true);
        this.selectedCustomer = {};
        //To Show Requesting Status
        this.loading = false;
        this.initiateChat = true;
        // showCustomerInfo: any;
        this.showCustomerInfo = false;
        this.sessionLog = false;
        this.isStatActive = false;
        this.verified = true;
        this.sbt = false;
        this.selectedSession = undefined;
        this.pills = {
            'profile': true,
            'stats': false,
            'conversations': false,
            'activity': false
        };
        this.package = undefined;
        this.subscription.push(_authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg.contacts;
                if (!_this.package.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
        }));
        this.subscription.push(_authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
            // //console.log(agent);
        }));
        this.subscription.push(_authService.SBT.subscribe(function (data) {
            _this.sbt = data;
        }));
        this.subscription.push(_crmService.viewingConversation.subscribe(function (view) {
            _this.viewingConversation = view;
            // //console.log(agent);
        }));
        this.subscription.push(_crmService.isStatActive.subscribe(function (view) {
            _this.isStatActive = view;
            // //console.log(agent);
        }));
        this.subscription.push(_crmService.showCustomerInfo.subscribe(function (data) {
            _this.showCustomerInfo = data;
        }));
        this.subscription.push(_crmService.selectedCustomer.subscribe(function (data) {
            ////console.log(data)
            if (data)
                _this.selectedCustomer = data;
            if (data.sessionInfo)
                _this.selectedCustomer.sessionInfo = data.sessionInfo;
            // //console.log(this.selectedCustomer.sessionInfo);
        }));
        this.subscription.push(_crmService.selectedCustomerConversation.subscribe(function (data) {
            ////console.log(data);
            if (data)
                _this.selectedCustomerConversation = data;
        }));
        this.subscription.push(this._authService.getSettings().subscribe(function (settings) {
            if (settings && Object.keys(settings).length)
                _this.verified = settings.verified;
        }));
        this.subscription.push(_crmService.isStatActive.subscribe(function (data) {
            _this.isStatActive = data;
        }));
        this.subscription.push(_crmService.getSelectedSessionDetails().subscribe(function (session) {
            ////console.log(session);        
            _this.selectedSession = session;
        }));
        this.subscription.push(this._appStateService.shortcutEvents.subscribe(function (data) {
            _this._crmService.SelectCustomer(data);
        }));
    }
    CrmComponent.prototype.ngOnDestroy = function () {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this.subscription.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this._crmService.setSelectedCustomer();
        this._appStateService.CloseControlSideBar();
    };
    CrmComponent.prototype.NumbersOnly = function (event) {
        var pattern = /[0-9\-]+/;
        var inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    };
    CrmComponent.prototype.toggleActivityLog = function () {
        if (this.sessionLog) {
            this.sessionLog = false;
        }
        else {
            this.sessionLog = true;
        }
    };
    CrmComponent.prototype.ToggleStats = function () {
        this._crmService.ToggleStats();
    };
    CrmComponent.prototype.setStatsStatus = function (value) {
        this._crmService.setStatsStatus(value);
    };
    // ToggleOptions(value) {
    //     // this.isStatActive = !this.isStatActive;
    //     // if (!Object.keys(this.selectedCustomerConversation).length) {
    //     //     this._crmService.showOrHideConversation();
    //     // } else {
    //     //     if (this.selectedCustomerConversation && this.selectedCustomerConversation._id) {
    //     //         this._crmService.ToggleSelfViewingChat(this.selectedCustomerConversation._id);
    //     //     }
    //     // }
    //     // //console.log(value)
    //     this.flags.forEach((option, index) => {
    //         if (index == value) this.flags[value] = true;
    //         else this.flags[index] = false
    //     });
    //     ////console.log(this.flags)
    // }
    CrmComponent.prototype.toggleCustomerAccessInfo = function () {
        this._crmService.toggleCustomerAccessInformation(!this.showCustomerInfo);
        // this._crmService.toggleCustomerAccessInformation();
    };
    CrmComponent.prototype.getKeys = function (obj) {
        return Object.keys(obj);
    };
    CrmComponent.prototype.setPillActive = function (pill) {
        var _this = this;
        Object.keys(this.pills).map(function (key) {
            if (key == pill) {
                _this.pills[key] = true;
            }
            else {
                _this.pills[key] = false;
            }
        });
    };
    CrmComponent.prototype.GetSessionDetais = function (session) {
        var _this = this;
        if (session && !session.sessionDetails) {
            ////console.log("Fetching session details from server");
            this._crmService.GetSessionDetails(session).subscribe(function (data) {
                _this._crmService.selectedCustomer.getValue().sessionInfo.map(function (sess) {
                    if (sess._id == session._id) {
                        sess.sessionDetails = data[0];
                        _this._crmService.setSelectedSessionDetails(data[0]);
                    }
                    return sess;
                });
                _this._crmService.selectedCustomer.next(_this._crmService.selectedCustomer.getValue());
            });
        }
        else {
            // //console.log("Loading session details from client");
            this._crmService.setSelectedSessionDetails(session.sessionDetails);
        }
    };
    __decorate([
        core_1.ViewChild('fileInput')
    ], CrmComponent.prototype, "fileInput", void 0);
    CrmComponent = __decorate([
        core_1.Component({
            selector: 'app-crm',
            templateUrl: './crm.component.html',
            styleUrls: ['./crm.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], CrmComponent);
    return CrmComponent;
}());
exports.CrmComponent = CrmComponent;
//# sourceMappingURL=crm.component.js.map