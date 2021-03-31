"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallScreenComponent = void 0;
var core_1 = require("@angular/core");
var CallScreenComponent = /** @class */ (function () {
    function CallScreenComponent() {
        this.showDialPad = false;
    }
    CallScreenComponent.prototype.toggleDialPad = function () {
        this.showDialPad = !this.showDialPad;
    };
    CallScreenComponent.prototype.ngOnInit = function () {
    };
    CallScreenComponent = __decorate([
        core_1.Component({
            selector: 'app-call-screen',
            templateUrl: './call-screen.component.html',
            styleUrls: ['./call-screen.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], CallScreenComponent);
    return CallScreenComponent;
}());
exports.CallScreenComponent = CallScreenComponent;
//# sourceMappingURL=call-screen.component.js.map