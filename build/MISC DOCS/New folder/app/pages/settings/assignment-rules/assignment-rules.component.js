"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentRulesComponent = void 0;
var core_1 = require("@angular/core");
var AssignmentRuleService_1 = require("../../../../services/LocalServices/AssignmentRuleService");
var AssignmentRulesComponent = /** @class */ (function () {
    function AssignmentRulesComponent(_ruleSetService, _appStateService, _authService) {
        var _this = this;
        this._ruleSetService = _ruleSetService;
        this._appStateService = _appStateService;
        this._authService = _authService;
        this.subscriptions = [];
        this.addRule = false;
        this.selectedRule = undefined;
        this.Agent = undefined;
        this.newObject = undefined;
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Chat Settings');
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) {
                _this.rulesetPermissions = data.permissions.settings.ticketManagement.rulesetSettings;
            }
        }));
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            _this.Agent = agent;
        }));
        this.subscriptions.push(_ruleSetService.addingRule.subscribe(function (addRule) {
            // console.log(addRule);
            _this.addRule = addRule;
        }));
        this.subscriptions.push(this._ruleSetService.selectedRule.subscribe(function (selectedRule) {
            _this.selectedRule = selectedRule;
        }));
        // this.newObject = {
        // 	name: '',
        // 	nsp: this.Agent.nsp,
        // 	isActive: false,
        // 	operator: 'or',
        // 	conditions: [{ key: '', matchingCriterea: '', regex: new RegExp(/\s/, 'gmi'), keywords: [] }],
        // 	actions: [{ name: '', value: '' }],
        // 	lastmodified: { date: new Date().toISOString(), by: this.Agent.email },
        // };
    }
    AssignmentRulesComponent.prototype.ngOnInit = function () {
    };
    AssignmentRulesComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
        // this._ruleSetService.Destroy();
    };
    AssignmentRulesComponent.prototype.AddRule = function () {
        this._ruleSetService.addingRule.next(true);
        this._ruleSetService.selectedRule.next(undefined);
    };
    AssignmentRulesComponent = __decorate([
        core_1.Component({
            selector: 'app-assignment-rules',
            templateUrl: './assignment-rules.component.html',
            styleUrls: ['./assignment-rules.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            providers: [
                AssignmentRuleService_1.AssignmentAutomationSettingsService
            ]
        })
    ], AssignmentRulesComponent);
    return AssignmentRulesComponent;
}());
exports.AssignmentRulesComponent = AssignmentRulesComponent;
//# sourceMappingURL=assignment-rules.component.js.map