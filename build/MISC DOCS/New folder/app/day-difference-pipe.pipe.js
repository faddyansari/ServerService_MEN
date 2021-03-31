"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DayDifferencePipePipe = void 0;
var core_1 = require("@angular/core");
var DayDifferencePipePipe = /** @class */ (function () {
    function DayDifferencePipePipe() {
    }
    DayDifferencePipePipe.prototype.transform = function (value) {
        var monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];
        return monthNames[new Date(value).getMonth()] + ' ' + new Date(value).getDate() + ' \' ' + new Date(value).getFullYear().toString().slice(2, 4);
        // let dayDifference = Math.floor((Date.parse(new Date().toDateString()) - Date.parse(new Date(value).toDateString())) / 1000 / 60 / 60 / 24);
        // if (dayDifference == 0) {
        //   return Date.parse(new Date().toISOString()) - Date.parse(new Date(value).toISOString());
        // } 
        // else return monthNames[new Date(value).getMonth()] + ' ' + new Date(value).getDate() + ' \' ' + new Date(value).getFullYear().toString().slice(2, 4);
    };
    DayDifferencePipePipe = __decorate([
        core_1.Pipe({
            name: 'dayDifferencePipe'
        })
    ], DayDifferencePipePipe);
    return DayDifferencePipePipe;
}());
exports.DayDifferencePipePipe = DayDifferencePipePipe;
//# sourceMappingURL=day-difference-pipe.pipe.js.map