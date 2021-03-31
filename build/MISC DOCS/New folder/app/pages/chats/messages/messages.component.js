"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesComponent = void 0;
var core_1 = require("@angular/core");
require("rxjs/add/observable/of");
var add_faq_dialog_component_1 = require("../../../dialogs/add-faq-dialog/add-faq-dialog.component");
var add_tphrase_dialog_component_1 = require("../../../dialogs/add-tphrase-dialog/add-tphrase-dialog.component");
var Subject_1 = require("rxjs/Subject");
var MessagesComponent = /** @class */ (function () {
    function MessagesComponent(_authService, _chatService, dialog) {
        var _this = this;
        this._authService = _authService;
        this._chatService = _chatService;
        this.dialog = dialog;
        this.subscriptions = [];
        this.CheckViewChange = new Subject_1.Subject();
        this.initialized = false;
        this.autoscroll = true;
        this.scrollHeight = 0;
        this.fetchedNewMessages = false;
        this.showMenu = false;
        this.isDragged = false;
        this.subscriptions.push(_authService.getSettings().subscribe(function (data) {
            if (data && data.permissions) {
                _this.permissions = data.permissions.chats;
            }
        }));
        this.subscriptions.push(_chatService.getCurrentConversation().subscribe(function (converstaion) {
            if (!_this.currentConversation) {
                _this.currentConversation = converstaion;
            }
            else {
                if (_this.currentConversation && (converstaion._id == _this.currentConversation._id) && (converstaion.messages && (converstaion.messages.length != _this.currentConversation.messages.length))) {
                    _this.currentConversation = converstaion;
                    // if (this.activeTab == 'INBOX') {
                    // 	_chatService.setAutoScroll(true);
                    // 	_chatService.conversationSeen();
                    // } else {
                    // 	this.scrollTop = 10;
                    // 	_chatService.setAutoScroll(true);
                    // }
                }
                if (converstaion._id != _this.currentConversation._id) {
                    _this.currentConversation = converstaion;
                    if (_this.activeTab == 'INBOX') {
                        _chatService.setAutoScroll(true);
                        _chatService.conversationSeen();
                    }
                    else {
                        _this.scrollTop = 10;
                        _chatService.setAutoScroll(true);
                    }
                }
                _this.CheckViewChange.next(true);
            }
        }));
        this.subscriptions.push(_chatService.getAutoScroll().subscribe(function (data) {
            _this.autoscroll = data;
        }));
        this.subscriptions.push(this._authService.Agent.subscribe(function (data) {
            _this.agent = data;
        }));
        this.subscriptions.push(_chatService.getActiveTab().subscribe(function (activeTab) {
            _this.activeTab = activeTab;
        }));
        // this.subscriptions.push(_chatService.newMesagedRecieved.debounceTime(100).subscribe(data => {
        // 	if (this.ScrollContainer.nativeElement.scrollHeight != this.scrollHeight) {
        // 		this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
        // 		if (this.autoscroll) {
        // 			console.log('newMesagedRecieved');
        // 			this.scrollToBottom();
        // 		}
        // 	}
        // }))
        this.subscriptions.push(this.CheckViewChange.debounceTime(100).subscribe(function (data) {
            if (_this.activeTab == 'INBOX') {
                if (_this.ScrollContainer.nativeElement.scrollHeight != _this.scrollHeight) {
                    _this.scrollHeight = _this.ScrollContainer.nativeElement.scrollHeight;
                    if (_this.autoscroll) {
                        _this.scrollToBottom();
                    }
                }
            }
            else {
                if (_this.ScrollContainer.nativeElement.scrollHeight != _this.scrollHeight) {
                    if (_this.fetchedNewMessages && !_this.autoscroll) {
                        _this.ScrollContainer.nativeElement.scrollTop = _this.ScrollContainer.nativeElement.scrollHeight - _this.scrollHeight;
                        _this.fetchedNewMessages = false;
                        _this.scrollHeight = _this.ScrollContainer.nativeElement.scrollHeight;
                    }
                    else {
                        _this.autoscroll = false;
                        _this.scrollHeight = _this.ScrollContainer.nativeElement.scrollHeight;
                        _this.ScrollContainer.nativeElement.scrollTop = _this.scrollHeight;
                    }
                }
            }
        }));
    }
    MessagesComponent.prototype.ngOnInit = function () {
    };
    MessagesComponent.prototype.scrollToBottom = function () {
        var _this = this;
        if (this.autoscroll != true) {
            return;
        }
        try {
            setTimeout(function () {
                _this.ScrollContainer.nativeElement.scrollTop = _this.ScrollContainer.nativeElement.scrollHeight;
            }, 300);
        }
        catch (err) { }
    };
    MessagesComponent.prototype.ngAfterViewInit = function () {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
        this.initialized = true;
        this.scrollToBottom();
        // if (this.activeTab == 'INBOX') {
        // }
        // else {
        //   this.scrollRef.scrollState
        //     .debounceTime(100)
        //     .subscribe(data => {
        //       this.scrollTop = this.scrollRef.view.scrollTop;
        //       if (this.scrollTop <= 0 && this.scrollRef.thumbY.scrollHeight > 0) {
        //         this.fetchedNewMessages = true;
        //         this._chatService.getMoreArchiveMessages(this.currentConversation._id);
        //       }
        //     })
        //   this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
        // }
    };
    MessagesComponent.prototype.CheckAttachmentType = function (data) {
        return (typeof data === 'string');
    };
    MessagesComponent.prototype.ScrollChanged = function (event) {
        if (!this.ScrollContainer || !this.ScrollContainer.nativeElement)
            return;
        this.scrollTop = this.ScrollContainer.nativeElement.scrollTop;
        if (Math.round(event.target.scrollTop + event.target.clientHeight) >= this.ScrollContainer.nativeElement.scrollHeight - 10) {
            if (this.autoscroll != true) {
                this._chatService.setAutoScroll(true);
                this._chatService.conversationSeen();
            }
        }
        else if (this.activeTab != 'INBOX' && this.scrollTop <= 0 && this.ScrollContainer.nativeElement.scrollHeight > 0) {
            this.fetchedNewMessages = true;
            this._chatService.getMoreArchiveMessages(this.currentConversation._id).subscribe(function (res) {
                // if (res && res.scroll) {
                //   this.ScrollContainer.nativeElement.scrollTop = this.ScrollContainer.nativeElement.scrollHeight - this.scrollHeight;
                //   this.fetchedNewMessages = false;
                //   this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
                // }
            }, function (err) {
            });
        }
        else {
            if (this.autoscroll != false) {
                this._chatService.setAutoScroll(false);
            }
        }
        this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
    };
    MessagesComponent.prototype.ngAfterViewChecked = function () {
        //Called after every check of the component's view. Applies to components only.
        //Add 'implements AfterViewChecked' to the class.
        //this.CheckViewChange.next(true);
        if (this.activeTab == 'INBOX') {
            if (this.ScrollContainer.nativeElement.scrollHeight != this.scrollHeight) {
                this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
                if (this.autoscroll) {
                    this.ScrollContainer.nativeElement.scrollTop = this.ScrollContainer.nativeElement.scrollHeight;
                }
            }
        }
        else {
            if (this.ScrollContainer.nativeElement.scrollHeight != this.scrollHeight) {
                if (this.fetchedNewMessages && !this.autoscroll) {
                    this.ScrollContainer.nativeElement.scrollTop = this.ScrollContainer.nativeElement.scrollHeight - this.scrollHeight;
                    this.fetchedNewMessages = false;
                    this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
                }
                else {
                    this.autoscroll = false;
                    this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
                    this.ScrollContainer.nativeElement.scrollTop = this.scrollHeight;
                }
            }
        }
    };
    MessagesComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    MessagesComponent.prototype.setAutoScroll = function () {
        this.autoscroll = true;
    };
    MessagesComponent.prototype.activateMenu = function () {
        this.showMenu = !this.showMenu;
    };
    MessagesComponent.prototype.deActivateMenu = function () {
        this.showMenu = false;
    };
    MessagesComponent.prototype.AddAsFaq = function (message) {
        this.showMenu = false;
        this.subscriptions.push(this.dialog.open(add_faq_dialog_component_1.AddFaqDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: {
                question: message
            }
        }).afterClosed().subscribe(function (data) {
        }));
    };
    MessagesComponent.prototype.AddAsTPhrase = function (message) {
        message = message.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '');
        message.trim();
        this.showMenu = false;
        this.subscriptions.push(this.dialog.open(add_tphrase_dialog_component_1.AddTphraseDialogComponent, {
            panelClass: ['confirmation-dialog'],
            data: {
                tPhrase: message
            }
        }).afterClosed().subscribe(function (data) {
        }));
    };
    MessagesComponent.prototype.Audioclicked = function () {
        // //console.log('Audio Clicked');
    };
    __decorate([
        core_1.ViewChild('scrollContainer')
    ], MessagesComponent.prototype, "ScrollContainer", void 0);
    MessagesComponent = __decorate([
        core_1.Component({
            selector: 'app-messages',
            templateUrl: './messages.component.html',
            styleUrls: ['./messages.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None,
            preserveWhitespaces: false
        })
    ], MessagesComponent);
    return MessagesComponent;
}());
exports.MessagesComponent = MessagesComponent;
//# sourceMappingURL=messages.component.js.map