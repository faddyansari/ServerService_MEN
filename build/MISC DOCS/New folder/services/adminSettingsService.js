"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSettingsService = void 0;
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Subject_1 = require("rxjs/Subject");
var AdminSettingsService = /** @class */ (function () {
    function AdminSettingsService(_socketService, _authService) {
        var _this = this;
        this._socketService = _socketService;
        this._authService = _authService;
        this.aEng = new BehaviorSubject_1.BehaviorSubject({});
        this.settingsChanged = new Subject_1.Subject();
        this.fileSharingSettings = new BehaviorSubject_1.BehaviorSubject({});
        this.callSettings = new BehaviorSubject_1.BehaviorSubject({});
        this.contactSettings = new BehaviorSubject_1.BehaviorSubject({});
        this.widgetMarketingSettings = new BehaviorSubject_1.BehaviorSubject({});
        this.emailNotificationSettings = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.windowNotificationSettings = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.ticketSettings = new BehaviorSubject_1.BehaviorSubject(undefined);
        //console.log('Admin Settings Service Initialized');
        _authService.getAgent().subscribe(function (agent) {
            _this.agent = agent;
        });
        _socketService.getSocket().subscribe(function (data) {
            if (data) {
                _this.socket = data;
                _this.getAdminSettingsFromBackend();
                _this.socket.on('updateChatSettings', function (data) {
                    if (data.settingsName == 'assignments') {
                        _this.setEngagementSettings(data.aEng);
                    }
                    else if ('allowFileSharing') {
                        _this.setFileSharingSettings(data.fileSharing);
                    }
                });
                _this.socket.on('updateCallSettings', function (data) {
                    _this.setCallingSettings(data.settings);
                });
                _this.socket.on('updateContactSettings', function (data) {
                    _this.setContactSettings(data.settings);
                });
                _this.socket.on('updateWidgetMarketingSettings', function (data) {
                    _this.setWidgetMarketingSettings(data.settings);
                });
                // if (this.agent.role == 'admin') {
                //     this.socket.on('settingsChanged', (data) => {
                //         console.log(data);
                //         this.settingsUpdated(data);
                //         this.settingsChanged.next(true);
                //     });
                // }
                _this.socket.on('settingsChanged', function (data) {
                    //  console.log(data);
                    _this.settingsUpdated(data);
                    _this.settingsChanged.next(true);
                });
            }
        });
    }
    AdminSettingsService.prototype.getAdminSettingsFromBackend = function () {
        var _this = this;
        if (!localStorage.getItem('aEng') || !localStorage.getItem('fileSharing') || !localStorage.getItem('callSettings') || !localStorage.getItem('widgetMarketingSettings')) {
            this.socket.emit('getAdminSettings', {}, function (data) {
                // console.log(data);
                if (data.status == 'ok') {
                    localStorage.setItem('aEng', JSON.stringify(data.aEng));
                    localStorage.setItem('fileSharing', JSON.stringify(data.fileSharing));
                    localStorage.setItem('callSettings', JSON.stringify(data.callSettings));
                    localStorage.setItem('contactSettings', JSON.stringify(data.contactSettings));
                    localStorage.setItem('widgetMarketingSettings', JSON.stringify(data.widgetMarketingSettings));
                    _this.aEng.next(data.aEng);
                    _this.fileSharingSettings.next(data.fileSharing);
                    _this.callSettings.next(data.callSettings);
                    _this.contactSettings.next(data.contactSettings);
                    _this.widgetMarketingSettings.next(data.widgetMarketingSettings);
                }
            });
        }
        else {
            this.aEng.next(JSON.parse(localStorage.getItem('aEng')));
            this.fileSharingSettings.next(JSON.parse(localStorage.getItem('fileSharing')));
            this.callSettings.next(JSON.parse(localStorage.getItem('callSettings')));
            this.contactSettings.next(JSON.parse(localStorage.getItem('contactSettings')));
            this.widgetMarketingSettings.next(JSON.parse(localStorage.getItem('widgetMarketingSettings')));
            this.emailNotificationSettings.next(JSON.parse(localStorage.getItem('emailNotifications')));
            this.windowNotificationSettings.next(JSON.parse(localStorage.getItem('windowNotifications')));
        }
    };
    AdminSettingsService.prototype.GetTicketSettings = function () {
        var _this = this;
        this.socket.emit('getTicketSettings', {}, function (response) {
            //console.log(response.groups[0].rooms);
            if (response.status == 'ok') {
                //console.log(response);
                if (response.ticketSettings)
                    _this.ticketSettings.next(response.ticketSettings);
                else
                    _this.ticketSettings.next({ allowedAgentAvailable: true });
                // this.auto_assign.next(this.tagsAutomationSettings.auto_assign);
            }
        });
    };
    AdminSettingsService.prototype.GetEmailNotificationSettings = function () {
        var _this = this;
        this.socket.emit('getEmailNotificationSettings', {}, function (response) {
            //console.log(response.groups[0].rooms);
            if (response.status == 'ok') {
                // console.log(response);
                if (response.emailNotifications)
                    _this.emailNotificationSettings.next(response.emailNotifications);
                // this.auto_assign.next(this.tagsAutomationSettings.auto_assign);
            }
        });
    };
    AdminSettingsService.prototype.GetWindowNotificationSettings = function () {
        var _this = this;
        this.socket.emit('getWindowNotificationSettings', {}, function (response) {
            //console.log(response.groups[0].rooms);
            if (response.status == 'ok') {
                //  console.log(response);
                if (response.windowNotifications)
                    _this.windowNotificationSettings.next(response.windowNotifications);
                // this.auto_assign.next(this.tagsAutomationSettings.auto_assign);
            }
        });
    };
    AdminSettingsService.prototype.SetTicketSettings = function (data) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('setTicketSettings', data, function (response) {
                //console.log(response.groups[0].rooms);
                if (response.status == 'ok') {
                    _this.ticketSettings.next(data);
                    observer.next(response);
                    observer.complete();
                    // console.log(response);
                    // this.auto_assign.next(this.tagsAutomationSettings.auto_assign);
                }
                else {
                    observer.error();
                }
            });
        });
    };
    AdminSettingsService.prototype.SetEmailNotificationSettings = function (settingsName, settings) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('setEmailNotificationSettings', { settingsName: settingsName, settings: settings }, function (response) {
                //console.log(response.groups[0].rooms);
                if (response.status == 'ok') {
                    _this.emailNotificationSettings.getValue()[settingsName] = settings;
                    _this.emailNotificationSettings.next(_this.emailNotificationSettings.getValue());
                    observer.next(response);
                    observer.complete();
                    // console.log(response);
                    // this.auto_assign.next(this.tagsAutomationSettings.auto_assign);
                }
                else {
                    observer.error();
                }
            });
        });
    };
    AdminSettingsService.prototype.SetWindowNotificationSettings = function (settings) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('setWindowNotificationSettings', { settings: settings }, function (response) {
                //console.log(response.groups[0].rooms);
                if (response.status == 'ok') {
                    _this.windowNotificationSettings.next(settings);
                    observer.next(response);
                    observer.complete();
                    // console.log(response);
                    // this.auto_assign.next(this.tagsAutomationSettings.auto_assign);
                }
                else {
                    observer.error();
                }
            });
        });
    };
    AdminSettingsService.prototype.getEngagementSettings = function () {
        return this.aEng.asObservable();
    };
    AdminSettingsService.prototype.setEngagementSettings = function (value) {
        localStorage.setItem('aEng', value);
        this.aEng.next(value);
    };
    AdminSettingsService.prototype.getFileSharingSettings = function () {
        return this.fileSharingSettings.asObservable();
    };
    AdminSettingsService.prototype.setFileSharingSettings = function (value) {
        localStorage.setItem('fileSharing', value);
        this.fileSharingSettings.next(value);
    };
    AdminSettingsService.prototype.setCallingSettings = function (value) {
        localStorage.setItem('callSettings', JSON.stringify(value));
        this.callSettings.next(value);
    };
    AdminSettingsService.prototype.setContactSettings = function (value) {
        localStorage.setItem('contactSettings', JSON.stringify(value));
        this.contactSettings.next(value);
    };
    AdminSettingsService.prototype.setWidgetMarketingSettings = function (value) {
        localStorage.setItem('widgetMarketingSettings', JSON.stringify(value));
        this.widgetMarketingSettings.next(value);
    };
    AdminSettingsService.prototype.settingsUpdated = function (value) {
        switch (value.settingsName) {
            case 'chatSettings':
                if (localStorage.getItem('chatSettings')) {
                    var settings = JSON.parse(localStorage.getItem('chatSettings'));
                    settings[value.settingsName] = value.settings;
                    localStorage.setItem('chatSettings', JSON.stringify(settings));
                    this.settingsChanged.next(true);
                }
                break;
            case 'callSettings':
                if (localStorage.getItem('callSettings')) {
                    var settings = JSON.parse(localStorage.getItem('callSettings'));
                    settings = value.settings;
                    localStorage.setItem('callSettings', JSON.stringify(settings));
                    this.settingsChanged.next(true);
                    this.callSettings.next(value.settings);
                }
                break;
            case 'contactSettings':
                if (localStorage.getItem('contactSettings')) {
                    var settings = JSON.parse(localStorage.getItem('contactSettings'));
                    settings = value.settings;
                    localStorage.setItem('contactSettings', JSON.stringify(settings));
                    this.settingsChanged.next(true);
                    this.contactSettings.next(value.settings);
                }
                break;
            case 'widgetMarketingSettings':
                if (localStorage.getItem('widgetMarketingSettings')) {
                    var settings = JSON.parse(localStorage.getItem('widgetMarketingSettings'));
                    settings = value.settings;
                    localStorage.setItem('widgetMarketingSettings', JSON.stringify(settings));
                    this.settingsChanged.next(true);
                    this.widgetMarketingSettings.next(value.settings);
                }
                break;
        }
    };
    AdminSettingsService.prototype.setNSPCallSettings = function (settings) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('updateNSPCallSettings', { settings: settings }, function (response) {
                if (response.status == 'ok') {
                    _this.callSettings.next(settings);
                    localStorage.setItem('callSettings', JSON.stringify(_this.callSettings.getValue()));
                }
                observer.next(response);
                observer.complete();
            });
        });
    };
    AdminSettingsService.prototype.setNSPContactSettings = function (type, settings) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('updateNSPContactSettings', { type: type, settings: settings }, function (response) {
                if (response.status == 'ok') {
                    _this.contactSettings.next(response.settings);
                    localStorage.setItem('contactSettings', JSON.stringify(_this.contactSettings.getValue()));
                }
                observer.next(response);
                observer.complete();
            });
        });
    };
    AdminSettingsService.prototype.setNSPWMSettings = function (settings) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.socket.emit('updateNSPWMSettings', { settings: settings }, function (response) {
                if (response.status == 'ok') {
                    _this.widgetMarketingSettings.next(settings);
                    localStorage.setItem('widgetMarketingSettings', JSON.stringify(_this.widgetMarketingSettings.getValue()));
                }
                observer.next(response);
                observer.complete();
            });
        });
    };
    AdminSettingsService.prototype.getSettingsStatus = function () {
        return this.settingsChanged.asObservable();
    };
    AdminSettingsService = __decorate([
        core_1.Injectable()
    ], AdminSettingsService);
    return AdminSettingsService;
}());
exports.AdminSettingsService = AdminSettingsService;
//# sourceMappingURL=adminSettingsService.js.map