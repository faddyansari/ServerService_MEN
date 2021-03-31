"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintTicketsComponent = void 0;
var core_1 = require("@angular/core");
var PrintTicketsComponent = /** @class */ (function () {
    function PrintTicketsComponent() {
        this.subscriptions = [];
        this.selectedThread = undefined;
    }
    PrintTicketsComponent.prototype.ngOnInit = function () {
    };
    PrintTicketsComponent = __decorate([
        core_1.Component({
            selector: 'app-print-tickets',
            templateUrl: './print-tickets.component.html',
            styleUrls: ['./print-tickets.component.css']
        })
    ], PrintTicketsComponent);
    return PrintTicketsComponent;
}());
exports.PrintTicketsComponent = PrintTicketsComponent;
//# sourceMappingURL=print-tickets.component.js.map