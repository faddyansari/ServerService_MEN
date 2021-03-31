"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpWindowService = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Observable_1 = require("rxjs/Observable");
var platform = require('platform');
var Fingerprint2 = require("fingerprintjs2");
var HelpWindowService = /** @class */ (function () {
    function HelpWindowService(_socket, _authService, _postMessageService) {
        var _this = this;
        this._socket = _socket;
        this._authService = _authService;
        this._postMessageService = _postMessageService;
        this.windowHelpOpened = new BehaviorSubject_1.BehaviorSubject(true);
        this.sessionResponse = new BehaviorSubject_1.BehaviorSubject({});
        this.subscriptions = [];
        this.Agent = new BehaviorSubject_1.BehaviorSubject({});
        this.license = '';
        this.serverAddress = '';
        this.sid = '';
        this.Session = new BehaviorSubject_1.BehaviorSubject({});
        this.ifReadyFrame = false;
        this.helpStart = false;
        this.subscriptions.push(_authService.getAgent().subscribe(function (data) {
            _this.Agent.next(data);
        }));
        this.subscriptions.push(_socket.getSocket().subscribe(function (data) {
            if (data) {
                _this.socket = data;
            }
        }));
        this.subscriptions.push(this._authService.getServer().subscribe(function (serverAddress) {
            _this.serverAddress = serverAddress;
        }));
        this.subscriptions.push(this._postMessageService.HelpReadyToGiveSession.subscribe(function (data) {
            _this.ifReadyFrame = true;
            if (data) {
                _this.VerifyCompany().subscribe(function (data) {
                    if (_this.ifReadyFrame)
                        _this.FrameReady();
                    //this.FrameReady();
                });
            }
        }));
        this.subscriptions.push(this._postMessageService.NegotiateReadyEvent.subscribe(function (helpWindow) {
            if (helpWindow)
                _this.LoadSession();
        }));
        this.subscriptions.push(this._postMessageService.startSupportChat.subscribe(function (data) {
            //if (data) this.StartChat();
        }));
        //for dev
        this.license = 'b1c3c8fbd308a7f6682ae224dd48c958b2bd32ab';
        this.subscriptions.push(this._authService.helpWindowURL.subscribe(function (url) {
            _this.HelpWindowURL = url;
        }));
        this.subscriptions.push(this._authService.loadscriptDomain.subscribe(function (url) {
            _this.domain = url;
        }));
        //for live
        //this.license = 'eef84f7f450c8fb0cde8cdf767c9cbea5e678671';
    }
    HelpWindowService_1 = HelpWindowService;
    HelpWindowService.prototype.OpenHelpWindow = function (iframe) {
        this.HelpFrame = iframe.nativeElement;
        if (window.document.domain == 'app.beelinks.solutions' || window.document.domain == 'localhost') {
            this.GiveSession();
        }
    };
    HelpWindowService.prototype.GiveSession = function () {
        if (this.HelpFrame && this.HelpFrame.contentWindow) {
            this.HelpFrame.contentWindow.postMessage({
                msg: 'getHelpSession',
                cdnAddress: this.HelpWindowURL,
            }, this.HelpFrame.src);
        }
    };
    HelpWindowService.prototype.FrameReady = function () {
        if (this.HelpFrame && this.HelpFrame.contentWindow) {
            this.HelpFrame.contentWindow.postMessage({
                msg: 'HelpFrameReady'
            }, this.HelpFrame.src);
        }
    };
    HelpWindowService.prototype.VerifyCompany = function () {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            _this.sid = _this.GetSessionID();
            var url = _this.serverAddress + '/loadscript/' + _this.license + '/' + _this.domain + '/' + ((_this.sid) ? _this.sid : '');
            _this.req = new XMLHttpRequest();
            _this.req.open('GET', url);
            _this.req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            _this.req.responseType = 'json';
            _this.req.onreadystatechange = function (e) { return __awaiter(_this, void 0, void 0, function () {
                var token, requestHeaders_1;
                var _this = this;
                return __generator(this, function (_a) {
                    if (this.req.status == 200 && this.req.readyState == XMLHttpRequest.DONE) {
                        token = this.GetDeviceID();
                        if (token && token != undefined && token != "undefined" && token.indexOf('undefined') == -1) {
                            this.deviceID = token.toString();
                            this.returningVisitor = "true";
                        }
                        else {
                            this.GetFingerPrint().subscribe(function (deviceID) {
                                _this.deviceID = deviceID;
                                _this.returningVisitor = "false";
                            });
                        }
                        this.sessionResponse.next(this.req.response);
                        window.nsp = this.req.response.nsp;
                        window.fshare = this.req.response.fileShare;
                        window.allowedCall = this.req.response.allowedCall;
                        window.settings = this.req.response.settings;
                        window.barEnabled = this.req.response.barEnabled;
                        window.avatarColor = this.req.response.avatarColor;
                        window.cwSettings = this.req.response.cwSettings;
                        window.script = this.req.response.userScript;
                        window.__permissions = {
                            news: this.req.response.allowedNews,
                            promotions: this.req.response.allowedPromotions,
                            faqs: this.req.response.allowedFaqs,
                            allowedAgentAvailable: this.req.response.allowedAgentAvailable
                        };
                        //window.script = '';
                        if (!this.req.response.exists) {
                            try {
                                requestHeaders_1 = [];
                                requestHeaders_1.push({ name: "Content-type", value: "application/x-www-form-urlencoded" });
                                //this.req.headers.append()
                                this.GetUserInformation().subscribe(function (userinformation) {
                                    var product = (platform.product) ? encodeURIComponent(platform.product) : undefined;
                                    var manufacturer = (platform.manufacturer) ? encodeURIComponent(platform.manufacturer) : undefined;
                                    var deviceID = _this.deviceID;
                                    var returningVisitor = _this.returningVisitor;
                                    var referrer = (window.document.referrer) ? encodeURIComponent(window.document.referrer) : undefined;
                                    var url = _this.serverAddress + '/createSession'
                                        + _this.req.response.nsp
                                        + '/' + userinformation.countryCode
                                        + '/' + userinformation.country
                                        + '/' + userinformation.query
                                        + '/' + encodeURIComponent(window.location.href)
                                        + '/' + 'Unregistered'
                                        + '/' + 'Guest' + new Date().toLocaleTimeString().split(':').join('').split(' ')[0]
                                        + '/' + encodeURIComponent(platform.os.family) //Operating System Name (windows , Mac , Android etc)
                                        + '/' + encodeURIComponent(platform.name) //Browser Name
                                        + '/' + encodeURIComponent(platform.version) //Browser Version Name
                                        + '/' + product //Gets value if Mobile
                                        + '/' + manufacturer //Mobile Manufacturer if Mobile/Tablet or Other than Desktop
                                        + '/' + referrer
                                        + '/' + deviceID
                                        + '/' + returningVisitor;
                                    _this.GetSession(url, 'GET', {}, requestHeaders_1, 'json').subscribe(function (session) {
                                        _this.Session.next(session);
                                        _this.SetSessionID(session.csid);
                                        _this.SetDeviceID(session.deviceID);
                                        observer.next(session);
                                        observer.complete();
                                    });
                                });
                            }
                            catch (error) {
                                observer.next('Error in Getting User Information');
                            }
                        }
                        else {
                            this.Session.next(this.req.response.session);
                            this.sessionResponse.next(this.req.response);
                            observer.next(this.req.response.session);
                        }
                    }
                    else {
                        //Do Nothing For Error
                    }
                    return [2 /*return*/];
                });
            }); };
            _this.req.send();
        });
    };
    HelpWindowService.prototype.SetSessionID = function (sid) {
        localStorage.setItem('__helpSid', sid);
    };
    HelpWindowService.prototype.SetDeviceID = function (token) {
        localStorage.setItem('__helpdeviceToken', token);
    };
    HelpWindowService.prototype.GetSessionID = function () {
        return localStorage.getItem('__helpSid') || '';
    };
    HelpWindowService.prototype.GetDeviceID = function () {
        return localStorage.getItem('__helpdeviceToken') || undefined;
    };
    HelpWindowService.prototype.GetUserInformation = function () {
        return new Observable_1.Observable(function (observer) {
            var req = new XMLHttpRequest();
            req.open('GET', 'https://extreme-ip-lookup.com/json/', true);
            req.onreadystatechange = function (e) {
                try {
                    if (req.status == 200 && req.readyState == 4) {
                        observer.next(JSON.parse(req.response));
                        observer.complete();
                    }
                }
                catch (error) {
                    observer.error({ error: 'Unable To Get User Information' });
                }
            };
            req.send();
        });
    };
    HelpWindowService.prototype.GetSession = function (url, type, data, headers, responseType) {
        return new Observable_1.Observable(function (observer) {
            var req = new XMLHttpRequest();
            if (responseType)
                req.responseType = responseType;
            req.open(type, url, true);
            if (headers && headers.length) {
                headers.map(function (header) {
                    req.setRequestHeader(header.name, header.value);
                });
            }
            //req.setRequestHeader()
            req.send(data);
            req.onreadystatechange = function (e) {
                try {
                    if (req.readyState == 4) {
                        if (req.status >= 200 && req.status < 400) {
                            observer.next(req.response);
                            observer.complete();
                        }
                        else
                            observer.error(req.response);
                    }
                }
                catch (error) {
                    observer.error(req.response);
                }
            };
        });
    };
    HelpWindowService.prototype.LoadSession = function (window) {
        // console.log(this.Session.getValue());
        this.helpStart = true;
        if (this.Agent.getValue().username)
            this.Session.getValue().username = this.Agent.getValue().username;
        if (this.Agent.getValue().email)
            this.Session.getValue().email = this.Agent.getValue().email;
        var payload = {
            serverAddress: this.serverAddress,
            fshare: this.sessionResponse.getValue().fileShare,
            settings: this.sessionResponse.getValue().cwSettings,
            showLoader: this.sessionResponse.getValue().script && (this.sessionResponse.getValue().script.trim()) ? true : false,
            session: this.Session.getValue(),
            helpWindow: true,
        };
        if (this.HelpFrame && this.HelpFrame.contentWindow) {
            this.HelpFrame.contentWindow.postMessage({
                msg: 'HelpWindowReady',
                payload: payload
            }, this.HelpFrame.src);
        }
    };
    HelpWindowService.prototype.GetFingerPrint = function () {
        return new Observable_1.Observable(function (observer) {
            var options = {
                excludeDoNotTrack: true,
                userDefinedFonts: true,
                fonts: {
                    extendedJsFonts: true
                },
                excludes: {
                    deviceToolbar: true,
                    enumerateDevices: true
                }
            };
            var hash = '';
            try {
                Fingerprint2.get(options, function (result) {
                    var a = '';
                    Object.keys(result).map(function (key) {
                        a += result[key].value;
                    });
                    hash = HelpWindowService_1.vstr2hash(a).toString();
                    observer.next(hash);
                    observer.complete();
                });
            }
            catch (_a) {
                observer.error("Cannot find Device ID");
            }
        });
    };
    HelpWindowService.vstr2hash = function (s) {
        var nHash = 0;
        if (!s.length)
            return nHash;
        for (var i = 0, imax = s.length, n; i < imax; ++i) {
            n = s.charCodeAt(i);
            nHash = ((nHash << 5) - nHash) + n;
            nHash = nHash & nHash;
        }
        return Math.abs(nHash);
    };
    var HelpWindowService_1;
    HelpWindowService = HelpWindowService_1 = __decorate([
        core_1.Injectable()
    ], HelpWindowService);
    return HelpWindowService;
}());
exports.HelpWindowService = HelpWindowService;
//# sourceMappingURL=help-window.service.js.map