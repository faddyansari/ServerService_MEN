"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterAgentPipe = void 0;
var core_1 = require("@angular/core");
var FilterAgentPipe = /** @class */ (function () {
    function FilterAgentPipe() {
    }
    FilterAgentPipe.prototype.transform = function (searchAgent, ticket) {
        console.log(searchAgent);
        console.log(ticket);
        if (!searchAgent)
            return [];
        searchAgent = searchAgent.toLowerCase();
        // if (!searchText) { return (byValue) ? JSON.parse(JSON.stringify(items)) : items; }
        // searchText = searchText.toLowerCase();
        // let filteredList = [];
        // items.filter(it => {
        //   searchBy.forEach(element => {
        //     if (it[element] &&  it[element].toString().toLowerCase().includes(searchText)) {
        //       if (!filteredList.includes(it)) {
        //         filteredList.push(it);
        //       }
        //     }
        //   });
        // });
        // return (byValue) ?  JSON.parse(JSON.stringify(filteredList)) : filteredList;
        return;
    };
    FilterAgentPipe = __decorate([
        core_1.Pipe({
            name: 'filter-agent'
        })
    ], FilterAgentPipe);
    return FilterAgentPipe;
}());
exports.FilterAgentPipe = FilterAgentPipe;
//# sourceMappingURL=filter-agent.pipe.js.map