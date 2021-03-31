"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentFiltersComponent = void 0;
var core_1 = require("@angular/core");
var AgentFiltersComponent = /** @class */ (function () {
    function AgentFiltersComponent(_utilityService, _agentService, _ticketAutomationService) {
        var _this = this;
        this._utilityService = _utilityService;
        this._agentService = _agentService;
        this._ticketAutomationService = _ticketAutomationService;
        this.subscriptions = [];
        //Inputs
        this.selectedAgents = [];
        this.selectedGroups = [];
        this.sortBy = {
            name: 'first_name',
            type: '1'
        };
        this.agentStatus = 'all';
        this.agentList = [];
        this.agentList_original = [];
        this.groupList = [];
        this.ended = false;
        this.loadingMoreAgents = false;
        this.clearing = false;
        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(function (agents) {
            if (agents) {
                _this.agentList = agents;
                _this.agentList_original = agents;
            }
        }));
        this.subscriptions.push(this._ticketAutomationService.Groups.subscribe(function (groups) {
            if (groups) {
                _this.groupList = groups.map(function (g) { return g.group_name; });
            }
        }));
        this.subscriptions.push(this._agentService.Filters.subscribe(function (filters) {
            _this.filterList = filters;
            // console.log('Subscription: ');
            // console.log(filters);
            if (filters.filter) {
                // console.log(filters);
                _this.sortBy = filters.sortBy;
                if (Object.keys(filters.filter).length) {
                    Object.keys(filters.filter).map(function (key) {
                        if (key == 'agents')
                            _this.selectedAgents = filters.filter[key];
                        if (key == 'groups')
                            _this.selectedGroups = filters.filter[key];
                        if (key == 'status')
                            _this.agentStatus = filters.filter[key];
                    });
                }
                else {
                    _this.selectedAgents = [];
                    _this.selectedGroups = [];
                }
                if (_this.clearing) {
                    _this.clearing = false;
                }
            }
        }));
    }
    AgentFiltersComponent.prototype.ngOnInit = function () {
    };
    AgentFiltersComponent.prototype.updateSort = function () {
        this._agentService.Filters.next(this.ApplyFilter());
    };
    AgentFiltersComponent.prototype.changeStatus = function () {
        this._agentService.Filters.next(this.ApplyFilter());
    };
    AgentFiltersComponent.prototype.Reload = function () {
        this._agentService.Filters.next(this.ApplyFilter(true));
    };
    AgentFiltersComponent.prototype.CloseFilter = function () {
        this._agentService.filterDrawer.next(false);
    };
    AgentFiltersComponent.prototype.ClearFields = function () {
        // console.log(this.sortBy);
        if (this.clearing)
            return;
        if (!this.CheckFiltersEmpty()) {
            this.clearing = true;
            this._agentService.Filters.next({ filter: {}, sortBy: { name: 'first_name', type: '1' } });
            this.sortBy = {
                name: 'first_name',
                type: '1'
            },
                this.agentStatus = 'all';
        }
    };
    AgentFiltersComponent.prototype.CheckFiltersEmpty = function () {
        var _this = this;
        var filtersEmpty = true;
        if (this.selectedAgents.length)
            return;
        if (this.selectedGroups.length)
            return;
        if (this.filterList && Object.keys(this.filterList).length) {
            Object.keys(this.filterList.filter).map(function (key) {
                if (_this.filterList.filter[key] && _this.filterList.filter[key].length)
                    filtersEmpty = false;
            });
        }
        return filtersEmpty;
    };
    AgentFiltersComponent.prototype.onItemSelect = function (event) {
        var _this = this;
        this._agentService.Filters.next(this.ApplyFilter());
        //See if selectedGroups has some value
        if (this.selectedGroups.length) {
            //Then get the agents of that group
            //If more than one group selected then merge the two agentlists
            this._utilityService.getAgentsAgainstGroup(this.selectedGroups).subscribe(function (agents) {
                if (agents) {
                    _this.agentList = agents;
                }
                else {
                    _this.agentList = [];
                }
            });
        }
        else {
            this.agentList = this.agentList_original;
        }
        //If group has no value then show the original agent list
    };
    AgentFiltersComponent.prototype.onDeSelect = function (event) {
        var _this = this;
        this._agentService.Filters.next(this.ApplyFilter());
        //See if selectedGroups has some value
        if (this.selectedGroups.length) {
            //Then get the agents of that group
            //If more than one group selected then merge the two agentlists
            this._utilityService.getAgentsAgainstGroup(this.selectedGroups).subscribe(function (agents) {
                if (agents) {
                    _this.agentList = agents;
                }
                else {
                    _this.agentList = _this.agentList_original;
                }
            });
        }
        else {
            this.agentList = this.agentList_original;
        }
        //If group has no value then show the original agent list
    };
    AgentFiltersComponent.prototype.loadMore = function (event) {
        var _this = this;
        // console.log('Load More!');
        if (!this.ended && !this.loadingMoreAgents) {
            //console.log('Fetch More');
            this.loadingMoreAgents = true;
            this._utilityService.getMoreAgentsObs(this.agentList[this.agentList.length - 1].first_name).subscribe(function (response) {
                //console.log(response);
                _this.agentList = _this.agentList.concat(response.agents);
                _this.ended = response.ended;
                _this.loadingMoreAgents = false;
            });
        }
    };
    AgentFiltersComponent.prototype.onSearch = function (value) {
        var _this = this;
        // console.log('Search');
        // console.log(value);
        if (value) {
            var agents_1 = this.agentList_original.filter(function (a) { return a.email.includes(value.toLowerCase()); });
            this._utilityService.SearchAgent(value).subscribe(function (response) {
                //console.log(response);
                if (response && response.agentList.length) {
                    response.agentList.forEach(function (element) {
                        if (!agents_1.filter(function (a) { return a.email == element.email; }).length) {
                            agents_1.push(element);
                        }
                    });
                }
                _this.agentList = agents_1;
            });
            // this.agentList = agents;
        }
        else {
            this.agentList = this.agentList_original;
            this.ended = false;
            // this.setScrollEvent();
        }
    };
    AgentFiltersComponent.prototype.ApplyFilter = function (reload) {
        if (reload === void 0) { reload = false; }
        var filters = {
            agents: this.selectedAgents,
            groups: this.selectedGroups,
            status: this.agentStatus
        };
        var matchObject = {};
        Object.keys(filters).map(function (key) {
            var _a, _b;
            //console.log(key + ' ' + JSON.stringify(filters[key]));
            if (filters[key]) {
                if (Array.isArray(filters[key]) && filters[key].length) {
                    Object.assign(matchObject, (_a = {}, _a[key] = filters[key], _a));
                }
                else if (!Array.isArray(filters[key]) && Object.keys(filters[key]).length) {
                    Object.assign(matchObject, (_b = {}, _b[key] = filters[key], _b));
                }
            }
        });
        // console.log('Save: ');
        // console.log(matchObject);
        //console.log(JSON.parse(JSON.stringify(matchObject)));
        return { filter: matchObject, sortBy: this.sortBy, reload: reload };
    };
    AgentFiltersComponent = __decorate([
        core_1.Component({
            selector: 'app-agent-filters',
            templateUrl: './agent-filters.component.html',
            styleUrls: ['./agent-filters.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AgentFiltersComponent);
    return AgentFiltersComponent;
}());
exports.AgentFiltersComponent = AgentFiltersComponent;
//# sourceMappingURL=agent-filters.component.js.map