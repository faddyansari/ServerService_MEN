"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalleeListComponent = void 0;
var core_1 = require("@angular/core");
var CalleeListComponent = /** @class */ (function () {
    function CalleeListComponent() {
        this.conversation = {};
    }
    CalleeListComponent.prototype.ngOnInit = function () {
    };
    CalleeListComponent = __decorate([
        core_1.Component({
            selector: 'app-callee-list',
            templateUrl: './callee-list.component.html',
            styleUrls: ['./callee-list.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], CalleeListComponent);
    return CalleeListComponent;
}());
exports.CalleeListComponent = CalleeListComponent;
//# sourceMappingURL=callee-list.component.js.map