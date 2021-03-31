"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NluComponent = void 0;
var core_1 = require("@angular/core");
var NluComponent = /** @class */ (function () {
    function NluComponent(_chatbotService) {
        this._chatbotService = _chatbotService;
    }
    NluComponent.prototype.ngOnInit = function () {
    };
    NluComponent.prototype.toggleInfo = function () {
        this._chatbotService.toggleInfo();
    };
    NluComponent = __decorate([
        core_1.Component({
            selector: 'app-nlu',
            templateUrl: './nlu.component.html',
            styleUrls: ['./nlu.component.css'],
            encapsulation: core_1.ViewEncapsulation.None,
        })
    ], NluComponent);
    return NluComponent;
}());
exports.NluComponent = NluComponent;
//# sourceMappingURL=nlu.component.js.map