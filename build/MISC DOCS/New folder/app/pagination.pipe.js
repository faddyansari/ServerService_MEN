"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationPipe = void 0;
var core_1 = require("@angular/core");
var PaginationPipe = /** @class */ (function () {
    function PaginationPipe() {
    }
    PaginationPipe.prototype.transform = function (value, startIndex, paginationLimit) {
        if (!value.length)
            return [];
        else {
            //console.log(value.splice(startIndex, startIndex + paginationLimit));
            return value.splice(startIndex, startIndex + paginationLimit);
        }
    };
    PaginationPipe = __decorate([
        core_1.Pipe({
            name: 'pagination'
        })
    ], PaginationPipe);
    return PaginationPipe;
}());
exports.PaginationPipe = PaginationPipe;
//# sourceMappingURL=pagination.pipe.js.map