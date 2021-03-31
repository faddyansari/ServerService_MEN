"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketTypesComponent = void 0;
var core_1 = require("@angular/core");
var TicketTypesComponent = /** @class */ (function () {
    function TicketTypesComponent(_authService, dialog, _tagService, _ticketService) {
        var _this = this;
        this._authService = _authService;
        this.dialog = dialog;
        this._ticketService = _ticketService;
        this.subscriptions = [];
        this.verified = true;
        this.redirectURI = '';
        this.totalTicketsCount = 0;
        this.openTicketsCount = 0;
        this.pendingTicketsCount = 0;
        this.solvedTicketsCount = 0;
        this.closedTicketsCount = 0;
        this.groupedTicketsCount = 0;
        this.subscriptions.push(this._authService.getSettings().subscribe(function (settings) {
            if (settings)
                _this.verified = settings.verified;
        }));
        this.subscriptions.push(_authService.getAgent().subscribe(function (data) {
            _this.agent = data;
        }));
        this.subscriptions.push(_authService.GetRedirectionURI().subscribe(function (data) {
            _this.redirectURI = data;
        }));
        this.subscriptions.push(_ticketService.getSelectedThread().subscribe(function (selectedThread) {
            _this.selectedThread = selectedThread;
        }));
        this.subscriptions.push(_ticketService.getTicketsCount().subscribe(function (ticketsList) {
            _this.openTicketsCount = 0;
            _this.pendingTicketsCount = 0;
            _this.solvedTicketsCount = 0;
            _this.groupedTicketsCount = 0;
            _this.closedTicketsCount = 0;
            ticketsList.map(function (ticket) {
                if (ticket.state == "OPEN")
                    _this.openTicketsCount += 1;
                else if (ticket.state == "PENDING")
                    _this.pendingTicketsCount += 1;
                else if (ticket.state == "SOLVED")
                    _this.solvedTicketsCount += 1;
                else if (ticket.state == "CLOSED")
                    _this.closedTicketsCount += 1;
                if (ticket.merged && ticket.mergedTicketIds && ticket.mergedTicketIds.length)
                    _this.groupedTicketsCount += 1;
            });
        }));
    }
    TicketTypesComponent.prototype.ngOnInit = function () {
    };
    TicketTypesComponent.prototype.setView = function (viewState) {
        //	this._ticketService.setViewState(viewState);
        this._ticketService.setPagination(0);
    };
    //Go To TicketView 
    TicketTypesComponent.prototype.setSelectedThread = function (id) {
        this._ticketService.setSelectedThread(id);
    };
    TicketTypesComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    TicketTypesComponent = __decorate([
        core_1.Component({
            selector: 'app-ticket-types',
            templateUrl: './ticket-types.component.html',
            styleUrls: ['./ticket-types.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], TicketTypesComponent);
    return TicketTypesComponent;
}());
exports.TicketTypesComponent = TicketTypesComponent;
//# sourceMappingURL=ticket-types.component.js.map