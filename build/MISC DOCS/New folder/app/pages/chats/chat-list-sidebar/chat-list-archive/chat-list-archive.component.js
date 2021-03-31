"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatListArchiveComponent = void 0;
var core_1 = require("@angular/core");
var ChatListArchiveComponent = /** @class */ (function () {
    function ChatListArchiveComponent(_chatService) {
        var _this = this;
        this._chatService = _chatService;
        this.archivesList = [];
        this.subscriptions = [];
        this.scrollHeight = 0;
        this.loadingMoreArchives = false;
        // //console.log('Archives Loaded');
        this.subscriptions.push(_chatService.getLoading('MOREARCHIVES').subscribe(function (data) {
            _this.loadingMoreArchives = data;
        }));
        this.subscriptions.push(_chatService.getArchives().subscribe(function (archiveList) {
            _this.archivesList = archiveList;
        }));
        this.subscriptions.push(_chatService.getCurrentConversation().subscribe(function (conversation) {
            _this.selectedConversation = conversation;
            if (Object.keys(_this.selectedConversation).length && !_this.selectedConversation.synced) {
                _this._chatService.getArchiveMessages(_this.selectedConversation._id);
            }
        }));
    }
    ChatListArchiveComponent.prototype.ngOnInit = function () {
    };
    ChatListArchiveComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    ChatListArchiveComponent.prototype.ngAfterViewInit = function () {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
        //console.log(this.scrollHeight)
        // this.scrollRef.scrollState
        //   .debounceTime(100)
        //   .subscribe(data => {
        //     if (Math.round(data.target.scrollTop + data.target.clientHeight) >= (this.scrollRef.view.scrollHeight - 10)) {
        //       this._chatService.getMoreArchivesFromBackend();
        //     }
        //     this.scrollHeight = this.scrollRef.view.scrollHeight;
        //   })
    };
    ChatListArchiveComponent.prototype.ScrollChanged = function (event) {
        if (Math.round(event.target.scrollTop + event.target.clientHeight) >= (this.scrollContainer.nativeElement.scrollHeight - 10)) {
            this._chatService.getMoreArchivesFromBackend();
        }
        this.scrollHeight = this.scrollContainer.nativeElement.scrollHeight;
    };
    ChatListArchiveComponent.prototype.ngAfterViewChecked = function () {
        //Called after every check of the component's view. Applies to components only.
        //Add 'implements AfterViewChecked' to the class.
        if (this.loadingMoreArchives) {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight + 20;
            // this.scrollRef.scrollYTo(this.scrollRef.view.scrollHeight + 20);
        }
    };
    ChatListArchiveComponent.prototype.CheckAttachmentType = function (data) {
        return (typeof data === 'string');
    };
    __decorate([
        core_1.Input()
    ], ChatListArchiveComponent.prototype, "searchValue", void 0);
    __decorate([
        core_1.ViewChild('scrollContainer')
    ], ChatListArchiveComponent.prototype, "scrollContainer", void 0);
    ChatListArchiveComponent = __decorate([
        core_1.Component({
            selector: 'app-chat-list-archive',
            templateUrl: './chat-list-archive.component.html',
            styleUrls: ['./chat-list-archive.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ChatListArchiveComponent);
    return ChatListArchiveComponent;
}());
exports.ChatListArchiveComponent = ChatListArchiveComponent;
//# sourceMappingURL=chat-list-archive.component.js.map