"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatListInboxComponent = void 0;
var core_1 = require("@angular/core");
var ChatListInboxComponent = /** @class */ (function () {
    function ChatListInboxComponent(_chatService) {
        var _this = this;
        this._chatService = _chatService;
        this.subscriptions = [];
        this.chatList = [];
        this.selectedConversation = {};
        this.scrollHeight = 0;
        this.subscriptions.push(this._chatService.AllConversations.subscribe(function (data) {
            _this.chatList = data;
        }));
        this.subscriptions.push(_chatService.getLoading('MOREINBOXCHATS').subscribe(function (data) {
            _this.loadingMorechats = data;
        }));
        this.subscriptions.push(this._chatService.getCurrentConversation().subscribe(function (conversation) {
            _this.selectedConversation = conversation;
            //conversation.messages[conversation.messages.length -1]
        }));
    }
    ChatListInboxComponent.prototype.ngOnInit = function () {
    };
    ChatListInboxComponent.prototype.CheckAttachmentType = function (data) {
        return (typeof data === 'string');
    };
    ChatListInboxComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    ChatListInboxComponent.prototype.ngAfterViewInit = function () {
        this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
    };
    ChatListInboxComponent.prototype.ScrollChanged = function (event) {
        if (Math.round(event.target.scrollTop + event.target.clientHeight) >= (this.scrollContainer.nativeElement.scrollHeight - 10)) {
            this._chatService.getMoreArchivesInboxChats();
        }
        this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
    };
    ChatListInboxComponent.prototype.ngAfterViewChecked = function () {
        //Called after every check of the component's view. Applies to components only.
        //Add 'implements AfterViewChecked' to the class.
        if (this.loadingMorechats) {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight + 20;
            // this.scrollRef.scrollYTo(this.scrollRef.view.scrollHeight + 20);
        }
    };
    __decorate([
        core_1.Input()
    ], ChatListInboxComponent.prototype, "searchValue", void 0);
    __decorate([
        core_1.ViewChild('scrollContainer')
    ], ChatListInboxComponent.prototype, "scrollContainer", void 0);
    ChatListInboxComponent = __decorate([
        core_1.Component({
            selector: 'app-chat-list-inbox',
            templateUrl: './chat-list-inbox.component.html',
            styleUrls: ['./chat-list-inbox.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ChatListInboxComponent);
    return ChatListInboxComponent;
}());
exports.ChatListInboxComponent = ChatListInboxComponent;
//# sourceMappingURL=chat-list-inbox.component.js.map