"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var environment_1 = require("../environments/environment");
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/observable/throw");
var Observable_1 = require("rxjs/Observable");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/delay");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/debounceTime");
require("rxjs/add/operator/mapTo");
require("rxjs/add/observable/timer");
require("rxjs/add/operator/throttleTime");
require("rxjs/add/operator/switchMap");
var AuthService = /** @class */ (function () {
    // private AdminSettings: BehaviorSubject<any> = new BehaviorSubject(undefined);
    function AuthService(http, _router, _globalApplicationStateService, dialog) {
        this.http = http;
        this._router = _router;
        this._globalApplicationStateService = _globalApplicationStateService;
        this.dialog = dialog;
        this.production = environment_1.environment.production;
        this.redirectURI = environment_1.environment.redirectURI;
        //private redirectURI=''
        this.mediaServiceURL = environment_1.environment.mediaService;
        this.analyticsServiceURL = environment_1.environment.analyticsURI;
        this.analyticsPythonServiceURL = environment_1.environment.analyticsPythonURI;
        this.archiveURI = environment_1.environment.archiveURI;
        //For Development Local
        this.server = environment_1.environment.server;
        this.socketServer = environment_1.environment.socketServer;
        this.helpWindowAddress = environment_1.environment.helpWindowAddress;
        this.helpFrameUrl = environment_1.environment.helpFrameURL;
        this.LoadscriptCallDomain = environment_1.environment.LoadscriptCallDomain;
        this.botServiceAddress = environment_1.environment.botURL;
        this.restServiceURL = environment_1.environment.restServer;
        this.whatsAppSrviceURl = environment_1.environment.wappServer;
        this.FBMicroserviceURI = environment_1.environment.FBMicroserviceURI;
        // For Local
        // private server = 'http://192.168.20.90:8000';
        // private socketServer = 'http://192.168.20.90:8000';
        // For Development
        // private server = 'https://dev.bizzchats.com';
        // private socketServer = 'https://dev.bizzchats.com';
        // For Production NEW
        // private server = '';
        // private socketServer = 'https://live.beelinks.solutions';
        // private helpWindowAddress = 'https://app.beelinks.solutions';
        // private helpFrameUrl = 'https://app.beelinks.solutions/cbam/html/popup-frame.html';
        // private LoadscriptCallDomain = 'beelinks.solutions'
        //For Local Live
        // private server = 'http://ec2-52-38-249-210.us-west-2.compute.amazonaws.com:8000';
        // private socketServer = 'https://live.beelinks.solutions';
        // private helpWindowAddress = 'http://ec2-52-38-249-210.us-west-2.compute.amazonaws.com:8000';
        // private helpFrameUrl = 'http://ec2-52-38-249-210.us-west-2.compute.amazonaws.com:8000/cbam/html/popup-frame.html';
        // private LoadscriptCallDomain = 'beelinks.solutions'
        //For Local Live
        // private server = 'http://ec2-52-38-249-210.us-west-2.compute.amazonaws.com:8000';
        // private socketServer = 'https://live.beelinks.solutions';
        // private helpWindowAddress = 'http://ec2-52-38-249-210.us-west-2.compute.amazonaws.com:8000';
        // private helpFrameUrl = 'http://ec2-52-38-249-210.us-west-2.compute.amazonaws.com:8000/cbam/html/popup-frame.html';
        // private LoadscriptCallDomain = 'beelinks.solutions'
        // For Production OLD
        // private server = '';
        // private socketServer = 'https://live.bizzchats.com';
        this.Agent = new BehaviorSubject_1.BehaviorSubject({});
        this.isLogin = new BehaviorSubject_1.BehaviorSubject(false);
        this.groups = new BehaviorSubject_1.BehaviorSubject([]);
        this.url = new BehaviorSubject_1.BehaviorSubject(this.server);
        // private agentServerURL: BehaviorSubject<string> = new BehaviorSubject(this.agentServer);
        this.socketAddress = new BehaviorSubject_1.BehaviorSubject(this.socketServer);
        this.requesting = new BehaviorSubject_1.BehaviorSubject(false);
        this.settings = new BehaviorSubject_1.BehaviorSubject({});
        this.RedirectUI = new BehaviorSubject_1.BehaviorSubject(this.redirectURI);
        this.Notification = new Subject_1.Subject();
        this.MediaServiceURL = new BehaviorSubject_1.BehaviorSubject(this.mediaServiceURL);
        this.botServiceURL = new BehaviorSubject_1.BehaviorSubject(this.botServiceAddress);
        this.RestServiceURL = new BehaviorSubject_1.BehaviorSubject(this.restServiceURL);
        this.WhatsAppAserviceURL = new BehaviorSubject_1.BehaviorSubject(this.whatsAppSrviceURl);
        this.analyticsURL = new BehaviorSubject_1.BehaviorSubject(this.analyticsServiceURL);
        this.archiveURL = new BehaviorSubject_1.BehaviorSubject(this.archiveURI);
        this.analyticsPythonURL = new BehaviorSubject_1.BehaviorSubject(this.analyticsPythonServiceURL);
        this.helpWindowURL = new BehaviorSubject_1.BehaviorSubject(this.helpWindowAddress);
        this.helpWindowFrameURL = new BehaviorSubject_1.BehaviorSubject(this.helpFrameUrl);
        this.loadscriptDomain = new BehaviorSubject_1.BehaviorSubject(this.LoadscriptCallDomain);
        this.Production = new BehaviorSubject_1.BehaviorSubject(this.production);
        this.permissions = new BehaviorSubject_1.BehaviorSubject({});
        this.SBT = new BehaviorSubject_1.BehaviorSubject(environment_1.environment.sbt);
        this.showAuthCode = new BehaviorSubject_1.BehaviorSubject(false);
        this.FacebookRestUrl = new BehaviorSubject_1.BehaviorSubject(this.FBMicroserviceURI);
        this.packageInfo = new BehaviorSubject_1.BehaviorSubject(undefined);
        this.incorrect = false;
        this.tabID = undefined;
        console.log('Authentication Service Initialized');
    }
    AuthService.prototype.getServer = function () {
        return this.url.asObservable();
    };
    // public getAgentServer(): Observable<string> {
    //     return this.agentServerURL.asObservable();
    // }
    AuthService.prototype.getSocketServer = function () {
        return this.socketAddress.asObservable();
    };
    AuthService.prototype.GetRedirectionURI = function () {
        return this.RedirectUI.asObservable();
    };
    AuthService.prototype.GetMediaServiceURI = function () {
        return this.MediaServiceURL.asObservable();
    };
    AuthService.prototype.CheckLogin = function () {
        var _this = this;
        var agent = JSON.parse(localStorage.getItem('currentUser')) || {};
        // let settings = JSON.parse(localStorage.getItem('settings')) || {}
        if (Object.keys(agent).length > 0) {
            this.requesting.next(true);
            this.http.post(this.restServiceURL + '/agent/authenticate', { csid: agent.csid }, { withCredentials: true }).subscribe(function (data) {
                agent.callingState = data.json();
                if (data.status == 200) {
                    _this.requesting.next(false);
                    _this.Agent.next(agent);
                    // console.log(this.Agent.getValue());
                    _this.getSettingsFromBackendObservable(agent.email, agent.nsp).subscribe(function (response) {
                        // if (settings.applicationSettings) {
                        //     if ((settings.applicationSettings as Object).hasOwnProperty('acceptingChatMode')) {
                        //         settings.applicationSettings.acceptingChatMode =
                        //         localStorage.setItem('settings', JSON.stringify(this.settings.getValue()));
                        //     }
                        // }
                        // this.settings.next(settings);
                        _this._globalApplicationStateService.setRouteAccess();
                        _this._globalApplicationStateService.setContactRouteAccess(_this.Agent.getValue().nsp);
                        _this.isLogin.next(true);
                        _this._globalApplicationStateService.setDisplayReady(true);
                    });
                    // this._globalApplicationStateService.setContactRouteAccess(this.Agent.getValue().nsp);
                    // this.isLogin.next(true);
                    // this._globalApplicationStateService.setDisplayReady(true);
                }
                else {
                    _this.logout();
                    _this.isLogin.next(false);
                    _this.requesting.next(false);
                    _this._globalApplicationStateService.setDisplayReady(true);
                }
            }, function (err) {
                // console.log('Logout');
                _this.requesting.next(false);
                _this.logout();
                _this.isLogin.next(false);
                if (!_this.production)
                    _this._globalApplicationStateService.setDisplayReady(true);
                else
                    window.location.href = _this.redirectURI;
            });
        }
        else {
            if (!this.production)
                this._globalApplicationStateService.setDisplayReady(true);
            else
                window.location.href = this.redirectURI;
        }
    };
    AuthService.prototype.login = function (email, password) {
        var _this = this;
        var urlSearchParams = new http_1.URLSearchParams('', new http_1.QueryEncoder());
        urlSearchParams.append('email', encodeURIComponent(email));
        urlSearchParams.append('password', encodeURIComponent(password));
        this.requesting.next(true);
        return this.http.post(this.restServiceURL + "/agent/getUser/", urlSearchParams, {
            withCredentials: true,
        }).subscribe(function (data) {
            //console.log('Agent Get User');
            // console.log(JSON.parse(data.text())[0]);
            if (data.status == 203) {
                _this.showAuthCode.next(true);
                _this.requesting.next(false);
            }
            else {
                _this.Agent.next(JSON.parse(data.text())[0]);
                // console.log(this.Agent.getValue());
                // this.isLogin.next(true);
                localStorage.setItem('currentUser', JSON.stringify(_this.Agent.getValue()));
                //console.log('Getting Settings');
                // this.getSettingsFromBackend(this.Agent.getValue().email, this.Agent.getValue().nsp);
                // this._globalApplicationStateService.setContactRouteAccess(this.Agent.getValue().nsp);
                _this.getSettingsFromBackendObservable(_this.Agent.getValue().email, _this.Agent.getValue().nsp).subscribe(function (response) {
                    _this._globalApplicationStateService.setRouteAccess();
                    _this._globalApplicationStateService.setContactRouteAccess(_this.Agent.getValue().nsp);
                    var redirection = localStorage.getItem('redirectURL');
                    _this.requesting.next(false);
                    _this.isLogin.next(true);
                    _this._globalApplicationStateService.setDisplayReady(true);
                    if (redirection) {
                        setTimeout(function () {
                            // console.log(redirection);
                            _this._globalApplicationStateService.NavigateTo(redirection);
                        }, 1000);
                        // localStorage.removeItem('redirectURL');
                    }
                });
            }
        }, function (err) {
            //console.log(err.json());
            _this.requesting.next(false);
            if (err.json().status == 'loggedin') {
                _this.setNotification('Already logged on other devices', 'error', 'warning');
                setTimeout(function () { _this.CheckLogin(); /** this.dialog.closeAll(); */ }, 2000);
            }
            else if (err.json().status == 'incorrectcredintials') {
                _this.incorrect = true;
                _this.setNotification('Please Provide A Valid Email or Password', 'error', 'warning');
            }
            else if (err.json().status == 'unauthorized') {
                console.log('Unauthorized');
                _this.setNotification('Unauthorized!', 'error', 'warning');
            }
            return Observable_1.Observable.throw(err.json());
        });
    };
    AuthService.prototype.SubmitAccessCode = function (code) {
        var _this = this;
        var urlSearchParams = new http_1.URLSearchParams('', new http_1.QueryEncoder());
        urlSearchParams.append('code', encodeURIComponent(code));
        this.requesting.next(true);
        // console.log(code)
        return this.http.post(this.restServiceURL + "/agent/validateCode/", urlSearchParams, {
            withCredentials: true,
        }).subscribe(function (data) {
            // console.log(data)
            //console.log('Agent Get User');
            // console.log(JSON.parse(data.text())[0]);
            if (data.status == 203) {
                _this.showAuthCode.next(true);
            }
            else {
                _this.Agent.next(JSON.parse(data.text())[0]);
                // console.log(this.Agent.getValue());
                // this.isLogin.next(true);
                localStorage.setItem('currentUser', JSON.stringify(_this.Agent.getValue()));
                //console.log('Getting Settings');
                // this.getSettingsFromBackend(this.Agent.getValue().email, this.Agent.getValue().nsp);
                // this._globalApplicationStateService.setContactRouteAccess(this.Agent.getValue().nsp);
                _this.getSettingsFromBackendObservable(_this.Agent.getValue().email, _this.Agent.getValue().nsp).subscribe(function (response) {
                    _this._globalApplicationStateService.setRouteAccess();
                    _this._globalApplicationStateService.setContactRouteAccess(_this.Agent.getValue().nsp);
                    var redirection = localStorage.getItem('redirectURL');
                    _this.requesting.next(false);
                    _this.isLogin.next(true);
                    _this._globalApplicationStateService.setDisplayReady(true);
                    _this.showAuthCode.next(false);
                    if (redirection) {
                        setTimeout(function () {
                            // console.log(redirection);
                            _this._globalApplicationStateService.NavigateTo(redirection);
                        }, 1000);
                        // localStorage.removeItem('redirectURL');
                    }
                });
            }
        }, function (err) {
            //console.log(err.json());
            _this.requesting.next(false);
            if (err.json().status == 'loggedin') {
                _this.setNotification('Already logged on other devices', 'error', 'warning');
                setTimeout(function () { _this.CheckLogin(); /** this.dialog.closeAll(); */ }, 2000);
            }
            else if (err.json().status == 'invalidCode') {
                _this.incorrect = true;
                _this.setNotification('Please enter a valid code', 'error', 'warning');
            }
            else if (err.json().status == 'unauthorized') {
                console.log('Unauthorized');
                _this.setNotification('Unauthorized!', 'error', 'warning');
            }
            return Observable_1.Observable.throw(err.json());
        });
    };
    AuthService.prototype.otpLogin = function (email, otp) {
    };
    AuthService.prototype.isForgotPasswordEnabled = function (email) {
        var _this = this;
        var urlSearchParams = new http_1.URLSearchParams('', new http_1.QueryEncoder());
        urlSearchParams.append('email', encodeURIComponent(email));
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.restServiceURL + "/agent/checkForgotPassword", urlSearchParams, {
                withCredentials: true,
            }).subscribe(function (data) {
                if (data.status == 200) {
                    observer.next(true);
                    observer.complete();
                }
                else {
                    observer.next(false);
                    observer.complete();
                }
            }, function (err) {
                observer.next(false);
                observer.complete();
            });
        });
    };
    /**
     * @Note
     * On Logout Clear Storage added even on Error (Enhancement after multiple device Logins)
     */
    AuthService.prototype.logout = function () {
        var _this = this;
        this.requesting.next(true);
        this.http.post(this.restServiceURL + '/agent/logout/', { csid: this.Agent.getValue().csid || JSON.parse(localStorage.getItem('currentUser')).csid }, { withCredentials: true }).subscribe(function (data) {
            _this.requesting.next(false);
            // console.log('Logged Out');
            // console.log(data);
            _this.Agent.next({});
            localStorage.removeItem('currentUser');
            localStorage.removeItem('settings');
            localStorage.removeItem('chatSettings');
            localStorage.removeItem('aEng');
            localStorage.removeItem('fileSharing');
            localStorage.removeItem('chatBotCases');
            localStorage.removeItem('chatBotMachines');
            localStorage.removeItem('chatBotWorkFlows');
            localStorage.removeItem('callSettings');
            localStorage.removeItem('widgetMarketingSettings');
            localStorage.removeItem('redirectURL');
            localStorage.removeItem('ticketFilters');
            localStorage.removeItem('analytics-agentactivity');
            localStorage.removeItem('analytics-agentscorecard');
            //localStorage.removeItem('logout');
            if (!_this.production) {
                _this._globalApplicationStateService.setDisplayReady(true);
                _this.isLogin.next(false);
            }
            else {
                _this.isLogin.next(false);
                _this._globalApplicationStateService.setDisplayReady(false);
                _this._globalApplicationStateService.setState('blank');
                setTimeout(function () { window.location.href = _this.redirectURI; }, 2000);
            }
            window.postMessage({ type: 'login', value: false }, "*");
        }, function (err) {
            _this.requesting.next(false);
            _this.Agent.next({});
            localStorage.removeItem('currentUser');
            localStorage.removeItem('settings');
            localStorage.removeItem('chatSettings');
            localStorage.removeItem('aEng');
            localStorage.removeItem('fileSharing');
            localStorage.removeItem('chatBotCases');
            localStorage.removeItem('chatBotMachines');
            localStorage.removeItem('chatBotWorkFlows');
            localStorage.removeItem('callSettings');
            localStorage.removeItem('widgetMarketingSettings');
            //localStorage.removeItem('logout');
            if (!_this.production) {
                _this._globalApplicationStateService.setDisplayReady(true);
                _this.isLogin.next(false);
            }
            else {
                _this.isLogin.next(false);
                _this._globalApplicationStateService.setDisplayReady(false);
                _this._globalApplicationStateService.setState('blank');
                setTimeout(function () { window.location.href = _this.redirectURI; }, 2000);
            }
            window.postMessage({ type: 'login', value: false }, "*");
        });
    };
    AuthService.prototype.getSettingsFromBackend = function (email, nsp) {
        var _this = this;
        this.http.post(this.restServiceURL + '/agent/getSettings', { email: email, nsp: nsp }, { withCredentials: true }).subscribe(function (data) {
            // console.log('Got Settings');
            // console.log(JSON.parse(data.text()));
            var savedSettings = JSON.parse(data.text());
            if (!savedSettings.applicationSettings) {
                savedSettings.applicationSettings = { acceptingChatMode: true };
            }
            _this.permissions.next(savedSettings.permissions);
            var permissions = savedSettings.permissions[_this.Agent.getValue().role];
            savedSettings.permissions = permissions;
            _this.settings.next(savedSettings);
            localStorage.setItem('settings', JSON.stringify(_this.settings.getValue()));
            window.postMessage({ type: 'login', value: true }, "*");
        }, function (err) { });
    };
    AuthService.prototype.getSettingsFromBackendObservable = function (email, nsp) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.http.post(_this.restServiceURL + '/agent/getSettings', { email: email, nsp: nsp }, { withCredentials: true }).subscribe(function (data) {
                // console.log('Got Settings');
                // console.log(JSON.parse(data.text()));
                var savedSettings = JSON.parse(data.text());
                // console.log(data.text());
                // let oldSettings = JSON.parse(localStorage.getItem('settings'));
                if (savedSettings && savedSettings.applicationSettings) {
                    savedSettings.applicationSettings = { acceptingChatMode: savedSettings.applicationSettings.acceptingChatMode };
                }
                else {
                    if (!savedSettings.applicationSettings) {
                        savedSettings.applicationSettings = { acceptingChatMode: true };
                    }
                }
                _this.permissions.next(savedSettings.permissions);
                _this.packageInfo.next(savedSettings.package);
                var permissions = savedSettings.permissions[_this.Agent.getValue().role];
                if (_this.Agent.getValue().role == 'superadmin') {
                    permissions.authentication = savedSettings.authentication;
                }
                delete savedSettings.authentication;
                delete savedSettings.package;
                savedSettings.permissions = permissions;
                _this.settings.next(savedSettings);
                localStorage.setItem('settings', JSON.stringify(_this.settings.getValue()));
                // console.log(this.settings.getValue())
                window.postMessage({ type: 'login', value: true }, "*");
                observer.next(true);
                observer.complete();
            });
        });
    };
    AuthService.prototype.getSettings = function () {
        return this.settings.asObservable();
    };
    AuthService.prototype.getPackageInfo = function () {
        return this.packageInfo.asObservable();
    };
    AuthService.prototype.updateAutomatedMessages = function (hashTag, responseText) {
        this.settings.getValue().automatedMessages.push({ hashTag: hashTag, responseText: responseText });
        this.settings.next(this.settings.getValue());
        localStorage.setItem('settings', JSON.stringify(this.settings.getValue()));
    };
    AuthService.prototype.EditupdateAutomatedMessages = function (hashTag, responseText) {
        this.settings.getValue().automatedMessages.map(function (automatedMessage) {
            if (automatedMessage.hashTag == hashTag) {
                automatedMessage.responseText = responseText;
            }
        });
        this.settings.next(this.settings.getValue());
        localStorage.setItem('settings', JSON.stringify(this.settings.getValue()));
    };
    AuthService.prototype.DeleteAutomatedMessage = function (hashTag) {
        this.settings.getValue().automatedMessages = this.settings.getValue().automatedMessages.filter(function (automatedMessage) {
            if (automatedMessage.hashTag != hashTag) {
                return automatedMessage;
            }
        });
        this.settings.next(this.settings.getValue());
        localStorage.setItem('settings', JSON.stringify(this.settings.getValue()));
    };
    AuthService.prototype.getRequestState = function () {
        return this.requesting.asObservable();
    };
    AuthService.prototype.setRequestState = function (state) {
        return this.requesting.next(state);
    };
    AuthService.prototype.getAgent = function () {
        return this.Agent.asObservable();
    };
    AuthService.prototype.isLoggedin = function () {
        return this.isLogin.asObservable();
    };
    AuthService.prototype.RenewSession = function (session) {
        this.Agent.getValue().loginsession = session;
        localStorage.setItem('currentUser', JSON.stringify(this.Agent.getValue()));
    };
    AuthService.prototype.getGroups = function () {
        return this.groups.asObservable();
    };
    AuthService.prototype.RegisterAgent = function (agentProfile) {
        // console.log('Register Agent Client');
        return this.http.post(this.restServiceURL + '/agent/registerAgent/', { agent: agentProfile })
            .delay(1500)
            .map(function (response) { return response.json(); })
            .catch(function (err) { return Observable_1.Observable.throw(err.json()); });
    };
    AuthService.prototype.CreateContact = function (contactProfile) {
        // console.log('Create Contact');
        return this.http.post(this.restServiceURL + '/contact/createContact/', { contact: contactProfile })
            .delay(1500)
            .map(function (response) { response.json(); })
            .catch(function (err) { return Observable_1.Observable.throw(err.json()); });
    };
    AuthService.prototype.UpdateSelectedAgent = function (agentProperties) {
        var agent = this.Agent.getValue();
        agent.first_name = agentProperties.first_name;
        agent.last_name = agentProperties.last_name;
        agent.nickname = agentProperties.nickname;
        agent.phone_no = agentProperties.phone_no;
        agent.role = agentProperties.role;
        this.Agent.next(agent);
        localStorage.setItem('currentUser', JSON.stringify(this.Agent.getValue()));
    };
    AuthService.prototype.ValidateEmail = function (email) {
        return this.http.post(this.restServiceURL + '/agent/validate/', { email: email })
            .map(function (response) { response.json(); })
            .catch(function (err) { return Observable_1.Observable.throw(err.json()); })
            .debounceTime(3000);
    };
    AuthService.prototype.ValidateWebsite = function (url) {
        var _this = this;
        return this.http.post(this.restServiceURL + '/register/validateURL/', { url: url })
            .map(function (response) { _this.requesting.next(false); response.json(); })
            .catch(function (err) { _this.requesting.next(false); return Observable_1.Observable.throw(err.json()); })
            .debounceTime(3000);
    };
    AuthService.prototype.getNotification = function () {
        return this.Notification.asObservable();
    };
    AuthService.prototype.setNotification = function (notifcationMessage, type, icon) {
        var notification = {
            msg: notifcationMessage,
            type: type,
            img: icon
        };
        this.Notification.next(notification);
    };
    //#region Application Settings Functions
    AuthService.prototype.setAcceptingChatMode = function (acceptingChatMode) {
        var settings = JSON.parse(localStorage.getItem('settings'));
        settings.applicationSettings.acceptingChatMode = acceptingChatMode;
        localStorage.setItem('settings', JSON.stringify(settings));
        this.settings.next(settings);
        // console.log(this.settings.getValue());
    };
    AuthService.prototype.UpdateAgentPermissions = function (permissions) {
        var settings = JSON.parse(localStorage.getItem('settings'));
        settings.permissions = permissions[this.Agent.getValue().role];
        localStorage.setItem('settings', JSON.stringify(settings));
        this.settings.next(settings);
        this.permissions.next(permissions);
        // console.log(this.settings.getValue().permissions);
    };
    AuthService.prototype.UpdateAuthPermissions = function (permission) {
        if (this.Agent.getValue().role == 'superadmin') {
            var settings = JSON.parse(localStorage.getItem('settings'));
            settings.permissions.authentication = permission;
            localStorage.setItem('settings', JSON.stringify(settings));
            this.settings.next(settings);
        }
        // console.log(this.settings.getValue().permissions);
    };
    AuthService.prototype.UpdateNotifPermissions = function (permissions) {
        var settings = JSON.parse(localStorage.getItem('settings'));
        settings.windowNotifications = permissions;
        localStorage.setItem('settings', JSON.stringify(settings));
        this.settings.next(settings);
        // console.log(this.settings.getValue().permissions);
    };
    AuthService.prototype.updateAgentProfileImage = function (url) {
        this.Agent.getValue().image = url;
        localStorage.setItem('currentUser', JSON.stringify(this.Agent.getValue()));
        this.Agent.next(this.Agent.getValue());
        // console.log(this.settings.getValue());
    };
    AuthService = __decorate([
        core_1.Injectable()
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=AuthenticationService.js.map