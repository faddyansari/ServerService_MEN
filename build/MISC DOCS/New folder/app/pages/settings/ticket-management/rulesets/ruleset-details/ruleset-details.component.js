"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RulesetDetailsComponent = void 0;
var core_1 = require("@angular/core");
var RulesetDetailsComponent = /** @class */ (function () {
    function RulesetDetailsComponent() {
    }
    RulesetDetailsComponent.prototype.ngOnInit = function () {
    };
    RulesetDetailsComponent = __decorate([
        core_1.Component({
            selector: 'app-ruleset-details',
            templateUrl: './ruleset-details.component.html',
            styleUrls: ['./ruleset-details.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], RulesetDetailsComponent);
    return RulesetDetailsComponent;
}());
exports.RulesetDetailsComponent = RulesetDetailsComponent;
//# sourceMappingURL=ruleset-details.component.js.map