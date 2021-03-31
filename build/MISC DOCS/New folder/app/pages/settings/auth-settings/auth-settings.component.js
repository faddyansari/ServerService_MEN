"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSettingsComponent = void 0;
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var Observable_1 = require("rxjs/Observable");
var AuthSettingsComponent = /** @class */ (function () {
    function AuthSettingsComponent(_authService, _utilityService, _permissionService, _appStateService) {
        var _this = this;
        this._authService = _authService;
        this._utilityService = _utilityService;
        this._permissionService = _permissionService;
        this._appStateService = _appStateService;
        this.scrollHeight = 0;
        // Agent : any;
        this.showIPAddForm = false;
        this.ipInput = '';
        this.subscriptions = [];
        this.showError = '';
        this.IPRegex = /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/;
        this.roles = [];
        this.agentList = [];
        this.agentList_original = [];
        this.selectedAgents = [];
        this.dropDown_typeahead = '';
        this.searchInput = new Subject_1.Subject();
        this.ended = false;
        this.loadingMoreAgents = false;
        this.showNoAgents = false;
        this.allowedIpsForm = false;
        this.suppressionForm = false;
        this.roleSearchValue = '';
        this.IPSearchValue = '';
        this.suppressValue = '';
        _appStateService.breadCrumbTitle.next('Authentication Settings');
        // this.subscriptions.push(_authService.getAgent().subscribe(agent => {
        // 	if(agent){
        // 		this.Agent = agent;
        // 	}
        // }))
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            // console.log(data);
            if (pkg) {
                _this.package = pkg.security;
                if (!_this.package.authsettings.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
        }));
        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(function (agents) {
            if (agents) {
                _this.agentList = agents;
                _this.agentList_original = agents;
            }
            // console.log(this.agentList);
        }));
        this.subscriptions.push(_authService.getSettings().subscribe(function (settings) {
            if (settings && settings.permissions.authentication) {
                _this.authSettings = settings.permissions.authentication;
                _this.roles = settings.permissions.settings.rolesAndPermissions.canView;
                _this.roles.forEach(function (role) {
                    // console.log(this.authSettings[role]);
                });
                // console.log(this.authSettings);
                // console.log(this.roles);
            }
            // console.log(settings);
        }));
        this.searchInput
            .map(function (event) { return event; })
            .debounceTime(500)
            .switchMap(function () {
            return new Observable_1.Observable(function (observer) {
                // console.log('search');
                if (_this.dropDown_typeahead) {
                    var agents_1 = _this.agentList_original.filter(function (a) { return a.email.includes(_this.dropDown_typeahead.toLowerCase()); });
                    _this._utilityService.SearchAgent(_this.dropDown_typeahead).subscribe(function (response) {
                        //console.log(response);
                        if (response && response.agentList.length) {
                            response.agentList.forEach(function (element) {
                                if (!agents_1.filter(function (a) { return a.email == element.email; }).length) {
                                    agents_1.push(element);
                                }
                            });
                        }
                        _this.agentList = agents_1;
                    });
                    // this.agentList = agents;
                }
                else {
                    _this.agentList = _this.agentList_original;
                    // this.setScrollEvent();
                }
            });
        }).subscribe();
    }
    AuthSettingsComponent.prototype.ngOnInit = function () {
    };
    AuthSettingsComponent.prototype.ngAfterViewInit = function () {
        this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
    };
    AuthSettingsComponent.prototype.roleSelected = function (role) {
        // console.log(role);
    };
    AuthSettingsComponent.prototype.clearAgent = function (event, email) {
        var _this = this;
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.agentList.map(function (a) {
            if (a.email == email) {
                a.selected = false;
                return a;
            }
        });
        this.selectedAgents.map(function (agent, index) {
            if (agent == email) {
                _this.selectedAgents.splice(index, 1);
            }
        });
        if (this.agentList.filter(function (a) { return a.selected; }).length == this.agentList.length) {
            // console.log('no agents');
            this.showNoAgents = true;
        }
        else {
            this.showNoAgents = false;
        }
        // this._permissionService.removeAgentFromSuppresionList(email);
    };
    AuthSettingsComponent.prototype.clearAllAgents = function (event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.selectedAgents = [];
        this.agentList.map(function (a) {
            a.selected = false;
            return a;
        });
        if (this.agentList.filter(function (a) { return a.selected; }).length == this.agentList.length) {
            // console.log('no agents');
            this.showNoAgents = true;
        }
        else {
            this.showNoAgents = false;
        }
    };
    AuthSettingsComponent.prototype.onItemSelect_dropdown = function (email) {
        if (!this.selectedAgents.includes(email))
            this.selectedAgents.push(email);
        this.agentList.map(function (a) {
            if (a.email == email) {
                a.selected = true;
                return a;
            }
        });
        if (this.agentList.filter(function (a) { return a.selected; }).length == this.agentList.length) {
            // console.log('no agents');
            this.showNoAgents = true;
        }
        else {
            this.showNoAgents = false;
        }
    };
    AuthSettingsComponent.prototype.ToggleAllowedIpsForm = function () {
        this.allowedIpsForm = !this.allowedIpsForm;
    };
    AuthSettingsComponent.prototype.ToggleSuppressionForm = function () {
        this.suppressionForm = !this.suppressionForm;
    };
    //Scroll events
    AuthSettingsComponent.prototype.onScroll = function ($event) {
        var _this = this;
        if (Math.round(event.target.scrollTop + event.target.clientHeight) >= (this.scrollContainer.nativeElement.scrollHeight - 10)) {
            console.log('Scroll');
            if (!this.ended && !this.loadingMoreAgents) {
                console.log('Fetch More');
                this.loadingMoreAgents = true;
                this._utilityService.getMoreAgentsObs(this.agentList[this.agentList.length - 1].first_name).subscribe(function (response) {
                    console.log(response);
                    _this.agentList = _this.agentList.concat(response.agents);
                    _this.ended = response.ended;
                    _this.loadingMoreAgents = false;
                });
            }
        }
        this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
    };
    AuthSettingsComponent.prototype.addIP = function () {
        var _this = this;
        if (this.IPRegex.test(this.ipInput)) {
            if (!this.authSettings.allowedIPs.filter(function (ip) { return ip == _this.ipInput; }).length) {
                this._permissionService.addIP(this.ipInput).subscribe(function (status) {
                    if (status == 'ok') {
                        _this.ipInput = '';
                    }
                });
            }
            else {
                this.showError = 'IP address already exists';
                setTimeout(function () {
                    _this.showError = '';
                }, 2000);
            }
        }
        else {
            this.showError = 'Invalid IP Address';
            setTimeout(function () {
                _this.showError = '';
            }, 2000);
        }
    };
    AuthSettingsComponent.prototype.setSuppressionList = function () {
        var _this = this;
        var agents = this.authSettings.suppressionList.concat(this.selectedAgents);
        this._permissionService.setSuppressionList(agents.filter(function (item, i, ar) { return ar.indexOf(item) === i; })).subscribe(function (status) {
            if (status == 'ok') {
                _this.selectedAgents = [];
                _this.suppressionForm = false;
            }
        });
    };
    AuthSettingsComponent.prototype.removeAgent = function (email) {
        var _this = this;
        this.agentList.map(function (a) {
            if (a.email == email) {
                a.selected = false;
                return a;
            }
        });
        this.selectedAgents.map(function (agent, index) {
            if (agent == email) {
                _this.selectedAgents.splice(index, 1);
            }
        });
        if (this.agentList.filter(function (a) { return a.selected; }).length == this.agentList.length) {
            // console.log('no agents');
            this.showNoAgents = true;
        }
        else {
            this.showNoAgents = false;
        }
        this._permissionService.removeAgentFromSuppresionList(email);
    };
    AuthSettingsComponent.prototype.enterPressed = function (event) {
        if (event.keyCode == 13) {
            this.addIP();
        }
    };
    AuthSettingsComponent.prototype.removeIP = function (ip) {
        this._permissionService.removeIP(ip);
    };
    // toggle(value) {
    // 	this._permissionService.ToggleAuthPermission(value);
    // }
    AuthSettingsComponent.prototype.toggleSSO = function (role, value) {
        this._permissionService.ToggleAuthPermission(role, value);
        // console.log(this.authSettings);	
    };
    AuthSettingsComponent.prototype.toggleForgotPassword = function (value) {
        this._permissionService.ToggleForgotPassPermission(value);
        // console.log(this.authSettings);	
    };
    AuthSettingsComponent.prototype.toggle2FA = function (role, value) {
        this._permissionService.Toggle2FAPermission(role, value);
        // console.log(this.authSettings);	
    };
    AuthSettingsComponent.prototype.ShowIpAddForm = function () {
        this.showIPAddForm = !this.showIPAddForm;
    };
    // preventInvalid(e) {
    // 	e.preventDefault();
    // 	return this.validateIP(e.target.value + String.fromCharCode(e.which));
    // }
    // validateIP(ip) {
    // 	var splitted = ip.split(".");
    // 	var nb = splitted.length;
    // 	if (nb > 4) return false;
    // 	if (splitted[nb - 2] == "") return false;
    // 	if (splitted[nb - 1] == "") return true;
    // 	if (nb < 4) {
    // 	  return this.first3BytesRg.test(splitted[nb - 1]);
    // 	}
    // 	return this.fourthByteRg.test(splitted[nb - 1]);
    //   }
    AuthSettingsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    __decorate([
        core_1.ViewChild('scrollContainer')
    ], AuthSettingsComponent.prototype, "scrollContainer", void 0);
    AuthSettingsComponent = __decorate([
        core_1.Component({
            selector: 'app-auth-settings',
            templateUrl: './auth-settings.component.html',
            styleUrls: ['./auth-settings.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AuthSettingsComponent);
    return AuthSettingsComponent;
}());
exports.AuthSettingsComponent = AuthSettingsComponent;
//# sourceMappingURL=auth-settings.component.js.map