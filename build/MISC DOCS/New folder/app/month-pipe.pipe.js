"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthPipePipe = void 0;
var core_1 = require("@angular/core");
var MonthPipePipe = /** @class */ (function () {
    function MonthPipePipe() {
    }
    MonthPipePipe.prototype.transform = function (value, args) {
        var monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];
        return monthNames[new Date(value).getDate()];
    };
    MonthPipePipe = __decorate([
        core_1.Pipe({
            name: 'dateFormat'
        })
    ], MonthPipePipe);
    return MonthPipePipe;
}());
exports.MonthPipePipe = MonthPipePipe;
//# sourceMappingURL=month-pipe.pipe.js.map