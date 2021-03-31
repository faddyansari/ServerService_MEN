"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentListSidebarComponent = void 0;
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var AgentListSidebarComponent = /** @class */ (function () {
    function AgentListSidebarComponent(_authService, _appStateService, _agentService, _utilityService, _router, dialog, snackBar, formbuilder) {
        var _this = this;
        this._authService = _authService;
        this._appStateService = _appStateService;
        this._agentService = _agentService;
        this._utilityService = _utilityService;
        this._router = _router;
        this.dialog = dialog;
        this.snackBar = snackBar;
        this.scrollHeight = 0;
        this.loadingMoreAgents = false;
        this.agentList = [];
        this.agentList_original = [];
        this.subscriptions = [];
        this.forceSelected = '';
        this.sortBy = '';
        this.activeCount = 0;
        this.idleCount = 0;
        this.offlineCount = 0;
        this.expandAddAgent = false;
        //To Show Requesting Status
        this.loading = false;
        this.numbersArray = Array(15).fill(0).map(function (x, i) { return i; });
        this.agentConversations = [];
        this.onSearchInput = new Subject_1.Subject();
        this.verified = true;
        this.showAgentInfo = false;
        this.fetchMoreEnabled = true;
        this.subscriptions.push(this._router.params.subscribe(function (params) {
            if (params.id) {
                _this.forceSelected = params.id;
            }
        }));
        this.subscriptions.push(this._authService.getAgent().subscribe(function (data) {
            _this.Agent = data;
        }));
        this.subscriptions.push(_agentService.isSelfViewingChat.subscribe(function (data) {
            _this.isSelfViewingChat = data;
        }));
        this.subscriptions.push(this._authService.getSettings().subscribe(function (settings) {
            if (settings && Object.keys(settings).length)
                _this.verified = settings.verified;
        }));
        this.subscriptions.push(this._agentService.searchValue.debounceTime(300).subscribe(function (value) {
            _this.searchValue = value;
            if (_this.searchValue) {
                _this.fetchMoreEnabled = false;
                var agents_1 = _this.agentList_original.filter(function (a) { return a.email.includes(_this.searchValue.toLowerCase() || a.first_name.toLowerCase().includes(_this.searchValue.toLowerCase())); });
                // let agents = [];
                _this._utilityService.SearchAgent(_this.searchValue).subscribe(function (response) {
                    // console.log(response);
                    if (response && response.agentList.length) {
                        response.agentList.forEach(function (element) {
                            if (!agents_1.filter(function (a) { return a.email == element.email; }).length) {
                                agents_1.push(element);
                            }
                        });
                    }
                    agents_1.sort(function (a, b) {
                        return (a.first_name < b.first_name) ? -1 : 1;
                    });
                    _this.agentList = agents_1;
                });
                _this._agentService.FilteredAgents.next((agents_1) ? agents_1 : []);
                // this.agentList = agents;
            }
            else {
                _this.fetchMoreEnabled = true;
                // this._agentService.getAllAgentsAsync(this._agentService.selectedFilter.getValue());
                _this.agentList = _this.agentList_original;
                _this._agentService.FilteredAgents.next([]);
                // this.setScrollEvent();
            }
        }));
        this.subscriptions.push(this._agentService.getAllAgentsList().subscribe(function (data) {
            // console.log('Agent List Subscribed');
            // console.log(data);
            _this.agentList = data;
            _this.agentList_original = data;
            if (_this.forceSelected) {
                _this.setSelectedAgent(_this.forceSelected);
            }
            // this.activeCount = 0;
            // this.idleCount = 0;
            // this.offlineCount = 0;
            // data.map(agent => {
            //     (!agent.liveSession) ? this.offlineCount += 1 :
            //         (agent.liveSession.state == 'ACTIVE') ? this.activeCount += 1 : this.idleCount += 1;
            // });
        }));
        this.subscriptions.push(this._agentService.getSelectedAgent().subscribe(function (data) {
            _this.selectedAgent = data;
        }));
        this.subscriptions.push(this._agentService.agentConversationList.subscribe(function (data) {
            _this.agentConversations = data;
            _this.agentList.forEach(function (agent) {
                _this.agentConversations.forEach(function (thread) {
                    if (thread.to == agent.email || thread.from == agent.email) {
                        if (thread.LastSeen && thread.LastSeen.length && (thread.to == _this.Agent.email || thread.from == _this.Agent.email)) {
                            var count = thread.LastSeen.find(function (data) { return data.id == _this.Agent.email; }).messageReadCount;
                            var LastUpdated = thread.LastUpdated;
                            if (_this.isSelfViewingChat.chatId == thread._id && _this.isSelfViewingChat.value) {
                                Object.assign(agent, { 'messageReadCount': 0 });
                            }
                            else {
                                Object.assign(agent, { 'messageReadCount': count });
                            }
                            Object.assign(agent, { 'LastUpdated': LastUpdated });
                        }
                    }
                });
            });
        }));
        this.subscriptions.push(_agentService.selectedAgentConversation.subscribe(function (data) {
            _this.selectedAgentConversation = data;
        }));
        // //Agent Search
        // const onsearchinput = this.onSearchInput
        // .map(event => event)
        // .debounceTime(2000)
        // .switchMap(() => {
        // 	//console.log("Searching...");
        // 	return new Observable((observer) => {
        // 		let searchvalue = this.searchValue;
        // 		if (searchvalue) {
        // 			this.fetchMoreEnabled = false;
        // 			let agents = this.agentList_original.filter(a => a.email.includes(searchvalue.toLowerCase() || a.first_name.toLowerCase().includes(searchvalue.toLowerCase())));
        // 			this._agentService.SearchAgent(searchvalue).subscribe((response) => {
        // 				//console.log(response);
        // 				if (response && response.agentList.length) {
        // 					response.agentList.forEach(element => {
        // 						if(!agents.filter(a => a.email == element.email).length){
        // 							agents.push(element);
        // 						}
        // 					});
        // 				} 
        // 				this.agentList = agents;
        // 			});
        // 			this.agentList = agents;
        // 		} else {
        // 			this.fetchMoreEnabled = true;
        // 			this.agentList = this.agentList_original;
        // 			// this.setScrollEvent();
        // 		}
        // 	});
        // }).subscribe();
    }
    AgentListSidebarComponent.prototype.ngOnInit = function () {
    };
    AgentListSidebarComponent.prototype.updateControlSideBar = function () {
        this._appStateService.ToggleControlSideBarState();
    };
    AgentListSidebarComponent.prototype.ngAfterViewInit = function () {
        // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        // Add 'implements AfterViewInit' to the class.
        // this._agentService.getAllAgents();
        this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
        // console.log('View Init');
    };
    AgentListSidebarComponent.prototype.ngAfterViewChecked = function () {
        //Called after every check of the component's view. Applies to components only.
        //Add 'implements AfterViewChecked' to the class.
        if (this.loadingMoreAgents) {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight + 20;
            // this.scrollRef.scrollYTo(this.scrollRef.view.scrollHeight + 20);
        }
    };
    AgentListSidebarComponent.prototype.ScrollChanged = function (event) {
        var _this = this;
        if (Math.round(event.target.scrollTop + event.target.clientHeight) >= (this.scrollContainer.nativeElement.scrollHeight - 10)) {
            console.log('Fetch more agents');
            if (this.searchValue) {
                var agents_2 = this._agentService.FilteredAgents.getValue().filter(function (a) { return a.email.includes(_this.searchValue.toLowerCase() || a.first_name.toLowerCase().includes(_this.searchValue.toLowerCase())); });
                this._utilityService.SearchAgent(this.searchValue, agents_2[agents_2.length - 1].first_name).subscribe(function (response) {
                    //console.log(response);
                    if (response && response.agentList.length) {
                        response.agentList.forEach(function (element) {
                            if (!agents_2.filter(function (a) { return a.email == element.email; }).length) {
                                agents_2.push(element);
                            }
                        });
                    }
                    agents_2.sort(function (a, b) {
                        return (a.first_name < b.first_name) ? -1 : 1;
                    });
                    _this.agentList = agents_2;
                });
                this._agentService.FilteredAgents.next((agents_2) ? agents_2 : []);
            }
            else {
                this._agentService.getMoreAgents();
            }
            //   this._chatService.getMoreArchivesFromBackend();
        }
        this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
    };
    AgentListSidebarComponent.prototype.SortBy = function (agentList) {
        var _this = this;
        if (this.agentList.length > 0) {
            if (!this.sortBy) {
                return this.agentList;
            }
            else {
                return this.agentList.filter(function (agent) {
                    if (_this.sortBy == 'ACTIVE') {
                        return (agent.liveSession && agent.liveSession.state == 'ACTIVE');
                    }
                    else if (_this.sortBy == 'IDLE') {
                        return (agent.liveSession && agent.liveSession.state == 'IDLE');
                    }
                    else if (_this.sortBy == 'OFFLINE') {
                        return (!agent.liveSession);
                    }
                });
            }
        }
        else {
            return [];
        }
    };
    AgentListSidebarComponent.prototype.setFilter = function (filter) {
        this.sortBy = filter;
    };
    AgentListSidebarComponent.prototype.setSelectedAgent = function (agentid) {
        //console.log(agentid);
        // this._agentService.isStatActive.next(false);
        // if (this.searchValue) {
        //     this.agentList.map(agent => {
        //         if (agent._id == agentid) {
        //             // console.log('Setting Selected Agent')
        //            this._agentService.ResetSelected(agent)
        //             // this.ViewingChat(false,'');       
        //             // console.log(this.agentConversation.getValue())
        //         }
        //     });
        // }
        if (!(this.selectedAgent && this.selectedAgent._id == agentid)) {
            this._agentService.setSelectedAgent(agentid);
        }
    };
    AgentListSidebarComponent.prototype.trackBy = function (index, item) {
        return item._id;
    };
    AgentListSidebarComponent.prototype.ngOnDestroy = function () {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
        this._appStateService.showAgentModal(false);
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this._agentService.searchValue.next('');
    };
    __decorate([
        core_1.ViewChild('scrollContainer')
    ], AgentListSidebarComponent.prototype, "scrollContainer", void 0);
    AgentListSidebarComponent = __decorate([
        core_1.Component({
            selector: 'app-agent-list-sidebar',
            templateUrl: './agent-list-sidebar.component.html',
            styleUrls: ['./agent-list-sidebar.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AgentListSidebarComponent);
    return AgentListSidebarComponent;
}());
exports.AgentListSidebarComponent = AgentListSidebarComponent;
//# sourceMappingURL=agent-list-sidebar.component.js.map