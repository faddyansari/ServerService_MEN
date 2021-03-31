"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketMergedComponent = void 0;
var core_1 = require("@angular/core");
var TicketMergedComponent = /** @class */ (function () {
    function TicketMergedComponent() {
        this.demergeInfo = new core_1.EventEmitter();
    }
    TicketMergedComponent.prototype.ngOnInit = function () {
    };
    TicketMergedComponent.prototype.Demerge = function (selectedThreadId, DemergeId) {
        this.demergeInfo.emit({
            selectedThreadId: selectedThreadId,
            DemergeId: DemergeId
        });
    };
    TicketMergedComponent.prototype.seeCMID = function (ticket) {
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
    TicketMergedComponent.prototype.ScrollintoView = function (id) {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: "start" });
    };
    __decorate([
        core_1.Input('selectedThread')
    ], TicketMergedComponent.prototype, "selectedThread", void 0);
    __decorate([
        core_1.Output('demergeInfo')
    ], TicketMergedComponent.prototype, "demergeInfo", void 0);
    TicketMergedComponent = __decorate([
        core_1.Component({
            selector: 'app-ticket-merged',
            templateUrl: './ticket-merged.component.html',
            styleUrls: ['./ticket-merged.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        })
    ], TicketMergedComponent);
    return TicketMergedComponent;
}());
exports.TicketMergedComponent = TicketMergedComponent;
//# sourceMappingURL=ticket-merged.component.js.map