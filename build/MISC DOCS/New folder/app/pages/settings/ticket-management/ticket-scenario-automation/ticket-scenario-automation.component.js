"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketScenarioAutomationComponent = void 0;
var core_1 = require("@angular/core");
var TicketScenarioAutomationComponent = /** @class */ (function () {
    function TicketScenarioAutomationComponent(_authService, _appStateService, _scenarioService) {
        var _this = this;
        this._authService = _authService;
        this._appStateService = _appStateService;
        this._scenarioService = _scenarioService;
        this.ticketScenarioObject = undefined;
        this.subscriptions = [];
        this.addScenario = false;
        this.selectedScenario = undefined;
        this.nsp = '';
        this.email = '';
        this._appStateService.contentInfo.next('');
        this._appStateService.breadCrumbTitle.next('Ticket Management');
        this.nsp = this._scenarioService.Agent.nsp;
        this.email = this._scenarioService.Agent.email;
        this.ticketScenarioObject = {
            nsp: '',
            scenarioTitle: '',
            scenarioDesc: '',
            availableFor: 'allagents',
            groupName: [],
            actions: [{ scenarioName: '', scenarioValue: '' }],
            created: { date: new Date().toISOString(), by: this.email },
            lastModified: { date: '', by: '' }
        };
        this.subscriptions.push(_authService.getPackageInfo().subscribe(function (pkg) {
            if (pkg) {
                _this.package = pkg.tickets.scenarioAutomation;
                if (!_this.package.allowed) {
                    _this._appStateService.NavigateTo('/noaccess');
                }
            }
        }));
        this.subscriptions.push(this._scenarioService.AddScenario.subscribe(function (data) {
            _this.addScenario = data;
        }));
        this.subscriptions.push(this._scenarioService.selectedScenario.subscribe(function (data) {
            _this.selectedScenario = data;
        }));
    }
    TicketScenarioAutomationComponent.prototype.ngOnInit = function () {
    };
    TicketScenarioAutomationComponent.prototype.AddScenario = function () {
        this._scenarioService.AddScenario.next(true);
    };
    TicketScenarioAutomationComponent = __decorate([
        core_1.Component({
            selector: 'app-ticket-scenario-automation',
            templateUrl: './ticket-scenario-automation.component.html',
            styleUrls: ['./ticket-scenario-automation.component.css']
        })
    ], TicketScenarioAutomationComponent);
    return TicketScenarioAutomationComponent;
}());
exports.TicketScenarioAutomationComponent = TicketScenarioAutomationComponent;
//# sourceMappingURL=ticket-scenario-automation.component.js.map