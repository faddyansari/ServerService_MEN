"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawerFiltersComponent = void 0;
var core_1 = require("@angular/core");
var ChatSettingService_1 = require("../../../services/LocalServices/ChatSettingService");
var DrawerFiltersComponent = /** @class */ (function () {
    function DrawerFiltersComponent(_utilityService, _chatSettingsService, _authService, _chatService) {
        // console.log(this.filters);
        var _this = this;
        this._utilityService = _utilityService;
        this._chatSettingsService = _chatSettingsService;
        this._authService = _authService;
        this._chatService = _chatService;
        this.subscriptions = [];
        //Inputs
        this.filters = {};
        this.selectedAgents = [];
        this.selectedTags = [];
        this.daterange = undefined;
        this.userType = 'all';
        this.chatType = 'all';
        this.chatStatus = 'all';
        this.sortBy = {
            name: 'lastmodified',
            type: '-1'
        };
        this.tagList = [];
        this.agentList = [];
        this.agentList_original = [];
        this.ended = false;
        this.loadingMoreAgents = false;
        this.clearing = false;
        this.textInputFilter = {
            clientID: '',
            visitorEmail: '',
            tickets: 'all',
        };
        //Outputs
        this.onFetch = new core_1.EventEmitter();
        this.onClose = new core_1.EventEmitter();
        _chatSettingsService.getChattSettingsFromBackend();
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) {
                _this.permissions = data.permissions.chats;
            }
        }));
        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(function (agents) {
            if (agents) {
                _this.agentList = agents;
                _this.agentList_original = agents;
            }
            // console.log(this.agentList);
        }));
        this.subscriptions.push(this._chatService.GetTagList().subscribe(function (tags) {
            _this.tagList = tags.map(function (t) { return t.split('#')[1]; });
            // console.log(this.tagList);
        }));
        this.subscriptions.push(this._authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
            // console.log(this.agentList);
        }));
        this.subscriptions.push(_chatService.tagList.subscribe(function (data) {
            //this.chatTagList = data;
        }));
    }
    DrawerFiltersComponent.prototype.clearDate = function (event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        this.daterange = undefined;
        this.ApplyFilter();
        // this._ticketService.Filters.next(this.ApplyFilter());
    };
    DrawerFiltersComponent.prototype.ShowDateRange = function (event) {
        //console.log(event);
        // event.stopImmediatePropagation();
        // event.stopPropagation();
        this.datePicker.Show();
    };
    DrawerFiltersComponent.prototype.RemoveDuplicateTags = function (array) {
        var arr = {};
        array.map(function (value) { if (value.trim())
            arr[value] = value.trim(); });
        return Object.keys(arr);
    };
    DrawerFiltersComponent.prototype.updateFilter = function (event, key) {
        event.preventDefault();
        this.textInputFilter[key] = event.target.value;
        var commaseparatedTags = this.RemoveDuplicateTags(this.textInputFilter[key].split(','));
        //console.log(commaseparatedTags);
        (commaseparatedTags && commaseparatedTags.length) ? this.textInputFilter[key] = commaseparatedTags : this.textInputFilter[key] = [];
        this.ApplyFilter();
    };
    DrawerFiltersComponent.prototype.onDateSelect = function (event) {
        //console.log(event);
        this.dateRangePopper.hide();
        var temp = JSON.stringify({
            to: new Date(event.dates.to),
            from: new Date(event.dates.from)
        });
        if (JSON.stringify(this.daterange) != temp) {
            this.daterange = {
                to: new Date(event.dates.to),
                from: new Date(event.dates.from)
            };
            this.ApplyFilter();
            // this._ticketService.Filters.next(this.ApplyFilter());
        }
    };
    DrawerFiltersComponent.prototype.userTypeChanged = function () {
        this.ApplyFilter();
    };
    DrawerFiltersComponent.prototype.chatTypeChanged = function () {
        this.ApplyFilter();
    };
    DrawerFiltersComponent.prototype.onItemSelect = function () {
        // console.log(this.selectedAgents);
        this.ApplyFilter();
    };
    DrawerFiltersComponent.prototype.onDeSelect = function () {
        // console.log(this.selectedAgents);
        this.ApplyFilter();
    };
    DrawerFiltersComponent.prototype.Reload = function () {
        this.ApplyFilter();
    };
    DrawerFiltersComponent.prototype.ClearFields = function () {
        if (this.clearing)
            return;
        if (!this.CheckFiltersEmpty()) {
            this.clearing = true;
            this.selectedAgents = [];
            this.selectedTags = [];
            this.daterange = undefined;
            this.userType = 'all';
            this.chatType = 'all';
            this.onFetch.emit({ filters: {} });
        }
    };
    DrawerFiltersComponent.prototype.updateSort = function () {
        this.ApplyFilter();
    };
    DrawerFiltersComponent.prototype.CheckFiltersEmpty = function () {
        var _this = this;
        var filtersEmpty = true;
        if (this.selectedAgents.length)
            return;
        if (this.selectedTags.length)
            return;
        if (this.daterange)
            return;
        if (this.filters && Object.keys(this.filters).length) {
            Object.keys(this.filters.filter).map(function (key) {
                if (_this.filters.filter[key] && _this.filters.filter[key].length)
                    filtersEmpty = false;
            });
        }
        return filtersEmpty;
    };
    DrawerFiltersComponent.prototype.onEnter = function (event) {
        if (event.target && event.target.value) {
            if (this.chatTagList.indexOf(event.target.value) !== -1) {
                var hashTag = event.target.value.split('#')[1];
                if (this.selectedTags.indexOf(hashTag) === -1) {
                    this.selectedTags.push(hashTag);
                    this.ApplyFilter();
                }
            }
        }
    };
    DrawerFiltersComponent.prototype.onRemoveTag = function (i) {
        (this.selectedTags.indexOf(this.selectedTags[i]) !== -1) ? this.selectedTags.splice(this.selectedTags.indexOf(this.selectedTags[i])) : undefined;
        this.ApplyFilter();
    };
    DrawerFiltersComponent.prototype.loadMore = function (event) {
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
    DrawerFiltersComponent.prototype.onSearch = function (value) {
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
    DrawerFiltersComponent.prototype.ApplyFilter = function () {
        var _this = this;
        // let state = [];
        switch (this.chatType) {
            case 'attended':
                this.state = [4];
                break;
            case 'unattended':
                this.state = [1];
                break;
            case 'ended':
                this.state = [3];
                break;
            default:
                this.state = [1, 4];
                break;
        }
        // console.log(state);
        // switch (this.chatStatus) {
        // 	case 'ended':
        // 		state = (state as Array<any>).filter(data => { return data != 4 })
        // 		if (!(state as Array<any>).includes(3)) state.push(3)
        // 		break;
        // 	case 'archived':
        // 		state = (state as Array<any>).filter(data => { return data != 3 })
        // 		break;
        // 	default:
        // 		if (!(state as Array<any>).includes(3)) state.push(3)
        // 		break;
        // }
        // console.log(state);
        var filters = {
            agentEmail: this.selectedAgents,
            tags: this.selectedTags,
            daterange: this.daterange,
            state: this.state,
        };
        Object.keys(this.textInputFilter).map(function (key) {
            filters[key] = _this.textInputFilter[key];
        });
        //console.log(filters);
        this.onFetch.emit({ filters: filters, userType: this.userType, sortBy: this.sortBy });
    };
    DrawerFiltersComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.filters.userType) {
            this.userType = this.filters.userType;
        }
        if (this.filters.sortBy) {
            this.sortBy = this.filters.sortBy;
        }
        if (this.filters.filter) {
            // this.userType = this.filters.userType;
            if (Object.keys(this.filters.filter).length) {
                Object.keys(this.filters.filter).map(function (key) {
                    if ((key == 'tickets') || (key == 'clientID') || (key == 'visitorEmail'))
                        _this.textInputFilter[key] = _this.filters.filter[key];
                    if (key == 'agentEmail')
                        _this.selectedAgents = _this.filters.filter[key];
                    if (key == 'tags')
                        _this.selectedTags = _this.filters.filter[key];
                    if (key == 'chatType')
                        _this.chatType = _this.filters.filter[key];
                    if (key == 'daterange')
                        _this.daterange = {
                            to: new Date(_this.filters.filter[key].to),
                            from: new Date(_this.filters.filter[key].from)
                        };
                    if (key == 'state' && Array.isArray(_this.filters.filter[key]) && _this.filters.filter[key].length) {
                        _this.state = _this.filters.filter[key];
                        if (_this.filters.filter.override) {
                            if (_this.filters.filter.state[0] == 1) {
                                if (_this.filters.filter.override.agentEmail && _this.filters.filter.override.agentEmail.hasOwnProperty('$eq'))
                                    _this.chatType = 'unattended';
                                else if (_this.filters.filter.override.agentEmail && _this.filters.filter.override.agentEmail.hasOwnProperty('$ne'))
                                    _this.chatType = 'attended';
                                else if (_this.filters.filter.override.agentEmail && _this.filters.filter.override.agentEmail.hasOwnProperty('$exists'))
                                    _this.chatType = 'all';
                            }
                        }
                        else {
                            if (_this.ArrayEquals(_this.state, [1]))
                                _this.chatType = 'unattended';
                            else if (_this.ArrayEquals(_this.state, [4]))
                                _this.chatType = 'attended';
                            else if (_this.ArrayEquals(_this.state, [3]))
                                _this.chatType = 'ended';
                            else
                                _this.chatType = 'all';
                        }
                    }
                    // if (key == 'userType') this.userType = this.filters.filter[key];
                });
            }
            else {
                this.selectedAgents = [];
                this.selectedTags = [];
                // this.userType = 'all';
            }
        }
        // this.selectedAgents = [this.agent.email];
    };
    DrawerFiltersComponent.prototype.ArrayEquals = function (arr1, arr2) {
        var equals = true;
        if (Object.keys(arr1).length != Object.keys(arr2).length)
            return false;
        Object.keys(arr1).map(function (el, i) {
            if (arr1[i] != arr2[i])
                equals = false;
        });
        return equals;
    };
    DrawerFiltersComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this._chatSettingsService.Destroy();
    };
    DrawerFiltersComponent.prototype.CloseFilter = function () {
        this.onClose.emit();
    };
    __decorate([
        core_1.ViewChild('datePicker')
    ], DrawerFiltersComponent.prototype, "datePicker", void 0);
    __decorate([
        core_1.ViewChild('dateRangePopper')
    ], DrawerFiltersComponent.prototype, "dateRangePopper", void 0);
    __decorate([
        core_1.Input('filters')
    ], DrawerFiltersComponent.prototype, "filters", void 0);
    __decorate([
        core_1.Output()
    ], DrawerFiltersComponent.prototype, "onFetch", void 0);
    __decorate([
        core_1.Output()
    ], DrawerFiltersComponent.prototype, "onClose", void 0);
    DrawerFiltersComponent = __decorate([
        core_1.Component({
            selector: 'app-drawer-filters',
            templateUrl: './drawer-filters.component.html',
            styleUrls: ['./drawer-filters.component.scss'],
            providers: [
                ChatSettingService_1.ChatSettingService
            ],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], DrawerFiltersComponent);
    return DrawerFiltersComponent;
}());
exports.DrawerFiltersComponent = DrawerFiltersComponent;
//# sourceMappingURL=drawer-filters.component.js.map