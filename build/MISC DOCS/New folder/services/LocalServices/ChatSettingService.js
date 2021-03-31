"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSettingService = void 0;
// Angular Imports
var core_1 = require("@angular/core");
//RxJs Imports
var Observable_1 = require("rxjs/Observable");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var ChatSettingService = /** @class */ (function () {
    //public allowedTagList: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    function ChatSettingService(_authService, _socketService, _adminSettingsService) {
        // console.log('ChatSettings Service!');
        var _this = this;
        this._authService = _authService;
        this._socketService = _socketService;
        this._adminSettingsService = _adminSettingsService;
        this.subscriptions = [];
        this.chatSettings = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.settingsChanged = new BehaviorSubject_1.BehaviorSubject(false);
        this.savingAssignmentSetting = new BehaviorSubject_1.BehaviorSubject(false);
        this.savingpermissions = new BehaviorSubject_1.BehaviorSubject(false);
        this.savingTranscriptSettings = new BehaviorSubject_1.BehaviorSubject(false);
        this.savingTranscriptLogoSettings = new BehaviorSubject_1.BehaviorSubject(false);
        this.savingchatTimeoutsSettings = new BehaviorSubject_1.BehaviorSubject(false);
        this.savingGreetingMessage = new BehaviorSubject_1.BehaviorSubject(false);
        this.savingbotGreetingMessage = new BehaviorSubject_1.BehaviorSubject(false);
        this.savingConversationTagList = new BehaviorSubject_1.BehaviorSubject(false);
        this.subscriptions.push(_authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
        }));
        this.subscriptions.push(this._socketService.getSocket().subscribe(function (socket) {
            if (socket) {
                _this.socket = socket;
                _this.getChattSettingsFromBackend();
            }
        }));
        this.subscriptions.push(_adminSettingsService.getSettingsStatus().subscribe(function (status) {
            _this.settingsChanged.next(status);
        }));
        this.chatSettings.next(JSON.parse(localStorage.getItem('chatSettings')));
    }
    ChatSettingService.prototype.getChattSettingsFromBackend = function () {
        // if (this.agent.role == 'admin' || this.agent.role == 'superadmin') {
        //     this.socket.emit('getChatSettings', {}, (response) => {
        //         localStorage.setItem('chatSettings', JSON.stringify(response.data));
        //         this.chatSettings.next(response.data);
        //     });
        // }
        // console.log('Get chat settings');
        var _this = this;
        this.socket.emit('getChatSettings', {}, function (response) {
            localStorage.setItem('chatSettings', JSON.stringify(response.data));
            _this.chatSettings.next(response.data);
        });
    };
    ChatSettingService.prototype.getChattSettings = function () {
        return this.chatSettings.asObservable();
    };
    ChatSettingService.prototype.getSettingsChangedStatus = function () {
        return this.settingsChanged.asObservable();
    };
    ChatSettingService.prototype.setNSPChatSettings = function (settings, settingsName) {
        var _this = this;
        this.SavingSettings(settingsName);
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('updateNSPChatSettings', { settings: settings, settingsName: settingsName }, function (response) {
                _this.SavedSettings(settingsName);
                //console.log(response);
                if (response.status == 'ok') {
                    _this.chatSettings.getValue()[settingsName] = settings;
                    _this.chatSettings.next(_this.chatSettings.getValue());
                    localStorage.setItem('chatSettings', JSON.stringify(_this.chatSettings.getValue()));
                }
                observer.next(response);
                observer.complete();
            });
        });
    };
    //#region Saving Settings Helpers
    ChatSettingService.prototype.getSavingStatus = function (type) {
        switch (type) {
            case 'assignments':
                return this.savingAssignmentSetting.asObservable();
            case 'permissions':
                return this.savingpermissions.asObservable();
            case 'inactivityTimeouts':
                return this.savingchatTimeoutsSettings.asObservable();
            case 'transcriptForwarding':
                return this.savingTranscriptSettings.asObservable();
            case 'transcriptLogo':
                return this.savingTranscriptLogoSettings.asObservable();
            case 'greetingMessage':
                return this.savingGreetingMessage.asObservable();
            case 'botGreetingMessage':
                return this.savingbotGreetingMessage.asObservable();
            case 'tagList':
                return this.savingConversationTagList.asObservable();
        }
    };
    ChatSettingService.prototype.SavingSettings = function (settingsName) {
        switch (settingsName) {
            case 'assignments':
                this.savingAssignmentSetting.next(true);
                break;
            case 'permissions':
                this.savingpermissions.next(true);
                break;
            case 'inactivityTimeouts':
                this.savingchatTimeoutsSettings.next(true);
                break;
            case 'transcriptForwarding':
                this.savingTranscriptSettings.next(true);
                break;
            case 'transcriptLogo':
                this.savingTranscriptLogoSettings.next(true);
                break;
            case 'greetingMessage':
                this.savingGreetingMessage.next(true);
                break;
            case 'botGreetingMessage':
                this.savingbotGreetingMessage.next(true);
                break;
            case 'tagList':
                this.savingConversationTagList.next(true);
                break;
        }
    };
    ChatSettingService.prototype.SavedSettings = function (settingsName) {
        switch (settingsName) {
            case 'assignments':
                this.savingAssignmentSetting.next(false);
                break;
            case 'permissions':
                this.savingpermissions.next(false);
                break;
            case 'inactivityTimeouts':
                this.savingchatTimeoutsSettings.next(false);
                break;
            case 'transcriptForwarding':
                this.savingTranscriptSettings.next(false);
                break;
            case 'transcriptLogo':
                this.savingTranscriptLogoSettings.next(false);
                break;
            case 'greetingMessage':
                this.savingGreetingMessage.next(false);
                break;
            case 'botGreetingMessage':
                this.savingbotGreetingMessage.next(false);
                break;
        }
    };
    ChatSettingService.prototype.Destroy = function () {
        this.subscriptions.map(function (subscription) {
            subscription.unsubscribe();
        });
    };
    ChatSettingService = __decorate([
        core_1.Injectable()
    ], ChatSettingService);
    return ChatSettingService;
}());
exports.ChatSettingService = ChatSettingService;
//# sourceMappingURL=ChatSettingService.js.map