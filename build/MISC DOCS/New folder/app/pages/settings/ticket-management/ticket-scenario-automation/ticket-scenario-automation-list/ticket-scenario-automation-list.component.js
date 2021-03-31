"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketScenarioAutomationListComponent = void 0;
var core_1 = require("@angular/core");
var confirmation_dialog_component_1 = require("../../../../../dialogs/confirmation-dialog/confirmation-dialog.component");
var TicketScenarioAutomationListComponent = /** @class */ (function () {
    function TicketScenarioAutomationListComponent(_ticketScenarioService, dialog) {
        var _this = this;
        this._ticketScenarioService = _ticketScenarioService;
        this.dialog = dialog;
        this.allScenarios = [];
        this.subscriptions = [];
        this.subscriptions.push(this._ticketScenarioService.AllScenarios.subscribe(function (data) {
            if (data && data.length) {
                _this.allScenarios = data;
            }
            else {
                _this.allScenarios = [];
            }
        }));
    }
    TicketScenarioAutomationListComponent.prototype.ngOnInit = function () {
    };
    TicketScenarioAutomationListComponent.prototype.cloneScenario = function (scenario) {
        // console.log(scenario);
        this._ticketScenarioService.cloneScenario.next(true);
        var clonedScenario = JSON.parse(JSON.stringify(scenario));
        clonedScenario.scenarioTitle = "Copy of" + ' ' + clonedScenario.scenarioTitle;
        // console.log(clonedScenario);
        this._ticketScenarioService.selectedScenario.next(clonedScenario);
    };
    TicketScenarioAutomationListComponent.prototype.editScenario = function (scenario) {
        this._ticketScenarioService.selectedScenario.next(scenario);
    };
    TicketScenarioAutomationListComponent.prototype.deleteScenario = function (id) {
        var _this = this;
        this.dialog.open(confirmation_dialog_component_1.ConfirmationDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: { headermsg: "Are you sure want to delete this scenario?" }
        }).afterClosed().subscribe(function (data) {
            if (data == 'ok') {
                _this._ticketScenarioService.deleteScenario(id);
            }
        });
    };
    TicketScenarioAutomationListComponent = __decorate([
        core_1.Component({
            selector: 'app-ticket-scenario-automation-list',
            templateUrl: './ticket-scenario-automation-list.component.html',
            styleUrls: ['./ticket-scenario-automation-list.component.css']
        })
    ], TicketScenarioAutomationListComponent);
    return TicketScenarioAutomationListComponent;
}());
exports.TicketScenarioAutomationListComponent = TicketScenarioAutomationListComponent;
//# sourceMappingURL=ticket-scenario-automation-list.component.js.map