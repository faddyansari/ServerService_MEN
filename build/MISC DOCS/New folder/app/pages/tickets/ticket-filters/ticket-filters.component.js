"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketFiltersComponent = void 0;
var core_1 = require("@angular/core");
require("rxjs/add/operator/mapTo");
require("rxjs/add/operator/distinctUntilChanged");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/switchMap");
require("rxjs/add/operator/switchMap");
var TicketFiltersComponent = /** @class */ (function () {
    function TicketFiltersComponent(formbuilder, _ticketService, _ticketAutomationService, _utilityService, _authService, _tagService) {
        var _this = this;
        this._ticketService = _ticketService;
        this._ticketAutomationService = _ticketAutomationService;
        this._utilityService = _utilityService;
        this._authService = _authService;
        this._tagService = _tagService;
        this.subscriptions = [];
        this.loadingMoreAgents = false;
        this.$observable = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.filterList = undefined;
        this.dynamicFields = undefined;
        //Filters
        this.priorityList = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
        this.statusList = ['OPEN', 'PENDING', 'SOLVED', 'CLOSED'];
        this.dateFilters = ['PAST 7 Days', 'PAST 30 Days', 'PAST 6 Months', 'CUSTOM DATE'];
        this.agentList = [];
        this.agentList_original = [];
        this.groupList = [];
        this.scrollHeight = 0;
        this.showNoAgents = false;
        // public tagList = [];
        this.selectedItems = [];
        this.selectedStatus = [];
        this.selectedAgents = [];
        this.selectedGroups = [];
        this.daterange = undefined;
        // public selectedTags = [];
        this.contactNames = [];
        this.source = [];
        this.createdDate = [];
        //Filter Settings
        this.dropdownSettings = {
            singleSelection: false,
            enableCheckAll: false,
            itemsShowLimit: 10,
        };
        this.dropdownSettings_withSearch = {
            singleSelection: false,
            enableCheckAll: false,
            allowSearchFilter: true,
            itemsShowLimit: 10,
        };
        this.dynamicDropdownSettings = {
            singleSelection: false,
            enableCheckAll: false,
            itemsShowLimit: 10,
            idField: 'value',
            textField: 'name',
        };
        this.dropdownSettingsSingle = {
            singleSelection: true,
            enableCheckAll: false,
            itemsShowLimit: 10,
            closeDropDownOnSelection: true,
        };
        this.clause = '$and';
        this.clearing = false;
        this.loading = true;
        this.showrangepicker = false;
        this.searchInput = new Subject_1.Subject();
        this.ended = false;
        this.filterArea = false;
        this.sortBy = {
            name: 'lasttouchedTime',
            type: '-1'
        };
        this.mergeType = 'all';
        this.agentAssignType = 'all';
        this.groupAssignType = 'all';
        //ClientIds Search
        this.selectedIDs = '';
        this.subscriptions.push(this._ticketService.loading.subscribe(function (loading) {
            //console.log('Loading', loading);
            _this.loading = loading;
        }));
        this.subscriptions.push(this._ticketService.showFilterArea.subscribe(function (value) {
            //console.log('Loading', loading);
            _this.filterArea = value;
        }));
        this.subscriptions.push(this._authService.getSettings().subscribe(function (settings) {
            if (settings) {
                // console.log(this.filterList);
                _this.settings = settings;
                _this.dynamicFields = settings.schemas.ticket.fields.filter(function (field) {
                    switch (field.elementType) {
                        case 'dropdown':
                            field.value = [];
                            break;
                        case 'textbox':
                            field.value = '';
                            field.subscriber = new Subject_1.Subject();
                            _this.subscriptions.push(field.subscriber.debounceTime(500).distinctUntilChanged().subscribe(function (data) {
                                //console.log('Field Changed', data);
                                _this._ticketService.Filters.next(_this.ApplyFilter());
                            }));
                            break;
                        case 'checkbox':
                            field.value = '';
                            field.subscriber = new Subject_1.Subject();
                            _this.subscriptions.push(field.subscriber.debounceTime(500).distinctUntilChanged().subscribe(function (data) {
                                //console.log('Field Changed', data);
                                _this._ticketService.Filters.next(_this.ApplyFilter());
                            }));
                            break;
                    }
                    if (_this.filterList && _this.filterList.filter && _this.filterList.filter['dynamicFields.' + field.name]) {
                        field.value = _this.filterList.filter['dynamicFields.' + field.name];
                    }
                    return !field.default;
                });
            }
        }));
        this.subscriptions.push(this._ticketService.Filters.subscribe(function (filters) {
            _this.filterList = filters;
            // console.log(filters);
            if (filters.filter) {
                // console.log(filters);
                _this.clause = filters.clause;
                _this.sortBy = filters.sortBy;
                _this.searchValue = filters.query;
                _this.agentAssignType = filters.assignType;
                _this.groupAssignType = filters.groupAssignType;
                _this.mergeType = filters.mergeType;
                if (Object.keys(filters.filter).length) {
                    Object.keys(filters.filter).map(function (key) {
                        if (key == 'priority')
                            _this.selectedItems = filters.filter[key];
                        if (key == 'state')
                            _this.selectedStatus = filters.filter[key];
                        if (key == 'assigned_to')
                            _this.selectedAgents = filters.filter[key];
                        if (key == 'group')
                            _this.selectedGroups = filters.filter[key];
                        if (key == 'daterange')
                            _this.daterange = filters.filter[key];
                    });
                }
                else {
                    _this.selectedItems = [];
                    _this.selectedStatus = [];
                    _this.selectedAgents = [];
                    _this.selectedGroups = [];
                }
                if (_this.settings) {
                    _this.dynamicFields = _this.settings.schemas.ticket.fields.filter(function (field) {
                        switch (field.elementType) {
                            case 'dropdown':
                                field.value = [];
                                break;
                            case 'textbox':
                                field.value = '';
                                field.subscriber = new Subject_1.Subject();
                                _this.subscriptions.push(field.subscriber.debounceTime(500).distinctUntilChanged().subscribe(function (data) {
                                    //console.log('Field Changed', data);
                                    _this._ticketService.Filters.next(_this.ApplyFilter());
                                }));
                                break;
                            case 'checkbox':
                                field.value = '';
                                field.subscriber = new Subject_1.Subject();
                                _this.subscriptions.push(field.subscriber.debounceTime(500).distinctUntilChanged().subscribe(function (data) {
                                    //console.log('Field Changed', data);
                                    _this._ticketService.Filters.next(_this.ApplyFilter());
                                }));
                                break;
                        }
                        if (_this.filterList && _this.filterList.filter && _this.filterList.filter['dynamicFields.' + field.name]) {
                            field.value = _this.filterList.filter['dynamicFields.' + field.name];
                        }
                        return !field.default;
                    });
                }
                if (_this.clearing) {
                    _this.clearing = false;
                }
            }
        }));
        this.subscriptions.push(this._ticketService.headerSearch.distinctUntilChanged().debounceTime(300).subscribe(function (data) {
            _this.searchValue = data;
            // console.log(data);
            _this._ticketService.Filters.next(_this.ApplyFilter());
        }));
        // this.subscriptions.push(this.$observable.subscribe(response => {
        // 	console.log(response);
        // 	if (response && Object.keys(response).length) {
        // 		this._ticketService.Filters.next(response)
        // 	}
        // }));
        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(function (agents) {
            if (agents) {
                _this.agentList = agents;
                _this.agentList_original = agents;
            }
            // console.log(this.agentList);
        }));
        this.subscriptions.push(this._ticketAutomationService.Groups.subscribe(function (groups) {
            // if (groups && Object.keys(groups).length) {
            // 	let temp = [];
            // 	groups.map(group => {
            // 		temp.push(group.group_name);
            // 	});
            // 	this.groupList = temp;
            // }
            if (groups) {
                _this.groupList = groups.map(function (g) { return g.group_name; });
                // console.log(this.groupList);
            }
        }));
        // this.subscriptions.push(this._tagService.Tag.subscribe(tags => {
        // 	if (tags && Object.keys(tags).length) {
        // 		let temp = [];
        // 		tags.tags.map(tag => {
        // 			temp.push(tag.tag);
        // 		})
        // 		this.tagList = temp;
        // 	}
        // }))
        this.filterform = formbuilder.group({
            'assigned_to': [null],
            'priority': [null],
            'tags': [null]
        });
        this.searchInput
            .map(function (event) { return event; })
            .debounceTime(500)
            .switchMap(function () {
            return new Observable_1.Observable(function (observer) {
                console.log('search');
            });
        }).subscribe();
    }
    TicketFiltersComponent.prototype.ngOnInit = function () {
        // this.subscriptions.push(this.searchForm.get('searchValue').valueChanges.debounceTime(1000).distinctUntilChanged().subscribe(response => {
        // 	if (this.clearing) this.clearing = false;
        // 	else this._ticketService.Filters.next(this.ApplyFilter());
        // }))
    };
    TicketFiltersComponent.prototype.ngAfterViewInit = function () {
        // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        // Add 'implements AfterViewInit' to the class.
        this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
    };
    TicketFiltersComponent.prototype.ngAfterViewChecked = function () {
        //Called after every check of the component's view. Applies to components only.
        //Add 'implements AfterViewChecked' to the class.
        // if(this.loadingMoreAgents){
        //   this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight + 20;
        //   // this.scrollRef.scrollYTo(this.scrollRef.view.scrollHeight + 20);
        // }
    };
    TicketFiltersComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(function (subscription) { return subscription.unsubscribe(); });
        // this._ticketService.saveFiltersOnLocalStorage();
    };
    TicketFiltersComponent.prototype.clearText = function () {
        // this.searchForm.reset();
    };
    TicketFiltersComponent.prototype.Reload = function () {
        if (this.loading)
            return;
        // this.loading = true;
        this._ticketService.loading.next(true);
        this._ticketService.Filters.next(this.ApplyFilter(true));
    };
    TicketFiltersComponent.prototype.CheckFiltersEmpty = function () {
        var _this = this;
        var filtersEmpty = true;
        if (this.searchValue) {
            filtersEmpty = false;
        }
        if (this.filterList && Object.keys(this.filterList).length) {
            Object.keys(this.filterList.filter).map(function (key) {
                if (_this.filterList.filter[key] || _this.filterList.filter[key].length)
                    filtersEmpty = false;
            });
        }
        return filtersEmpty;
    };
    TicketFiltersComponent.prototype.ClearFields = function () {
        // console.log(this.sortBy);
        var _this = this;
        if (this.clearing)
            return;
        if (!this.CheckFiltersEmpty()) {
            this.clearing = true;
            this._ticketService.Filters.next({ filter: {}, clause: '$and', query: undefined, sortBy: { name: 'lasttouchedTime', type: '-1' }, assignType: 'all', groupAssignType: 'all', mergeType: 'all' });
            this._ticketService.saveFiltersOnLocalStorage({ filter: {}, clause: '$and', query: undefined, sortBy: { name: 'lasttouchedTime', type: '-1' }, assignType: 'all', groupAssignType: 'all', mergeType: 'all' });
            this.dynamicFields.forEach(function (field) {
                switch (field.elementType) {
                    case 'dropdown':
                        field.value = [];
                        break;
                    case 'textbox':
                        field.value = '';
                        field.subscriber = new Subject_1.Subject();
                        _this.subscriptions.push(field.subscriber.debounceTime(500).distinctUntilChanged().subscribe(function (data) {
                            //console.log('Field Changed', data);
                            _this._ticketService.Filters.next(_this.ApplyFilter());
                        }));
                        break;
                    case 'checkbox':
                        field.value = '';
                        field.subscriber = new Subject_1.Subject();
                        _this.subscriptions.push(field.subscriber.debounceTime(500).distinctUntilChanged().subscribe(function (data) {
                            //console.log('Field Changed', data);
                            _this._ticketService.Filters.next(_this.ApplyFilter());
                        }));
                        break;
                }
                return !field.default;
            });
        }
    };
    TicketFiltersComponent.prototype.toggleFilters = function () {
        this._ticketService.toggleFilterArea();
        // this.filterArea = !this.filterArea;
    };
    TicketFiltersComponent.prototype.clearDate = function (event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        this.daterange = undefined;
        this._ticketService.Filters.next(this.ApplyFilter());
    };
    TicketFiltersComponent.prototype.onDateSelect = function (event) {
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
            this._ticketService.Filters.next(this.ApplyFilter());
        }
    };
    TicketFiltersComponent.prototype.onItemSelect = function (event) {
        var _this = this;
        this._ticketService.Filters.next(this.ApplyFilter());
        //See if selectedGroups has some value
        if (this.selectedGroups.length) {
            //Then get the agents of that group
            //If more than one group selected then merge the two agentlists
            this._ticketService.getAgentsAgainstGroup(this.selectedGroups).subscribe(function (agents) {
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
    TicketFiltersComponent.prototype.onDynamicItemSelect = function (event, value) {
        //console.log('OnSelect ', value);
        this._ticketService.Filters.next(this.ApplyFilter());
    };
    TicketFiltersComponent.prototype.onDynamicItemDeSelect = function (event) {
        //console.log('Deselect ', event);
        this._ticketService.Filters.next(this.ApplyFilter());
    };
    TicketFiltersComponent.prototype.DynamicFieldTextBoxChange = function (i, value) {
        this.dynamicFields[i].subscriber.next(value);
    };
    TicketFiltersComponent.prototype.clearAgent = function (event, email) {
        var _this = this;
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.agentList.map(function (a) {
            if (a.email == email) {
                a.selected = false;
                return a;
            }
        });
        this.selectedAgents.map(function (agent, index) {
            if (agent == email) {
                _this.selectedAgents.splice(index, 1);
            }
        });
        if (this.agentList.filter(function (a) { return a.selected; }).length == this.agentList.length) {
            // console.log('no agents');
            this.showNoAgents = true;
        }
        else {
            this.showNoAgents = false;
        }
        this._ticketService.Filters.next(this.ApplyFilter());
    };
    TicketFiltersComponent.prototype.clearAllAgents = function (event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.selectedAgents = [];
        this.agentList.map(function (a) {
            a.selected = false;
            return a;
        });
        if (this.agentList.filter(function (a) { return a.selected; }).length == this.agentList.length) {
            //console.log('no agents');
            this.showNoAgents = true;
        }
        else {
            this.showNoAgents = false;
        }
        this._ticketService.Filters.next(this.ApplyFilter());
    };
    TicketFiltersComponent.prototype.onItemSelect_dropdown = function (email) {
        if (!this.selectedAgents.includes(email))
            this.selectedAgents.push(email);
        this.agentList.map(function (a) {
            if (a.email == email) {
                a.selected = true;
                return a;
            }
        });
        if (this.agentList.filter(function (a) { return a.selected; }).length == this.agentList.length) {
            //console.log('no agents');
            this.showNoAgents = true;
        }
        else {
            this.showNoAgents = false;
        }
        this._ticketService.Filters.next(this.ApplyFilter());
    };
    TicketFiltersComponent.prototype.onDeSelect = function (event) {
        var _this = this;
        this._ticketService.Filters.next(this.ApplyFilter());
        //See if selectedGroups has some value
        if (this.selectedGroups.length) {
            //Then get the agents of that group
            //If more than one group selected then merge the two agentlists
            this._ticketService.getAgentsAgainstGroup(this.selectedGroups).subscribe(function (agents) {
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
    TicketFiltersComponent.prototype.onDeSelectAll = function (items) {
        this.selectedAgents = [];
        this._ticketService.Filters.next(this.ApplyFilter());
    };
    TicketFiltersComponent.prototype.onSelectAll = function (event) {
        //console.log('Onselect', this.selectedItems);
        // this.filterList
    };
    TicketFiltersComponent.prototype.onFilterChange = function ($event) {
        //console.log('onFilterChange', event);
        //console.log(this.selectedItems);
    };
    TicketFiltersComponent.prototype.updateSort = function () {
        // console.log(this.sortBy);
        this._ticketService.Filters.next(this.ApplyFilter());
    };
    TicketFiltersComponent.prototype.assignTypeChanged = function () {
        this._ticketService.Filters.next(this.ApplyFilter());
    };
    TicketFiltersComponent.prototype.mergeTypeChanged = function () {
        this._ticketService.Filters.next(this.ApplyFilter());
    };
    TicketFiltersComponent.prototype.UpdateClause = function () {
        this._ticketService.Filters.next(this.ApplyFilter());
    };
    TicketFiltersComponent.prototype.StopPropogation = function (event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
    };
    TicketFiltersComponent.prototype.ShowDateRange = function (event) {
        //console.log(event);
        // event.stopImmediatePropagation();
        // event.stopPropagation();
        this.datePicker.Show();
    };
    TicketFiltersComponent.prototype.loadMore = function (event) {
        var _this = this;
        console.log('Load More!');
        if (!this.ended && !this.loadingMoreAgents && !this.selectedGroups.length) {
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
    TicketFiltersComponent.prototype.onSearch = function (value) {
        var _this = this;
        console.log('Search');
        // console.log(value);
        if (value) {
            if (!this.selectedGroups.length) {
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
            }
            else {
                var agents = this.agentList.filter(function (a) { return a.email.includes(value.toLowerCase()); });
                this.agentList = agents;
            }
            // this.agentList = agents;
        }
        else {
            this.agentList = this.agentList_original;
            this.ended = false;
            // this.setScrollEvent();
        }
    };
    TicketFiltersComponent.prototype.ApplyFilter = function (reload) {
        // console.log(this.clause);
        if (reload === void 0) { reload = false; }
        var filters = {
            priority: this.selectedItems,
            state: this.selectedStatus,
            assigned_to: this.selectedAgents,
            // tags: this.selectedTags,
            contactNames: [],
            source: [],
            createdDate: [],
            group: this.selectedGroups,
            daterange: this.daterange
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
        this.dynamicFields.map(function (field, index) {
            if ((!Array.isArray(field.value) && field.value)) {
                //if (!matchObject.dynamicFields) matchObject.dynamicFields = {};
                matchObject["dynamicFields." + field.name] = field.value;
            }
            else if (field.value && field.value.length) {
                //if (!matchObject.dynamicFields) matchObject.dynamicFields = {};
                // console.log(field);
                matchObject["dynamicFields." + field.name] = field.value.map(function (val) { return val; });
            }
        });
        var query = this.searchValue;
        //console.log(JSON.parse(JSON.stringify(matchObject)));
        var obj = {};
        if (this.clause == '$and') {
            obj = { filter: matchObject, clause: this.clause, query: query, sortBy: this.sortBy, assignType: (!this.selectedAgents.length) ? this.agentAssignType : 'all', groupAssignType: (!this.selectedGroups.length) ? this.groupAssignType : 'all', mergeType: this.mergeType, reload: reload };
        }
        else {
            obj = { filter: matchObject, clause: this.clause, query: query, sortBy: this.sortBy, assignType: this.agentAssignType, groupAssignType: this.groupAssignType, mergeType: this.mergeType, reload: reload };
        }
        // console.log(obj);
        this._ticketService.saveFiltersOnLocalStorage(obj);
        return obj;
    };
    __decorate([
        core_1.ViewChild('scrollContainer')
    ], TicketFiltersComponent.prototype, "scrollContainer", void 0);
    __decorate([
        core_1.ViewChild('datePicker')
    ], TicketFiltersComponent.prototype, "datePicker", void 0);
    __decorate([
        core_1.ViewChild('dateRangePopper')
    ], TicketFiltersComponent.prototype, "dateRangePopper", void 0);
    TicketFiltersComponent = __decorate([
        core_1.Component({
            selector: 'app-ticket-filters',
            templateUrl: './ticket-filters.component.html',
            styleUrls: ['./ticket-filters.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], TicketFiltersComponent);
    return TicketFiltersComponent;
}());
exports.TicketFiltersComponent = TicketFiltersComponent;
//# sourceMappingURL=ticket-filters.component.js.map