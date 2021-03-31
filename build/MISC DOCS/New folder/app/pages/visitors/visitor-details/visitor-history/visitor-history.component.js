"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitorHistoryComponent = void 0;
var core_1 = require("@angular/core");
var VisitorHistoryComponent = /** @class */ (function () {
    function VisitorHistoryComponent() {
    }
    VisitorHistoryComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        core_1.Input()
    ], VisitorHistoryComponent.prototype, "visitor", void 0);
    VisitorHistoryComponent = __decorate([
        core_1.Component({
            selector: 'app-visitor-history',
            templateUrl: './visitor-history.component.html',
            styleUrls: ['./visitor-history.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        })
    ], VisitorHistoryComponent);
    return VisitorHistoryComponent;
}());
exports.VisitorHistoryComponent = VisitorHistoryComponent;
//# sourceMappingURL=visitor-history.component.js.map