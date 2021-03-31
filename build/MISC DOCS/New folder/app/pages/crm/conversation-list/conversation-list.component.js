"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationListComponent = void 0;
var core_1 = require("@angular/core");
var ConversationListComponent = /** @class */ (function () {
    function ConversationListComponent(_crmService) {
        var _this = this;
        this._crmService = _crmService;
        this.conversationList = [];
        this.subscriptions = [];
        this.scrollHeight = 0;
        this.loading = false;
        this.ifMoreRecentChats = true;
        this.subscriptions.push(_crmService.getLoadingVariable().subscribe(function (data) {
            _this.loading = data;
        }));
        this.subscriptions.push(_crmService.getSelectedCustomer().subscribe(function (customer) {
            _this.selectedCustomer = customer;
            _this.conversationList = _this.selectedCustomer.conversations;
        }));
        this.subscriptions.push(_crmService.getCurrentConversation().subscribe(function (conversation) {
            _this.selectedConversation = conversation;
        }));
        this.subscriptions.push(_crmService.ifMoreRecentChats.subscribe(function (more) {
            _this.ifMoreRecentChats = more;
        }));
        // this.subscriptions.push(_crmService.getConversationsList(this.selectedCustomer.deviceID).subscribe(conversations => {
        //   this.conversationList = conversations;
        // }));
    }
    ConversationListComponent.prototype.ngOnInit = function () {
    };
    ConversationListComponent.prototype.ScrollChanged = function ($event) {
        if (Math.round(event.target.scrollTop + event.target.clientHeight) >= (this.scrollContainer.nativeElement.scrollHeight - 10)) {
            this._crmService.getMoreConversationsFromBackend(this.selectedCustomer.deviceID, this.selectedCustomer.conversations[this.selectedCustomer.conversations.length - 1]._id);
        }
        this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
    };
    ConversationListComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    ConversationListComponent.prototype.ngAfterViewInit = function () {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
    };
    ConversationListComponent.prototype.ngAfterViewChecked = function () {
        //Called after every check of the component's view. Applies to components only.
        //Add 'implements AfterViewChecked' to the class.
        if (this.loading) {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight + 20;
        }
    };
    __decorate([
        core_1.ViewChild('scrollContainer')
    ], ConversationListComponent.prototype, "scrollContainer", void 0);
    ConversationListComponent = __decorate([
        core_1.Component({
            selector: 'app-conversation-list',
            templateUrl: './conversation-list.component.html',
            styleUrls: ['./conversation-list.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ConversationListComponent);
    return ConversationListComponent;
}());
exports.ConversationListComponent = ConversationListComponent;
//# sourceMappingURL=conversation-list.component.js.map