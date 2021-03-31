"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlifyPipe = void 0;
var core_1 = require("@angular/core");
// import {
//   DecimalPipe
// } from '@angular/common';
var UrlifyPipe = /** @class */ (function () {
    function UrlifyPipe() {
    }
    UrlifyPipe.prototype.transform = function (text) {
        if (!text)
            return '';
        var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return text.replace(urlRegex, function (url) {
            return '<a href="' + url + '">' + url + '</a>';
        });
    };
    UrlifyPipe = __decorate([
        core_1.Pipe({
            name: 'urlify'
        })
    ], UrlifyPipe);
    return UrlifyPipe;
}());
exports.UrlifyPipe = UrlifyPipe;
//# sourceMappingURL=urlify.pipe.js.map