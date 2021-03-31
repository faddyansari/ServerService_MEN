"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketHistoryComponent = void 0;
var core_1 = require("@angular/core");
var TicketHistoryComponent = /** @class */ (function () {
    function TicketHistoryComponent() {
        this.threadId = new core_1.EventEmitter();
    }
    TicketHistoryComponent.prototype.ngOnInit = function () {
    };
    TicketHistoryComponent.prototype.setSelectedThread = function (_id) {
        this.threadId.emit(_id);
    };
    TicketHistoryComponent.prototype.seeCMID = function (ticket) {
        var res = ticket.subject.split('/');
        if (res && res.length) {
            if (res[4] && res[4].trim() == 'Beelinks' && ticket.CustomerInfo && ticket.CustomerInfo.customerId) {
                if (res[2] && res[2].toString().trim() == ticket.CustomerInfo.customerId.toString().trim()) {
                    return false;
                }
                else
                    return true;
            }
        }
        else
            return false;
    };
    __decorate([
        core_1.Input('visitor_ticket_history')
    ], TicketHistoryComponent.prototype, "visitor_ticket_history", void 0);
    __decorate([
        core_1.Output('threadId')
    ], TicketHistoryComponent.prototype, "threadId", void 0);
    TicketHistoryComponent = __decorate([
        core_1.Component({
            selector: 'app-ticket-history',
            templateUrl: './ticket-history.component.html',
            styleUrls: ['./ticket-history.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        })
    ], TicketHistoryComponent);
    return TicketHistoryComponent;
}());
exports.TicketHistoryComponent = TicketHistoryComponent;
//# sourceMappingURL=ticket-history.component.js.map