"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
var core_1 = require("@angular/core");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
require("rxjs/add/operator/map");
require("rxjs/add/operator/filter");
//End RxJs Imports
var io = require("socket.io-client");
var SocketService = /** @class */ (function () {
    // private apidummy: string = 'http://192.168.20.118:8000/getCookie/'
    function SocketService(http, _authService) {
        var _this = this;
        this.http = http;
        this._authService = _authService;
        this.status = new BehaviorSubject_1.BehaviorSubject('');
        this.socket = new BehaviorSubject_1.BehaviorSubject(null);
        this.script = new BehaviorSubject_1.BehaviorSubject('');
        this.RedirectURI = '';
        console.log('Socket Service!');
        this._authService.getSocketServer().subscribe(function (serverAddress) {
            _this.serverAddress = serverAddress;
        });
        _authService.getAgent().subscribe(function (data) {
            if (Object.keys(data).length > 0) {
                _this.agent = data;
                //console.log('Got Agent');
            }
        });
        _authService.GetRedirectionURI().subscribe(function (uri) {
            _this.RedirectURI = uri;
        });
        _authService.getSettings().subscribe(function (settings) {
            if (!_this.socket.getValue() && Object.keys(settings).length) {
                var roomNames = (Array.isArray(_this.agent.group)) ? _this.resolveRoomNames(_this.agent.group) : _this.agent.group;
                _this.socket.next(io(_this.serverAddress + _this.agent.nsp, {
                    // transports: ["polling", "websocket"],
                    transports: ["websocket"],
                    secure: true,
                    reconnection: true,
                    reconnectionDelay: 2500,
                    randomizationFactor: 0.6,
                    query: 'type=Agents&location=' + roomNames
                        + '&nickname=' + _this.agent.username
                        + '&email=' + _this.agent.email
                        + '&csid=' + _this.agent.csid
                        + '&acceptingChats=' + settings.applicationSettings.acceptingChatMode
                }));
            }
            _this.socket.subscribe(function (data) {
                if (data) {
                    data.on('connect', function () {
                        // console.log('Socket Connected!');
                        _this.UpdateStatus('Connected');
                        //Preventing Reconnection Flood
                        // console.log('Buffer', (data as any).sendBuffer);
                        //if ((data as any) && (data as any).sendBuffer && (data as any).sendBuffer.length) (data as any).sendBuffer = [];
                    });
                    _this.socket.getValue().on('getSession', function (data) {
                        //console.log(data.sessionId);
                        _authService.RenewSession(data.sessionId);
                    });
                    _this.socket.getValue().on('disconnect', function (data) {
                        // console.log('Socket Disconnected!');
                        _this.UpdateStatus('Disconnected');
                    });
                    _this.socket.getValue().on('reconnect_attempt', function () {
                        var roomNames = (Array.isArray(_this.agent.group)) ? _this.resolveRoomNames(_this.agent.group) : _this.agent.group;
                        data.io.opts.query = 'type=Agents&location=' + roomNames
                            + '&nickname=' + _this.agent.username
                            + '&email=' + _this.agent.email
                            + '&csid=' + _this.agent.csid;
                    });
                    _this.socket.getValue().on('displayScript', function (data) {
                        (data.script.length > 0) ? _this.script.next(data.script[0].script.trim()) : _this.script.next('');
                    });
                }
            });
        });
        // console.log('Socket Service Initialized');
        // console.log(this.socket);
    }
    SocketService.prototype.UpdateStatus = function (status) {
        this.status.next(status);
    };
    SocketService.prototype.GetStatus = function () {
        return this.status.asObservable();
    };
    SocketService.prototype.getScript = function () {
        return this.script.asObservable();
    };
    SocketService.prototype.setScript = function (value) {
        this.script.next(value);
    };
    SocketService.prototype.getSocket = function () {
        return this.socket.asObservable();
    };
    SocketService.prototype.Disconnect = function () {
        var _this = this;
        this.socket.getValue().emit('logout', { sid: this.agent.csid }, function (response) {
            if (response.status == 'ok' || response.status == 'error') {
                _this.socket.next(_this.socket.getValue().disconnect());
                if (_this.RedirectURI)
                    window.location.href = _this.RedirectURI;
                else
                    window.location.reload(true);
            }
        });
    };
    SocketService.prototype.TestingDisconnect = function () {
        this.socket.getValue().disconnect();
    };
    SocketService.prototype.TestingReconnect = function () {
        this.socket.getValue().connect();
    };
    SocketService.prototype.resolveRoomNames = function (roomArray) {
        return roomArray.join(",").replace(/,/g, '|');
    };
    SocketService = __decorate([
        core_1.Injectable()
    ], SocketService);
    return SocketService;
}());
exports.SocketService = SocketService;
//# sourceMappingURL=SocketService.js.map