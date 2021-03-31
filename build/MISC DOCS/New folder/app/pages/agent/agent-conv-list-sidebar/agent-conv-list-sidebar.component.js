"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentConvListSidebarComponent = void 0;
var core_1 = require("@angular/core");
var AgentConvListSidebarComponent = /** @class */ (function () {
    function AgentConvListSidebarComponent(_agentService, formbuilder, _authService) {
        var _this = this;
        this._agentService = _agentService;
        this.formbuilder = formbuilder;
        this._authService = _authService;
        this.subscriptions = [];
        this.loading = false;
        this.verified = true;
        this.conversationList = [];
        this.conversationList_original = [];
        this.subscriptions.push(_agentService.agentConversationList.subscribe(function (data) {
            _this.conversationList = data;
            _this.conversationList_original = data;
            // console.log(this.conversationList);
        }));
        this.subscriptions.push(_authService.getAgent().subscribe(function (data) {
            _this.agent = data;
        }));
        this.subscriptions.push(_agentService.selectedAgentConversation.subscribe(function (data) {
            _this.selectedThread = data;
        }));
        this.subscriptions.push(_agentService.searchValue.debounceTime(300).subscribe(function (data) {
            _this.searchValue = data;
            if (_this.searchValue) {
                // console.log(this.searchValue);
                var list_1 = [];
                _this.conversationList_original.forEach(function (conv) {
                    if (conv.members.filter(function (a) { return a.email.includes(_this.searchValue.trim()); }).length) {
                        list_1.push(conv);
                    }
                });
                _this.conversationList = list_1;
            }
            else {
                _this.conversationList = _this.conversationList_original;
            }
        }));
        this.subscriptions.push(_agentService.loadingConversation.subscribe(function (data) {
            _this.loading = data;
        }));
        this.subscriptions.push(this._authService.getSettings().subscribe(function (settings) {
            if (settings && Object.keys(settings).length)
                _this.verified = settings.verified;
        }));
        this.subscriptions.push(_agentService.isSelfViewingChat.subscribe(function (data) {
            _this.isSelfViewingAgentChat = data;
        }));
    }
    AgentConvListSidebarComponent.prototype.ngOnInit = function () {
    };
    AgentConvListSidebarComponent.prototype.setSelectedConversation = function (cid) {
        // console.log(conversation);
        // this._agentService.GetContactByEmail((conversation.to == this.agent.email) ? conversation.from : conversation.to);
        this._agentService.getConversationByID(cid);
    };
    AgentConvListSidebarComponent.prototype.displayLastSeen = function (conversation) {
        var _this = this;
        if (conversation.members.filter(function (m) { return m.email == _this.agent.email; }).length) {
            return true;
        }
        else {
            return false;
        }
    };
    AgentConvListSidebarComponent.prototype.returnLastSeen = function (LastSeen) {
        var _this = this;
        return LastSeen.filter(function (item) { return item.email == _this.agent.email; })[0];
    };
    AgentConvListSidebarComponent.prototype.ngOnDestroy = function () {
        this._agentService.searchValue.next('');
    };
    AgentConvListSidebarComponent = __decorate([
        core_1.Component({
            selector: 'app-agent-conv-list-sidebar',
            templateUrl: './agent-conv-list-sidebar.component.html',
            styleUrls: ['./agent-conv-list-sidebar.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AgentConvListSidebarComponent);
    return AgentConvListSidebarComponent;
}());
exports.AgentConvListSidebarComponent = AgentConvListSidebarComponent;
//# sourceMappingURL=agent-conv-list-sidebar.component.js.map