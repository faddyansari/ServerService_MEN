"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappMessagesComponent = void 0;
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var WhatsappMessagesComponent = /** @class */ (function () {
    function WhatsappMessagesComponent() {
        var _this = this;
        this._messages = [];
        this._tempMessages = [];
        this._contactID = '';
        this.agentEmail = '';
        this.customerName = '';
        this.customerNo = '';
        this.autoscroll = true;
        this.GetMoreMessages = new core_1.EventEmitter();
        this.UnsetReadCount = new core_1.EventEmitter();
        this.ReSendMessage = new core_1.EventEmitter();
        this._CancelUpload = new core_1.EventEmitter();
        this.__ResendAttachment = new core_1.EventEmitter();
        this.subscriptions = [];
        this.LoadMore = new Subject_1.Subject();
        this.ReSendEvent = new Subject_1.Subject();
        this.scrollTop = 0;
        this.scrollHeight = 0;
        this.subscriptions.push(this.LoadMore.debounceTime(1000).subscribe(function (data) {
            _this.GetMoreMessages.emit(data);
        }));
        this.subscriptions.push(this.ReSendEvent.debounceTime(2000).subscribe(function (data) {
            _this.ReSendMessage.emit(data);
        }));
    }
    Object.defineProperty(WhatsappMessagesComponent.prototype, "contacatID", {
        set: function (value) {
            if (this._contactID != value) {
                this.autoscroll = true;
                this._contactID = value;
                this.UnsetReadCount.emit({ unset: true });
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WhatsappMessagesComponent.prototype, "messages", {
        set: function (value) {
            var _this = this;
            // console.log('Value Recieved ', value);
            this._messages = value;
            if (value && value.length && value[value.length - 1].autoScroll)
                this.autoscroll = true;
            setTimeout(function () {
                if (_this.autoscroll) {
                    _this.scrollToBottom();
                }
                if (_this.scrollTop == 0) {
                    _this.ScrollContainer.nativeElement.scrollTop = _this.ScrollContainer.nativeElement.scrollHeight - _this.scrollHeight;
                }
            }, 300);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WhatsappMessagesComponent.prototype, "tempMessages", {
        set: function (value) {
            var _this = this;
            // value.map(msg => {
            //   if (msg.attachment && !msg.errored && !msg._id && msg.uploading) {
            //     console.log('Temp Message Recieved ', msg);
            //     /**
            //      * @process
            //      * 1. Upload File
            //      * 2. Send To Server
            //      */
            //   }
            // })
            this._tempMessages = value;
            setTimeout(function () {
                if (_this.autoscroll) {
                    _this.scrollToBottom();
                }
                if (_this.scrollTop == 0) {
                    _this.ScrollContainer.nativeElement.scrollTop = _this.ScrollContainer.nativeElement.scrollHeight - _this.scrollHeight;
                }
            }, 300);
        },
        enumerable: false,
        configurable: true
    });
    WhatsappMessagesComponent.prototype.onBlur = function (event) {
        // Do something
        this.UnsetReadCount.emit({ unset: true });
    };
    WhatsappMessagesComponent.prototype.ngOnInit = function () {
        // console.log('Agent Email', this.agentEmail);
    };
    WhatsappMessagesComponent.prototype.ScrollChanged = function (event) {
        if (!this.ScrollContainer || !this.ScrollContainer.nativeElement)
            return;
        var movedTop = (Math.round(event.target.scrollTop) < this.scrollTop);
        if (!movedTop && Math.round(event.target.scrollTop + event.target.clientHeight) >= this.ScrollContainer.nativeElement.scrollHeight - 10) {
            this.autoscroll = true;
        }
        if (movedTop && (Math.round(event.target.scrollTop) <= this.ScrollContainer.nativeElement.scrollHeight - 10)) {
            this.autoscroll = false;
        }
        if (movedTop && (Math.round(event.target.scrollTop) <= 0)) {
            if (this._messages.length)
                this.LoadMore.next({ lastMessageID: this._messages[0].timestamp });
        }
        this.scrollHeight = this.ScrollContainer.nativeElement.scrollHeight;
        this.scrollTop = this.ScrollContainer.nativeElement.scrollTop;
    };
    WhatsappMessagesComponent.prototype.scrollToBottom = function () {
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
    WhatsappMessagesComponent.prototype.ResolveMessages = function () {
        if (this._tempMessages.length)
            return (__spreadArrays(this._messages, this._tempMessages));
        else
            return this._messages;
    };
    WhatsappMessagesComponent.prototype.Resend = function (msg) {
        delete msg.autoScroll;
        msg.status = 'sending';
        this.ReSendEvent.next(msg);
    };
    WhatsappMessagesComponent.prototype.CancelUpload = function (sentTime) {
        // console.log('Cancel Upload Message OCmponent');
        this._CancelUpload.emit(sentTime);
    };
    WhatsappMessagesComponent.prototype._Resent = function (errorType, msg) {
        // console.log('Resent')
        this.__ResendAttachment.emit({ errorType: errorType, msg: msg });
    };
    WhatsappMessagesComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.map(function (subscription) { subscription.unsubscribe(); });
    };
    WhatsappMessagesComponent.prototype.ngAfterViewInit = function () {
        this.scrollToBottom();
    };
    __decorate([
        core_1.ViewChild('scrollContainer')
    ], WhatsappMessagesComponent.prototype, "ScrollContainer", void 0);
    __decorate([
        core_1.Input()
    ], WhatsappMessagesComponent.prototype, "agentEmail", void 0);
    __decorate([
        core_1.Input()
    ], WhatsappMessagesComponent.prototype, "customerName", void 0);
    __decorate([
        core_1.Input()
    ], WhatsappMessagesComponent.prototype, "customerNo", void 0);
    __decorate([
        core_1.Input()
    ], WhatsappMessagesComponent.prototype, "autoscroll", void 0);
    __decorate([
        core_1.Output()
    ], WhatsappMessagesComponent.prototype, "GetMoreMessages", void 0);
    __decorate([
        core_1.Output()
    ], WhatsappMessagesComponent.prototype, "UnsetReadCount", void 0);
    __decorate([
        core_1.Output()
    ], WhatsappMessagesComponent.prototype, "ReSendMessage", void 0);
    __decorate([
        core_1.Output()
    ], WhatsappMessagesComponent.prototype, "_CancelUpload", void 0);
    __decorate([
        core_1.Output()
    ], WhatsappMessagesComponent.prototype, "__ResendAttachment", void 0);
    __decorate([
        core_1.Input('contacatID')
    ], WhatsappMessagesComponent.prototype, "contacatID", null);
    __decorate([
        core_1.Input('messages')
    ], WhatsappMessagesComponent.prototype, "messages", null);
    __decorate([
        core_1.Input('tempMessages')
    ], WhatsappMessagesComponent.prototype, "tempMessages", null);
    __decorate([
        core_1.HostListener('click', ['$event'])
    ], WhatsappMessagesComponent.prototype, "onBlur", null);
    WhatsappMessagesComponent = __decorate([
        core_1.Component({
            selector: 'app-whatsapp-messages',
            templateUrl: './whatsapp-messages.component.html',
            styleUrls: ['./whatsapp-messages.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], WhatsappMessagesComponent);
    return WhatsappMessagesComponent;
}());
exports.WhatsappMessagesComponent = WhatsappMessagesComponent;
//# sourceMappingURL=whatsapp-messages.component.js.map