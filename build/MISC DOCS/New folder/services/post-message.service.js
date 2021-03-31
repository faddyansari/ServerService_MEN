"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostmessageService = void 0;
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var PostmessageService = /** @class */ (function () {
    function PostmessageService() {
        var _this = this;
        this.NSP = '';
        this.NegotiateReadyEvent = new Subject_1.Subject();
        this.HelpReadyToGiveSession = new Subject_1.Subject();
        this.startSupportChat = new Subject_1.Subject();
        this.msgNotification = new BehaviorSubject_1.BehaviorSubject(0);
        this.popupBlockContent = "Popup Blocked. Please Follow the Link : 'https://support.google.com/chrome/answer/95472?co=GENIE.Platform%3DDesktop&hl=en' to Enable Popup Window";
        //console.log('PostMessage Service Initialized');
        window.addEventListener('message', function (e) {
            _this.MessageRecieved(e);
        });
    }
    PostmessageService.prototype.MessageRecieved = function (event) {
        //console.log(event.data);
        if (!event.data.msg) {
            // console.log('Missing Msg Property');
            return;
        }
        switch (event.data.msg) {
            case 'popUpBlocked':
                window.alert(this.popupBlockContent);
                break;
            case 'helpLoadingInitiated':
                // console.log("helpLoadingInitiated")
                this.HelpReadyToGiveSession.next(true);
                break;
            case 'HelpIsLoaded':
                this.NegotiateReadyEvent.next(true);
                break;
            case "helpClose":
                break;
            case "MessageNotification":
                this.msgNotification.next(event.data.payload);
                break;
            case "HideNotification":
                this.msgNotification.next(0);
                break;
            case "InitiateChatSupport":
                this.startSupportChat.next(true);
                break;
            default:
                throw new Error('Invalid Message Please Check Your Message');
        }
    };
    PostmessageService = __decorate([
        core_1.Injectable()
    ], PostmessageService);
    return PostmessageService;
}());
exports.PostmessageService = PostmessageService;
//# sourceMappingURL=post-message.service.js.map