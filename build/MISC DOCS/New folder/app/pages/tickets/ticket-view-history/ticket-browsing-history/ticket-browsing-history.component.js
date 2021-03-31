"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketBrowsingHistoryComponent = void 0;
var core_1 = require("@angular/core");
var TicketBrowsingHistoryComponent = /** @class */ (function () {
    function TicketBrowsingHistoryComponent() {
    }
    TicketBrowsingHistoryComponent.prototype.ngOnInit = function () {
    };
    TicketBrowsingHistoryComponent.prototype.ToArray = function (value) {
        if (value instanceof Array)
            return value;
        else {
            return [value];
        }
    };
    __decorate([
        core_1.Input('visitorData')
    ], TicketBrowsingHistoryComponent.prototype, "visitorData", void 0);
    TicketBrowsingHistoryComponent = __decorate([
        core_1.Component({
            selector: 'app-ticket-browsing-history',
            templateUrl: './ticket-browsing-history.component.html',
            styleUrls: ['./ticket-browsing-history.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        })
    ], TicketBrowsingHistoryComponent);
    return TicketBrowsingHistoryComponent;
}());
exports.TicketBrowsingHistoryComponent = TicketBrowsingHistoryComponent;
//# sourceMappingURL=ticket-browsing-history.component.js.map