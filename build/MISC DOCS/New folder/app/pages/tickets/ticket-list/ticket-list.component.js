"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketListComponent = void 0;
var core_1 = require("@angular/core");
var toast_notifications_component_1 = require("../../../dialogs/SnackBar-Dialog/toast-notifications.component");
var Subject_1 = require("rxjs/Subject");
var merge_confirmation_component_1 = require("../../../dialogs/merge-confirmation/merge-confirmation.component");
var quick_note_component_1 = require("../../../dialogs/quick-note/quick-note.component");
var export_data_component_1 = require("../../../dialogs/export-data/export-data.component");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/switchMap");
var sla_export_component_1 = require("../../../dialogs/sla-export/sla-export.component");
var TicketListComponent = /** @class */ (function () {
    // newTickets = [];
    function TicketListComponent(_ticketService, _authService, _utilityService, _tagService, snackBar, _router, dialog, _ticketAutoSvc, formbuilder, _ticketScenarios, _ticketAutomationService, _globalStateService, _slaPolicySvc) {
        var _this = this;
        this._ticketService = _ticketService;
        this._authService = _authService;
        this._utilityService = _utilityService;
        this._tagService = _tagService;
        this.snackBar = snackBar;
        this._router = _router;
        this.dialog = dialog;
        this._ticketAutoSvc = _ticketAutoSvc;
        this._ticketScenarios = _ticketScenarios;
        this._ticketAutomationService = _ticketAutomationService;
        this._globalStateService = _globalStateService;
        this._slaPolicySvc = _slaPolicySvc;
        this.toggle = true;
        this.control = true;
        this.controlS = true;
        this.loadingMoreAgents = false;
        this.UnreadIds = [];
        this.selectedWatcher = [];
        this.exists = false;
        this.tagInput = false;
        this.readTickets = false;
        this.showHideCheckbox = false;
        this.agentList_original = [];
        this.priorityOptions = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
        this.states = ['OPEN', 'PENDING', 'SOLVED', 'CLOSED'];
        this.MarkAsOptions = ['READ', 'UNREAD'];
        this.filteredOptions = [];
        this.filteredNotes = [];
        this.filteredWatchers = [];
        this.focusedTicket = undefined;
        this.all_agents = [];
        this.iDs = [];
        this.stateIds = [];
        this.scenarios = [];
        this.subscriptions = [];
        this.ticketsList = [];
        this.loadingMoreTickets = false;
        this.filteredTicketList = [];
        this.checkedList = [];
        this.groups = [];
        this.watch_agents = [];
        this.loadingTickets = true;
        this.verified = true;
        this.drawerActive = false;
        this.drawerActive_exit = false;
        this.dropDownActive = false;
        this.pageIndex = 0;
        this.paginationLimit = 50;
        this.ticketCount = 0;
        this.ended = false;
        this.endedAgents = false;
        this.searchInput = new Subject_1.Subject();
        this.filterArea = true;
        this.endedWatchers = false;
        this.loadingMoreAgentsWatchers = false;
        this.goNext = false;
        this.forceSelected = '';
        this.allActivatedPolicies = [];
        // ////console.log('Ticket List Component');
        this.subscriptions.push(this._router.params.subscribe(function (params) {
            if (params.id) {
                _this.forceSelected = params.id;
            }
        }));
        this.subscriptions.push(this._ticketService.showFilterArea.subscribe(function (value) {
            //console.log('Loading', loading);
            _this.filterArea = value;
        }));
        this.subscriptions.push(this._authService.getServer().subscribe(function (serverAddress) {
            _this.server = serverAddress;
        }));
        this.subscriptions.push(this._ticketAutoSvc.Groups.subscribe(function (data) {
            _this.groups = data;
        }));
        this.subscriptions.push(this._slaPolicySvc.AllInternalSLAPolicies.subscribe(function (data) {
            if (data && data.length) {
                data.map(function (policy) {
                    if (policy.activated) {
                        _this.allActivatedPolicies.push(policy);
                    }
                });
            }
        }));
        this.subscriptions.push(this._ticketService.getloadingTickets('MORETICKETS').debounceTime(300).subscribe(function (loading) {
            // console.log('Loading More Tickets ', loading);
            _this.loadingMoreTickets = loading;
        }));
        this.subscriptions.push(this._ticketService.getloadingTickets('TICKETS').debounceTime(300).subscribe(function (loading) {
            // console.log('Loading Tickets ', loading);
            _this.loadingTickets = loading;
        }));
        // this.subscriptions.push(this._ticketService.newTickets.subscribe(value => {
        // 	this.newTickets = value;
        // }));
        this.subscriptions.push(_authService.getAgent().subscribe(function (data) {
            _this.currAgent = data;
        }));
        this.subscriptions.push(this._ticketScenarios.AllScenarios.subscribe(function (data) {
            if (data && data.length) {
                var agents_1 = [];
                data.map(function (res) {
                    if (res.availableFor == "allagents") {
                        _this.scenarios.push(res);
                    }
                    else if (res.availableFor == _this.currAgent.email) {
                        _this.scenarios.push(res);
                    }
                    else {
                        //see for agent in group from groups defined in groupNames..
                        var filteredagent = _this.groups.filter(function (g) { return res.groupName.includes(g.group_name); }).map(function (g) { return g.agent_list; });
                        filteredagent.map(function (g) {
                            g.map(function (agent) {
                                if (agent.email == _this.currAgent.email) {
                                    agents_1.push(agent.email);
                                }
                            });
                        });
                        if (agents_1 && agents_1.length) {
                            _this.scenarios.push(res);
                        }
                    }
                });
            }
        }));
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            // //console.log(data);
            if (data && data.permissions) {
                _this.permissions = data.permissions.tickets;
                // if (this.permissions.canView == 'all') {
                // 	this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(agents => {
                // 		// this.agentList = agents;
                // 		if (agents && agents.length) {
                // 			this.all_agents = agents;
                // 			this.watch_agents = agents;
                // 		}
                // 		this.agentList_original = agents;
                // 	}));
                // } else if (this.permissions.canView == 'group') {
                // 	if (this.currAgent) {
                // 		this.subscriptions.push(this._utilityService.getAgentsAgainstGroup(this.currAgent.groups).subscribe(agents => {
                // 			// console.log(agents);
                // 			if (agents) {
                // 				this.all_agents = agents;
                // 			}
                // 			this.agentList_original = agents;
                // 		}));
                // 	}
                // } else if (this.permissions.canView == 'team') {
                // 	if (this.currAgent) {
                // 		// console.log(this.currAgent.teams);
                // 		this.subscriptions.push(this._ticketService.getAgentsAgainstTeams((this.currAgent.teams) ? this.currAgent.teams : []).subscribe(agents => {
                // 			// console.log('Getting agents agains teams');
                // 			// console.log(agents);
                // 			if (agents) {
                // 				this.all_agents = (agents as Array<any>).filter(a => !a.excluded);
                // 			}
                // 			this.agentList_original = (agents as Array<any>).filter(a => !a.excluded);
                // 		}));
                // 	}
                // }
            }
        }));
        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(function (agents) {
            // this.agentList = agents;
            if (agents && agents.length) {
                _this.all_agents = agents;
                _this.watch_agents = agents;
            }
            _this.agentList_original = agents;
        }));
        this.filterform = formbuilder.group({
            'assigned_to': [null],
            'priority': [null],
            'tags': [null]
        });
        this.searchForm = formbuilder.group({
            'searchValue': ['', []
            ]
        });
        //#region Subscriptions
        this.subscriptions.push(this._ticketService.getPagination().subscribe(function (pagination) {
            _this.pageIndex = pagination;
            //console.log(pagination);
        }));
        this.subscriptions.push(this._ticketService.getTickets().debounceTime(300).subscribe(function (ticketList) {
            _this.ticketsList = ticketList;
            if (_this.filteredTicketList.length && _this.selectedThread) {
                var itemIndex = _this.filteredTicketList.findIndex(function (ticket) { return ticket._id == _this.selectedThread._id; });
                _this.filteredTicketList[itemIndex] = _this.selectedThread;
            }
            // setTimeout(() => {
            // 	this.loading = false;
            // }, 0);
        }));
        // this.subscriptions.push(this._ticketService.getloadingTickets('TICKETS').subscribe(loading => {
        // 	this.loadingTickets = loading;
        // 	console.log("this.loadingTickets", loading);
        // }));
        this.subscriptions.push(_ticketService.getTicketsCount().subscribe(function (count) {
            _this.ticketCount = 0;
            count.map(function (countWRTState) {
                _this.ticketCount += countWRTState.count;
            });
        }));
        this.subscriptions.push(_globalStateService.drawerActive.subscribe(function (data) {
            _this.drawerActive = data;
        }));
        this.subscriptions.push(this._ticketAutomationService.Groups.subscribe(function (res) {
            _this.Groups = res;
        }));
        this.subscriptions.push(_globalStateService.drawerActive_exit.subscribe(function (data) {
            _this.drawerActive_exit = data;
        }));
        this.subscriptions.push(this._authService.getSettings().subscribe(function (settings) {
            if (settings)
                _this.verified = settings.verified;
        }));
        this.subscriptions.push(this._ticketService.getNotification().subscribe(function (notification) {
            if (notification) {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: notification.img,
                        msg: notification.msg
                    },
                    duration: 3000,
                    panelClass: ['user-alert', (notification.type == 'success') ? 'success' : 'error']
                }).afterDismissed().subscribe(function () {
                    _ticketService.clearNotification();
                });
            }
        }));
        this.subscriptions.push(_tagService.Tag.subscribe(function (data) {
            _this.Tag = data;
        }));
        this.subscriptions.push(this._authService.getAgent().subscribe(function (data) {
            _this.agent = data;
        }));
        this.subscriptions.push(this._ticketService.ActualTicketFetchedCount.subscribe(function (data) {
            _this.fetchedCount = data;
            //console.log(this.fetchedCount);
        }));
        this.searchInput.debounceTime(500)
            .distinctUntilChanged()
            .switchMap(function (term) {
            return new Observable_1.Observable(function (observer) {
                if (term) {
                    var agents_2 = _this.agentList_original.filter(function (a) { return a.email.includes(term.toLowerCase() || a.first_name.toLowerCase().includes(term.toLowerCase())); });
                    _this._utilityService.SearchAgent(term).subscribe(function (response) {
                        ////console.log(response);
                        if (response && response.agentList.length) {
                            response.agentList.forEach(function (element) {
                                if (!agents_2.filter(function (a) { return a.email == element.email; }).length) {
                                    agents_2.push(element);
                                }
                            });
                        }
                        _this.all_agents = agents_2;
                        _this.watch_agents = agents_2;
                    });
                    // this.agentList = agents;
                }
                else {
                    _this.all_agents = _this.agentList_original;
                    _this.watch_agents = _this.agentList_original;
                    // this.setScrollEvent();
                }
            });
        }).subscribe();
        //#endregion
    }
    //#region Page LifeCycle Hooks
    TicketListComponent.prototype.ngOnInit = function () {
        if (this.forceSelected) {
            //console.log(this.forceSelected)
            // this._globalStateService.NavigateTo('/tickets/ticket-view/'+this.forceSelected);
        }
    };
    //#region Abstract Actions
    TicketListComponent.prototype.popperOnHidden = function (event) {
        this.focusedTicket = undefined;
        this.filteredOptions = [];
        //console.log('HIdden');
    };
    //#endregion
    //#region Priority Menu Actions
    TicketListComponent.prototype.UpdatePriority = function (value) {
        if (this.permissions.canSetPriority) {
            this.iDs = !((this.focusedTicket) && (this.focusedTicket.id || this.focusedTicket._id)) ? this.checkedList.map(function (e) { return e._id; }) : [this.focusedTicket.id || this.focusedTicket._id];
            this._ticketService.updatePriority(this.iDs, value);
        }
        else {
            this._ticketService.setNotification('Permissions revoked!', 'error', 'warning');
        }
        this.priorityPopper.hide();
    };
    TicketListComponent.prototype.TestTicket = function () {
        var ticket = {
            type: 'email',
            subject: 'HELLO SUBJECT',
            nsp: '/localhost.com',
            priority: 'LOW',
            state: 'OPEN',
            datetime: new Date().toISOString(),
            from: 'hello@gmail.com',
            visitor: {
                name: 'Bill Gates',
                email: 'xyz@yahoo.com'
            },
            lasttouchedTime: new Date().toISOString(),
            viewState: 'UNREAD',
            createdBy: 'Agent',
            agentName: 'left@hotmail.com',
            ticketlog: [],
            mergedTicketIds: [],
            viewColor: 'blue',
            group: "Test Group",
            source: 'panel',
            slaPolicyEnabled: true
        };
        // console.log(ticket);
        this._ticketService.InsertNewTicket(ticket).subscribe(function (data) {
            // console.log("data", data);
        });
    };
    TicketListComponent.prototype.onShownPriority = function (event, ticket) {
        var _this = this;
        // console.log('On Shown', ticket);
        setTimeout(function () {
            _this.focusedTicket = ticket;
            _this.filteredOptions = _this.priorityOptions.filter(function (priority) { return !(ticket.priority == priority); });
        }, 0);
    };
    TicketListComponent.prototype.popperOnUpdatePriority = function (event) {
        //Todo Logic
    };
    TicketListComponent.prototype.onSearch = function (value) {
        var _this = this;
        // console.log('Search');
        // console.log(value);
        if (value) {
            var agents_3 = this.agentList_original.filter(function (a) { return a.email.includes(value.toLowerCase()); });
            this._utilityService.SearchAgent(value).subscribe(function (response) {
                //console.log(response);
                if (response && response.agentList.length) {
                    response.agentList.forEach(function (element) {
                        if (!agents_3.filter(function (a) { return a.email == element.email; }).length) {
                            agents_3.push(element);
                        }
                    });
                }
                _this.all_agents = agents_3;
            });
            // this.agentList = agents;
        }
        else {
            this.all_agents = this.agentList_original;
            this.endedAgents = true;
            // this.setScrollEvent();
        }
    };
    TicketListComponent.prototype.toggleFilters = function () {
        this._ticketService.toggleFilterArea();
        // this.filterArea = !this.filterArea;
    };
    //#endregion
    //#region State Menu Action
    TicketListComponent.prototype.UpdateState = function (option) {
        var _this = this;
        if (this.permissions.canChangeState) {
            this.stateIds = !((this.focusedTicket) && (this.focusedTicket.id || this.focusedTicket._id)) ? this.checkedList.map(function (e) { return e._id; }) : [this.focusedTicket.id || this.focusedTicket._id];
            // console.log(this.stateIds);
            // console.log(this.stateIds);
            this._ticketService.SetState(this.stateIds, option).subscribe(function (response) {
                _this.checkedList = [];
                var selectall = _this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
                selectall[0].checked = false;
                var elements = _this.checkboxes.nativeElement.querySelectorAll(".option_input");
                elements.forEach(function (element) {
                    if (element.checked) {
                        element.checked = false;
                    }
                });
                _this._ticketService.RefreshList();
            }, function (err) {
                _this.checkedList = [];
                var elements = _this.checkboxes.nativeElement.querySelectorAll(".option_input");
                elements.forEach(function (element) {
                    if (element.checked) {
                        element.checked = false;
                    }
                });
            });
        }
        else {
            this._ticketService.setNotification('Permissions revoked!', 'error', 'warning');
        }
        this.statePopper.hide();
    };
    TicketListComponent.prototype.popperStateShow = function (event, ticket) {
        var _this = this;
        // console.log('Ticket State Show', ticket);
        if (ticket) {
            setTimeout(function () {
                _this.focusedTicket = ticket;
                _this.filteredOptions = _this.states.filter(function (state) { return !(ticket.state == state); });
            }, 0);
        }
        else {
            this.filteredOptions = this.states;
        }
    };
    TicketListComponent.prototype.popperStateUpdate = function (event) {
        //console.log('Update State Popper', event);
    };
    //#endregion
    //#region Group Menu Actions
    TicketListComponent.prototype.UpdateGroup = function (option, single) {
        var _this = this;
        if (single === void 0) { single = false; }
        if (this.permissions.canAssignGroup) {
            this.iDs = (single) ? [this.focusedTicket._id] : this.checkedList.map(function (e) { return e._id; });
            // console.log(this.iDs);
            this._ticketService.updateGroup(this.iDs, option, (single) ? this.focusedTicket.group : '').subscribe(function (res) {
                _this.selectedGroup = '';
                _this.checkedList = [];
                var elements = _this.checkboxes.nativeElement.querySelectorAll(".option_input");
                var selectall = _this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
                selectall[0].checked = false;
                elements.forEach(function (element) {
                    if (element.checked) {
                        element.checked = false;
                    }
                });
            });
        }
        else {
            this._ticketService.setNotification('Permissions revoked!', 'error', 'warning');
        }
        this.groupPopper.hide();
    };
    TicketListComponent.prototype.ClosePopper = function () {
        this.watcherAddPopper.hide();
    };
    TicketListComponent.prototype.AddWatchers = function (ev) {
        var _this = this;
        this.selectedWatcher = ev;
        var ids = this.checkedList.map(function (e) { return e._id; });
        this._ticketService.AddWatchersToTicket(this.selectedWatcher, ids).subscribe(function (res) {
            if (res.status == "ok") {
                _this.checkedList = [];
                _this.selectedWatcher = [];
                var elements = _this.checkboxes.nativeElement.querySelectorAll(".option_input");
                var selectall = _this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
                selectall[0].checked = false;
                elements.forEach(function (element) {
                    if (element.checked) {
                        element.checked = false;
                    }
                });
            }
        });
    };
    //ticket list > watchers work:
    TicketListComponent.prototype.loadMoreWatchers = function (event) {
        var _this = this;
        if (!this.endedWatchers && !this.endedWatchers && this.selectedWatcher && !this.selectedWatcher.length) {
            //console.log('Fetch More');
            this.loadingMoreAgentsWatchers = true;
            this._utilityService.getMoreAgentsObs(this.watch_agents[this.watch_agents.length - 1].first_name).subscribe(function (response) {
                //console.log(response);
                _this.watch_agents = _this.watch_agents.concat(response.agents);
                _this.endedWatchers = response.ended;
                _this.loadingMoreAgentsWatchers = false;
            });
        }
    };
    TicketListComponent.prototype.onSearchWatchers = function (value) {
        var _this = this;
        // console.log('Search');
        if (value) {
            if (this.selectedWatcher && !this.selectedWatcher.length) {
                var agents_4 = this.watch_agents.filter(function (a) { return a.email.includes(value.toLowerCase()); });
                this._utilityService.SearchAgent(value).subscribe(function (response) {
                    //console.log(response);
                    if (response && response.agentList.length) {
                        response.agentList.forEach(function (element) {
                            if (!agents_4.filter(function (a) { return a.email == element.email; }).length) {
                                agents_4.push(element);
                            }
                        });
                    }
                    _this.watch_agents = agents_4;
                });
            }
            else {
                var agents = this.watch_agents.filter(function (a) { return a.email.includes(value.toLowerCase()); });
                this.watch_agents = agents;
            }
            // this.agentList = agents;
        }
        else {
            console.log(this.agentList_original);
            this.watch_agents = this.agentList_original;
            this.ended = false;
            // this.setScrollEvent();
        }
    };
    // refreshList(){
    // 	this._ticketService.InitializeTicketList(this._ticketService.Filters.getValue(), true);
    // }
    TicketListComponent.prototype.UpdateViewState = function (viewState) {
        var _this = this;
        var ids = this.checkedList.map(function (e) { return e._id; });
        if (this.checkedList.every(function (a) { return a.viewState.toUpperCase() == viewState.toUpperCase(); })) {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Ticket(s) are already ' + viewState
                },
                duration: 2000,
                panelClass: ['user-alert', 'warning']
            });
        }
        else {
            this._ticketService.updateViewState(viewState, ids).subscribe(function (response) {
                if (response) {
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Ticket(s) Marked As ' + viewState + ' Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                }
            });
        }
        this.checkedList = [];
        var elements = this.checkboxes.nativeElement.querySelectorAll(".option_input");
        var selectall = this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
        selectall[0].checked = false;
        elements.forEach(function (element) {
            if (element.checked) {
                element.checked = false;
            }
        });
        this.viewStatePopper.hide();
    };
    TicketListComponent.prototype.ExecuteScenario = function (scenario) {
        var _this = this;
        var iDs = this.checkedList.map(function (e) { return e._id; });
        this._ticketService.ExecuteScenario(scenario, iDs, this.checkedList).subscribe(function (res) {
            if (res) {
                //Clear checklist
                _this.checkedList = [];
                var selectall = _this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
                selectall[0].checked = false;
                var elements = _this.checkboxes.nativeElement.querySelectorAll(".option_input");
                elements.forEach(function (element) {
                    if (element.checked) {
                        element.checked = false;
                    }
                });
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'ok',
                        msg: 'Scenario executed successfully!'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'success']
                });
            }
            else {
                _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                    data: {
                        img: 'warning',
                        msg: 'Error in executing scenario'
                    },
                    duration: 2000,
                    panelClass: ['user-alert', 'warning']
                });
            }
            _this.scenarioPopper.hide();
        });
    };
    TicketListComponent.prototype.FilterGroup = function (ticket) {
        if (!ticket.group) {
            this.filteredOptions = this.Groups.map(function (element) {
                return element.group_name;
            });
        }
        else {
            var notMatched = this.Groups.filter(function (data) { return data.group_name != ticket.group; });
            ////console.log(notMatched);
            this.filteredOptions = notMatched.map(function (elements) {
                return elements.group_name;
            });
        }
    };
    TicketListComponent.prototype.FilterAgent = function (ticket) {
        var _this = this;
        var agentList = [];
        if (ticket.group) {
            // console.log(this.Groups);
            var groups = this.Groups.filter(function (g) { return g.group_name == ticket.group; });
            if (groups && groups.length) {
                // //console.log(groups[0].agent_list.map(a => a.email));
                if (groups[0].agent_list.filter(function (a) { return a.email == _this.currAgent.email && a.isAdmin; }).length) {
                    agentList = groups[0].agent_list.map(function (a) { return a.email; });
                }
                else {
                    agentList = groups[0].agent_list.filter(function (a) { return !a.excluded; }).map(function (a) { return a.email; });
                }
            }
        }
        return agentList;
    };
    TicketListComponent.prototype.popperGroupShow = function (event, ticket) {
        var _this = this;
        setTimeout(function () {
            _this.focusedTicket = ticket;
            _this.ticketsList.forEach(function (element) {
                if (element._id == ticket._id) {
                    _this.FilterGroup(element);
                    if (ticket.group) {
                        _this.FilterAgent(ticket);
                    }
                }
            });
        }, 0);
    };
    TicketListComponent.prototype.popperGroupUpdate = function (event) {
    };
    //#endregion
    //#region Popper Agent
    TicketListComponent.prototype.UpdateAgent = function (assigningAgent, single) {
        var _this = this;
        if (single === void 0) { single = false; }
        if (this.permissions.canAssignAgent) {
            this.iDs = (single) ? [this.focusedTicket._id] : this.checkedList.map(function (e) { return e._id; });
            this._ticketService.assignAgentForTicket(this.iDs, assigningAgent, (single) ? this.focusedTicket.assigned_to : '').subscribe(function (response) {
                _this.checkedList = [];
                _this.selectedAgent = undefined;
                _this.selectedAgent = '';
                assigningAgent = '';
                var elements = _this.checkboxes.nativeElement.querySelectorAll(".option_input");
                var selectall = _this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
                selectall[0].checked = false;
                elements.forEach(function (element) {
                    if (element.checked) {
                        element.checked = false;
                    }
                });
            });
            // this._ticketService.RefreshList();
        }
        else {
            this._ticketService.setNotification('Permissions revoked!', 'error', 'warning');
        }
        this.agentPopper.hide();
    };
    //select-single
    TicketListComponent.prototype.onCheckboxChange = function (checkedDetails, event) {
        var selectall = this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
        //for splicing
        var index = this.checkedList.findIndex(function (x) { return x._id == checkedDetails._id; });
        // if (this.ticketsList.length - 50 == this.checkedList.length) {
        // 	selectall[0].checked = true;
        // }
        //if checked
        if (event.target.checked) {
            checkedDetails.selected = true;
            this.checkedList.push(checkedDetails);
            if (this.ticketsList.length == ((this.pageIndex + 1) * this.checkedList.length)) {
                selectall[0].checked = true;
            }
        }
        //if unchecked
        else if (!event.target.checked) {
            checkedDetails.selected = false;
            selectall[0].checked = false;
            this.checkedList.splice(index, 1);
        }
    };
    //select-All
    TicketListComponent.prototype.selectAll = function (event) {
        this.checkedList = [];
        var selectall = this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
        // console.log("select all");
        if (event.target.checked) {
            // this.ticketsList.forEach(ticket => {
            // 	ticket.selected = true;
            // })
            if (this.goNext) {
                this.checkedList = this.page2Tickets;
            }
            else {
                var copyOfTickets = Array.from(this.ticketsList);
                this.checkedList = copyOfTickets;
            }
            var elements = this.checkboxes.nativeElement.querySelectorAll(".option_input");
            elements.forEach(function (element) {
                element.checked = true;
            });
        }
        else if (!event.target.checked) {
            this.ticketsList.forEach(function (ticket) {
                ticket.selected = false;
            });
            var elements = this.checkboxes.nativeElement.querySelectorAll(".option_input");
            elements.forEach(function (element) {
                element.checked = false;
            });
        }
    };
    TicketListComponent.prototype.popperAgentShow = function (event, ticket) {
        var _this = this;
        setTimeout(function () {
            _this.focusedTicket = ticket;
            _this.ticketsList.forEach(function (element) {
                if (element._id == ticket._id) {
                    if (_this.permissions.canView != 'team') {
                        if (ticket.group) {
                            // console.log(ticket.group);
                            _this.filteredOptions = _this.FilterAgent(ticket);
                        }
                        else {
                            _this._utilityService.getAllAgentsListObs().subscribe(function (agents) {
                                agents.map(function (agent) { return _this.filteredOptions.push(agent.email); });
                            });
                        }
                    }
                    else {
                        _this.filteredOptions = _this.agentList_original.map(function (a) { return a.email; });
                    }
                }
            });
        }, 0);
    };
    TicketListComponent.prototype.popperNoteShow = function (event, ticket) {
        var _this = this;
        setTimeout(function () {
            var notes = [];
            if (ticket.ticketNotes && ticket.ticketNotes.length) {
                notes = ticket.ticketNotes;
            }
            _this.filteredNotes = notes;
        }, 0);
    };
    TicketListComponent.prototype.popperAgentUpdate = function (event) {
    };
    TicketListComponent.prototype.onDeSelect = function (event) {
        this.selectedWatcher = event;
    };
    //#endregion
    TicketListComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    //#endregion
    //#region Support Functions
    /**
     * @NOTE : OLD CODE REMOVE
     */
    TicketListComponent.prototype.FilterTicketToView = function (ticketsList) {
        var _this = this;
        /**
         * CONDTIONS:
         * OPEN,PENDING,SOLVED: not merged ticket ids length and state not closed.
         * MERGED: merged ticket ids length and state not closed.
         * CLOSED: state closed.
         */
        if (ticketsList && ticketsList.length) {
            return ticketsList.filter(function (tick, index) { return (index >= (_this.pageIndex * _this.paginationLimit)) && (index < (_this.pageIndex * _this.paginationLimit) + _this.paginationLimit); });
        }
    };
    TicketListComponent.prototype.ToggleAgent = function () {
        this.control = !this.control;
    };
    TicketListComponent.prototype.ToggleState = function () {
        this.controlS = !this.controlS;
    };
    TicketListComponent.prototype.onScroll = function ($event) {
        var _this = this;
        //console.log('Scroll');
        if (!this.ended) {
            //console.log('Fetch More');
            this._utilityService.getMoreAgentsObs(this.all_agents[this.all_agents.length - 1].first_name).subscribe(function (response) {
                //console.log(response);
                _this.all_agents = _this.all_agents.concat(response.agents);
                _this.ended = response.ended;
            });
        }
    };
    TicketListComponent.prototype.ShowHideCheckbox = function () {
        this.showHideCheckbox = !this.showHideCheckbox;
        this.checkedList = [];
        var elements = this.checkboxes.nativeElement.querySelectorAll(".option_input");
        elements.forEach(function (element) {
            if (element.checked) {
                element.checked = false;
            }
        });
    };
    TicketListComponent.prototype.MarkRead = function () {
        var _this = this;
        var ReadIds = this.checkedList.map(function (e) { return e._id; });
        if (this.checkedList.every(function (a) { return a.viewState == 'READ'; })) {
            this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                data: {
                    img: 'warning',
                    msg: 'Ticket(s) are already Read!'
                },
                duration: 2000,
                panelClass: ['user-alert', 'warning']
            });
        }
        else {
            this._ticketService.updateViewState('READ', ReadIds).subscribe(function (response) {
                if (response) {
                    _this.snackBar.openFromComponent(toast_notifications_component_1.ToastNotifications, {
                        data: {
                            img: 'ok',
                            msg: 'Ticket(s) Marked As Read Successfully!'
                        },
                        duration: 2000,
                        panelClass: ['user-alert', 'success']
                    });
                }
            });
        }
        this.checkedList = [];
        ReadIds = [];
        var elements = this.checkboxes.nativeElement.querySelectorAll(".option_input");
        var selectall = this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
        selectall[0].checked = false;
        elements.forEach(function (element) {
            if (element.checked) {
                element.checked = false;
            }
        });
    };
    //Go To TicketView
    TicketListComponent.prototype.setSelectedThread = function (id) {
        // this._ticketService.setSelectedThread(id);
        this._globalStateService.NavigateForce('/tickets/ticket-view/' + id);
    };
    TicketListComponent.prototype.getNext = function () {
        var _this = this;
        this.checkedList = [];
        this.goNext = true;
        this.ticketsList.forEach(function (ticket) {
            ticket.selected = false;
        });
        var selectall = this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
        selectall[0].checked = false;
        var loadMore = false;
        if (this.loadingMoreTickets)
            return;
        if ((this.pageIndex + 1) <= this.ticketCount / this.paginationLimit) {
            if (this.fetchedCount <= ((this.pageIndex + 1) * this.paginationLimit))
                loadMore = true; //(50 <= ((1) * 50))
            if (loadMore)
                this.loadingMoreTickets = true;
            var diff = (this._ticketService.ThreadList.getValue().length - this.fetchedCount); // (50 - 50) diff = 0
            var a = (diff / this.paginationLimit); // a = (0 / 50)
            if (a >= 1)
                loadMore = false;
            if (!loadMore)
                this._ticketService.setPagination(this.pageIndex + 1);
        }
        if (loadMore) {
            this.subscriptions.push(this._ticketService.getMoreTicketFromBackend().subscribe(function (response) {
                if (response.status == 'ok') {
                    _this.page2Tickets = response.tick;
                    _this._ticketService.setPagination(_this.pageIndex + 1);
                }
            }, function (err) { }));
        }
    };
    TicketListComponent.prototype.getPrevious = function () {
        this.checkedList = [];
        var selectall = this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
        selectall[0].checked = false;
        this.ticketsList.forEach(function (ticket) {
            ticket.selected = false;
        });
        if (this.pageIndex > 0)
            this.pageIndex -= 1;
    };
    TicketListComponent.prototype.StopPropagation = function (event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
    };
    //loadMore custom-select
    TicketListComponent.prototype.loadMoreAgents = function (event) {
        var _this = this;
        if (!this.endedAgents && !this.loadingMoreAgents && this.selectedAgent && !this.selectedAgent.length) {
            this.loadingMoreAgents = true;
            this._utilityService.getMoreAgentsObs(this.all_agents[this.all_agents.length - 1].first_name).subscribe(function (response) {
                _this.all_agents = _this.all_agents.concat(response.agents);
                _this.endedAgents = response.ended;
                _this.loadingMoreAgents = false;
            });
        }
    };
    TicketListComponent.prototype.ShowMergeDialogBox = function () {
        var _this = this;
        this._globalStateService.drawerActive.next(false);
        this.dialog.open(merge_confirmation_component_1.MergeConfirmationComponent, {
            panelClass: ['responsive-dialog'],
            disableClose: true,
            autoFocus: true,
            data: this.checkedList
        }).afterClosed().subscribe(function (data) {
            if (data.status == "ok") {
                _this.checkedList = [];
                var selectall = _this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
                selectall[0].checked = false;
                var elements = _this.checkboxes.nativeElement.querySelectorAll(".option_input");
                elements.forEach(function (element) {
                    if (element.checked) {
                        element.checked = false;
                    }
                });
            }
            else {
                return;
            }
        });
    };
    TicketListComponent.prototype.gotoScenario = function () {
        this._globalStateService.NavigateForce('/settings/ticket-management/scenario-automation');
    };
    TicketListComponent.prototype.ShowExportTicketDialog = function () {
        var _this = this;
        this._globalStateService.drawerActive.next(false);
        this.dialog.open(export_data_component_1.ExportDataComponent, {
            panelClass: ['responsive-dialog'],
            disableClose: true,
            autoFocus: true,
            data: this.checkedList
        }).afterClosed().subscribe(function (data) {
            _this.checkedList = [];
            var selectall = _this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
            selectall[0].checked = false;
            var elements = _this.checkboxes.nativeElement.querySelectorAll(".option_input");
            elements.forEach(function (element) {
                if (element.checked) {
                    element.checked = false;
                }
            });
        });
    };
    TicketListComponent.prototype.ShowQuickNoteDialogBox = function () {
        var _this = this;
        this._globalStateService.drawerActive.next(false);
        this.dialog.open(quick_note_component_1.QuickNoteComponent, {
            panelClass: ['quick-note'],
            disableClose: false,
            autoFocus: true,
            data: {
                details: this.checkedList,
            }
        }).afterClosed().subscribe(function (data) {
            _this.checkedList = [];
            var selectall = _this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
            selectall[0].checked = false;
            var elements = _this.checkboxes.nativeElement.querySelectorAll(".option_input");
            elements.forEach(function (element) {
                if (element.checked) {
                    element.checked = false;
                }
            });
        });
    };
    TicketListComponent.prototype.displaySource = function (source) {
        switch (source) {
            case 'email':
                return { name: 'Email', img: 'email-colored' };
            case 'livechat':
                return { name: 'Live Chat', img: 'visitors-colored' };
            case 'panel':
                return { name: 'Beelinks Portal', img: 'agents-colored' };
            default:
                return { name: 'N/A', img: 'agents' };
        }
    };
    TicketListComponent.prototype.ngAfterViewInit = function () {
        if (this.forceSelected) {
            this.setSelectedThread(this.forceSelected);
        }
    };
    TicketListComponent.prototype.ngAfterViewChecked = function () {
        //Called after every check of the component's view. Applies to components only.
        //Add 'implements AfterViewChecked' to the class.
    };
    //#endregion
    //#region Watchers
    TicketListComponent.prototype.popperWatcherShow = function (event, ticket) {
        var _this = this;
        setTimeout(function () {
            _this.watcherFocused = ticket;
            var watch = [];
            if (ticket.watchers && ticket.watchers.length) {
                watch = ticket.watchers;
            }
            _this.filteredWatchers = watch;
        }, 0);
    };
    TicketListComponent.prototype.deleteWatcher = function (watcher) {
        this._ticketService.DeleteWatcherAgent(watcher, this.watcherFocused._id);
    };
    //#endregion
    //#region Policies
    TicketListComponent.prototype.ShowTime = function () {
        var _this = this;
        var time = '';
        this.allActivatedPolicies.map(function (single) {
            single.policyTarget.map(function (res) {
                if (_this.policiesTicket && res.priority == _this.policiesTicket.priority) {
                    time = res.TimeKey + ' ' + res.TimeVal;
                }
            });
        });
        return time;
    };
    TicketListComponent.prototype.popperPoliciesShow = function (event, ticket) {
        var _this = this;
        setTimeout(function () {
            _this.policiesTicket = ticket;
        }, 0);
    };
    //#endregion
    TicketListComponent.prototype.ShowSLAExportTicketDialog = function () {
        var _this = this;
        this._globalStateService.drawerActive.next(false);
        this.dialog.open(sla_export_component_1.SlaExportComponent, {
            panelClass: ['responsive-dialog'],
            disableClose: true,
            autoFocus: true,
            data: this.checkedList
        }).afterClosed().subscribe(function (data) {
            _this.checkedList = [];
            var selectall = _this.selectAllCheckboxes.nativeElement.querySelectorAll(".selectAll_input");
            selectall[0].checked = false;
            var elements = _this.checkboxes.nativeElement.querySelectorAll(".option_input");
            elements.forEach(function (element) {
                if (element.checked) {
                    element.checked = false;
                }
            });
        });
    };
    TicketListComponent.prototype.seeCMID = function (ticket) {
        var res = ticket.subject.split('/');
        if (res && res.length) {
            if (res[4] && res[4].trim() == 'Beelinks' && ticket.CustomerInfo && ticket.CustomerInfo.customerId) {
                if (res[2] && res[2].toString().trim() == ticket.CustomerInfo.customerId.toString().trim()) {
                    return false;
                }
                else
                    return true;
            }
        }
        else
            return false;
    };
    TicketListComponent.prototype.SendABC = function () {
        this._ticketService.sendemailtousers();
    };
    TicketListComponent.prototype.SendCC = function () {
        this._ticketService.sendemailtoCC();
    };
    TicketListComponent.prototype.SendGHI = function () {
        this._ticketService.sendemailtoagentss();
    };
    TicketListComponent.prototype.Response = function () {
        this._ticketService.sendreponse();
    };
    __decorate([
        core_1.ViewChild('priorityPopper')
    ], TicketListComponent.prototype, "priorityPopper", void 0);
    __decorate([
        core_1.ViewChild('statePopper')
    ], TicketListComponent.prototype, "statePopper", void 0);
    __decorate([
        core_1.ViewChild('tagAddPopper')
    ], TicketListComponent.prototype, "tagAddPopper", void 0);
    __decorate([
        core_1.ViewChild('groupPopper')
    ], TicketListComponent.prototype, "groupPopper", void 0);
    __decorate([
        core_1.ViewChild('agentPopper')
    ], TicketListComponent.prototype, "agentPopper", void 0);
    __decorate([
        core_1.ViewChild('viewStatePopper')
    ], TicketListComponent.prototype, "viewStatePopper", void 0);
    __decorate([
        core_1.ViewChild('scenarioPopper')
    ], TicketListComponent.prototype, "scenarioPopper", void 0);
    __decorate([
        core_1.ViewChild('watcherAddPopper')
    ], TicketListComponent.prototype, "watcherAddPopper", void 0);
    __decorate([
        core_1.ViewChild('checkboxes')
    ], TicketListComponent.prototype, "checkboxes", void 0);
    __decorate([
        core_1.ViewChild('selectAllCheckboxes')
    ], TicketListComponent.prototype, "selectAllCheckboxes", void 0);
    __decorate([
        core_1.ViewChild('myAgent')
    ], TicketListComponent.prototype, "myAgent", void 0);
    __decorate([
        core_1.ViewChild('myTag')
    ], TicketListComponent.prototype, "myTag", void 0);
    TicketListComponent = __decorate([
        core_1.Component({
            selector: 'app-ticket-list',
            templateUrl: './ticket-list.component.html',
            styleUrls: ['./ticket-list.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], TicketListComponent);
    return TicketListComponent;
}());
exports.TicketListComponent = TicketListComponent;
//# sourceMappingURL=ticket-list.component.js.map