"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterByPageStatePipe = void 0;
var core_1 = require("@angular/core");
var FilterByPageStatePipe = /** @class */ (function () {
    function FilterByPageStatePipe() {
    }
    FilterByPageStatePipe.prototype.transform = function (value, type) {
        // console.log('FilterPipe : ', value);
        switch (type) {
            case 'browsing':
                return value.filter(function (item) { return ((item.state == 1 || item.state == 8) && !item.inactive); });
            case 'queued':
                return value.filter(function (item) { return (item.state == 2 && !item.inactive); });
            case 'chatting':
                return value.filter(function (item) { return (item.state == 3 && !item.inactive); });
            case 'invited':
                var temp_1 = value.filter(function (item) { return ((item.state == 4 || item.state == 5) && !item.inactive); });
                // console.log(temp.length);
                return temp_1;
            case 'inactive':
                return value.filter(function (item) { return !!(item.inactive); });
        }
    };
    FilterByPageStatePipe = __decorate([
        core_1.Pipe({
            name: 'filterByPageState'
        })
    ], FilterByPageStatePipe);
    return FilterByPageStatePipe;
}());
exports.FilterByPageStatePipe = FilterByPageStatePipe;
//# sourceMappingURL=filter-by-page-state.pipe.js.map