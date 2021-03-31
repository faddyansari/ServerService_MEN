"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationDetailsComponent = void 0;
var core_1 = require("@angular/core");
var ConversationDetailsComponent = /** @class */ (function () {
    function ConversationDetailsComponent(_crmService, _authService) {
        var _this = this;
        this._crmService = _crmService;
        this._authService = _authService;
        this.MessageList = [];
        this.subscriptions = [];
        this.scrollHeight = 0;
        this.loading = false;
        // console.log('Archives Loaded');
        this.subscriptions.push(_crmService.getLoadingVariable().subscribe(function (data) {
            _this.loading = data;
        }));
        this.subscriptions.push(_crmService.getSelectedCustomer().subscribe(function (customer) {
            _this.selectedCustomer = customer;
        }));
        this.subscriptions.push(_crmService.getCurrentConversation().subscribe(function (conversation) {
            console.log(conversation);
            _this.Conversation = conversation;
            _this.MessageList = conversation.msgList;
        }));
        this.subscriptions.push(this._authService.Agent.subscribe(function (data) {
            _this.agent = data;
        }));
        // this.subscriptions.push(_crmService.getConversationsList(this.selectedCustomer.deviceID).subscribe(conversations => {
        //   this.conversationList = conversations;
        // }));
    }
    ConversationDetailsComponent.prototype.ngOnInit = function () {
    };
    ConversationDetailsComponent.prototype.toggleChat = function () {
        this._crmService.viewingConversation.next(false);
    };
    ConversationDetailsComponent = __decorate([
        core_1.Component({
            selector: 'app-conversation-details',
            templateUrl: './conversation-details.component.html',
            styleUrls: ['./conversation-details.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ConversationDetailsComponent);
    return ConversationDetailsComponent;
}());
exports.ConversationDetailsComponent = ConversationDetailsComponent;
//# sourceMappingURL=conversation-details.component.js.map