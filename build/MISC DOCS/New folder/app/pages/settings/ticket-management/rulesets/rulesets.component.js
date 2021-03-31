"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesetsComponent = void 0;
var core_1 = require("@angular/core");
var RulesetsService_1 = require("../../../../../services/LocalServices/RulesetsService");
var RulesetsComponent = /** @class */ (function () {
    function RulesetsComponent(_ruleSetService, _appStateService, _authService) {
        var _this = this;
        this._ruleSetService = _ruleSetService;
        this._appStateService = _appStateService;
        this._authService = _authService;
        this.subscriptions = [];
        this.addRule = false;
        this.SelectedRule = undefined;
        this.Agent = undefined;
        this.newObject = undefined;
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Ticket Management');
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            if (pkg) {
                _this.package = pkg.tickets.rulesets;
                if (!_this.package.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
            // console.log(agent);
        }));
        this.subscriptions.push(this._ruleSetService.Addrule.subscribe(function (value) {
            _this.addRule = value;
        }));
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) {
                _this.rulesetPermissions = data.permissions.settings.ticketManagement.rulesetSettings;
            }
        }));
        this.subscriptions.push(this._ruleSetService.SelectedRule.subscribe(function (value) {
            _this.SelectedRule = value;
        }));
        this.Agent = this._ruleSetService.Agent;
        this.newObject = {
            name: '',
            nsp: this.Agent.nsp,
            isActive: false,
            operator: 'or',
            conditions: [{ key: '', matchingCriterea: '', regex: new RegExp(/\s/, 'gmi'), keywords: [] }],
            actions: [{ name: '', value: '' }],
            lastmodified: { date: new Date().toISOString(), by: this.Agent.email },
        };
    }
    RulesetsComponent.prototype.ngOnInit = function () {
    };
    RulesetsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
        // this._ruleSetService.Destroy();
    };
    RulesetsComponent.prototype.AddRule = function () {
        this._ruleSetService.Addrule.next(true);
    };
    RulesetsComponent.prototype.CancelAddRule = function () {
        this._ruleSetService.Addrule.next(false);
    };
    RulesetsComponent = __decorate([
        core_1.Component({
            selector: 'app-rulesets',
            templateUrl: './rulesets.component.html',
            styleUrls: ['./rulesets.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: [
                RulesetsService_1.RulesetSettingsService
            ]
        })
    ], RulesetsComponent);
    return RulesetsComponent;
}());
exports.RulesetsComponent = RulesetsComponent;
//# sourceMappingURL=rulesets.component.js.map