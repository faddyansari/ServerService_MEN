"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterPipe = void 0;
var core_1 = require("@angular/core");
var FilterPipe = /** @class */ (function () {
    function FilterPipe() {
    }
    FilterPipe.prototype.transform = function (items, searchText, searchBy, byValue) {
        if (byValue === void 0) { byValue = true; }
        if (!items)
            return [];
        if (!searchText || !searchText.trim()) {
            return (byValue) ? JSON.parse(JSON.stringify(items)) : items;
        }
        searchText = searchText.toLowerCase();
        var filteredList = [];
        items.filter(function (it) {
            if (searchBy.length) {
                searchBy.forEach(function (element) {
                    if (element.indexOf('visitor.') != -1 && it['visitor'][element.split('.')[1]] && it['visitor'][element.split('.')[1]].toString().toLowerCase().includes(searchText)) {
                        if (!filteredList.includes(it)) {
                            filteredList.push(it);
                        }
                    }
                    if (it[element] && it[element].toString().toLowerCase().includes(searchText)) {
                        if (!filteredList.includes(it)) {
                            filteredList.push(it);
                        }
                    }
                    if (Array.isArray(it[element])) {
                        if (!filteredList.includes(it)) {
                            if (JSON.stringify(it[element]).toString().toLowerCase().replace(',', '##').includes(searchText)) {
                                filteredList.push(it);
                            }
                        }
                    }
                    if (element.split(',').length) {
                        var text = element.split(',');
                        // console.log(text);				
                        if (it[text[0]] && it[text[0]][text[1]] && it[text[0]][text[1]].toString().toLowerCase().includes(searchText)) {
                            if (!filteredList.includes(it)) {
                                filteredList.push(it);
                            }
                        }
                    }
                    if (element.split('.').length > 1) {
                        // console.log('Array of objects search');
                        var key1 = element.split('.')[0];
                        var key2_1 = element.split('.')[1];
                        if (Array.isArray(it[key1])) {
                            // console.log('Array of objects search');
                            it[key1].forEach(function (element) {
                                if (element[key2_1].includes(searchText)) {
                                    if (!filteredList.includes(it)) {
                                        filteredList.push(it);
                                    }
                                }
                            });
                        }
                    }
                });
            }
            else {
                if (it.toLowerCase().includes(searchText)) {
                    filteredList.push(it);
                }
            }
        });
        return (byValue) ? JSON.parse(JSON.stringify(filteredList)) : filteredList;
    };
    FilterPipe = __decorate([
        core_1.Pipe({
            name: 'filter'
        })
    ], FilterPipe);
    return FilterPipe;
}());
exports.FilterPipe = FilterPipe;
//# sourceMappingURL=filter.pipe.js.map