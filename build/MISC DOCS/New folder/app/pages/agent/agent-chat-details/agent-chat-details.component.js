"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentChatDetailsComponent = void 0;
var core_1 = require("@angular/core");
var AgentChatDetailsComponent = /** @class */ (function () {
    function AgentChatDetailsComponent(_agentService, _utilityService, formbuilder) {
        var _this = this;
        this._agentService = _agentService;
        this._utilityService = _utilityService;
        this.formbuilder = formbuilder;
        this.optionsEnabled = false;
        this.subscriptions = [];
        this.agentList = [];
        this.agentList_original = [];
        this.selectedAgents = [];
        this.ended = false;
        this.tabs = {
            'group_info': true,
            'members': false,
            'media': false
        };
        if (this.conversation) {
            this.optionsEnabled = this.conversation.members.some(function (m) { return m.email == _this.agent.email && m.isAdmin; });
        }
        this.subscriptions.push(this._utilityService.getAllAgentsListObs().subscribe(function (data) {
            // console.log(data);
            if (data) {
                _this.agentList = data;
                _this.agentList_original = data;
            }
        }));
        this.searchForm = formbuilder.group({
            'searchValue': ['', []
            ]
        });
    }
    AgentChatDetailsComponent.prototype.ngOnInit = function () {
    };
    AgentChatDetailsComponent.prototype.vhListTabs = function (tab) {
        var _this = this;
        Object.keys(this.tabs).map(function (key) {
            if (key == tab) {
                _this.tabs[key] = true;
            }
            else {
                _this.tabs[key] = false;
            }
        });
    };
    AgentChatDetailsComponent.prototype.displayActions = function () {
        var _this = this;
        var member = this.conversation.members.filter(function (m) { return m.email == _this.agent.email; })[0];
        if (member) {
            return member.isAdmin;
        }
        else {
            return false;
        }
    };
    AgentChatDetailsComponent.prototype.removeMember = function (email) {
        var _this = this;
        this._agentService.removeMember(email, this.conversation._id).subscribe(function (data) {
            if (data) {
                _this.conversation = data;
                // this.selectedAgents = [];
            }
        });
    };
    AgentChatDetailsComponent.prototype.makeAdmin = function (email, value) {
        var _this = this;
        this._agentService.toggleAdmin(email, this.conversation._id, value).subscribe(function (data) {
            if (data) {
                _this.conversation = data;
            }
        });
    };
    AgentChatDetailsComponent.prototype.addMember = function () {
        var _this = this;
        if (this.selectedAgents) {
            this._agentService.addMember(this.selectedAgents, this.conversation._id).subscribe(function (data) {
                if (data) {
                    _this.conversation = data;
                    _this.selectedAgents = [];
                }
            });
        }
    };
    //Custom select events
    AgentChatDetailsComponent.prototype.loadMore = function ($event) {
        var _this = this;
        // console.log('Scroll');
        if (!this.ended) {
            console.log('Fetch More');
            this._agentService.getMoreAgentsObs(this.agentList[this.agentList.length - 1].first_name).subscribe(function (response) {
                console.log(response);
                _this.agentList = _this.agentList.concat(response.agents);
                _this.ended = response.ended;
            });
        }
    };
    AgentChatDetailsComponent.prototype.onSearch = function (value) {
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
    AgentChatDetailsComponent.prototype.CloseViewHistory = function () {
        this._agentService.closeDetail.next(false);
    };
    AgentChatDetailsComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    __decorate([
        core_1.Input()
    ], AgentChatDetailsComponent.prototype, "conversation", void 0);
    __decorate([
        core_1.Input()
    ], AgentChatDetailsComponent.prototype, "agent", void 0);
    AgentChatDetailsComponent = __decorate([
        core_1.Component({
            selector: 'app-agent-chat-details',
            templateUrl: './agent-chat-details.component.html',
            styleUrls: ['./agent-chat-details.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AgentChatDetailsComponent);
    return AgentChatDetailsComponent;
}());
exports.AgentChatDetailsComponent = AgentChatDetailsComponent;
//# sourceMappingURL=agent-chat-details.component.js.map