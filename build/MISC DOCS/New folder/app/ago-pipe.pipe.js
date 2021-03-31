"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgoPipePipe = void 0;
var core_1 = require("@angular/core");
var AgoPipePipe = /** @class */ (function () {
    function AgoPipePipe() {
    }
    AgoPipePipe.prototype.transform = function (value) {
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
        var dateTime = Date.parse(value);
        var currentDateTime = Date.parse(new Date().toLocaleString());
        //Case For Years
        if (((currentDateTime - dateTime) / 1000 / 60 / 60) / 24 / 365 > 1) {
            return new Date(value).getDate() + ' ' + monthNames[new Date(value).getMonth()] + '\' ' + new Date(value).getFullYear().toString().slice(2, 4);
        }
        //Case For Days
        if (((currentDateTime - dateTime) / 1000 / 60 / 60) / 24 > 1) {
            return new Date(value).getDate() + ' ' + monthNames[new Date(value).getMonth()] + '\' ' + new Date(value).getFullYear().toString().slice(2, 4);
        }
        //Case For Hours
        if (((currentDateTime - dateTime) / 1000 / 60 / 60) > 1) {
            return Math.floor(((currentDateTime - dateTime) / 1000 / 60 / 60)) + ' hours ago';
        }
        //Case For Minutes
        if (((currentDateTime - dateTime) / 1000 / 60) > 1) {
            return Math.floor(((currentDateTime - dateTime) / 1000 / 60)) + ' minutes ago';
        }
        //Case For Less Then Minutes
        if (((currentDateTime - dateTime) / 1000 / 60) < 1) {
            return new Date(value).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
    };
    AgoPipePipe = __decorate([
        core_1.Pipe({
            name: 'agoPipe'
        })
    ], AgoPipePipe);
    return AgoPipePipe;
}());
exports.AgoPipePipe = AgoPipePipe;
//# sourceMappingURL=ago-pipe.pipe.js.map